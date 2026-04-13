import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RunboxInstance } from 'runboxjs';
import { useTranslation } from 'react-i18next';

import { TopBar } from './components/TopBar';
import { ActivityBar } from './components/ActivityBar';
import { Explorer } from './components/Explorer';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { Terminal } from './components/Terminal';
import { TemplatesSidebar } from './components/TemplatesSidebar';
import { ConfirmModal } from './components/ConfirmModal';
import { useFileSystem, type ConfirmRequestOptions } from './hooks/useFileSystem';
import { RunboxLog } from '../../components/RunboxLog';

type DemoPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

interface DemoRunboxConfig {
  packageManager?: DemoPackageManager;
  install?: boolean;
  command?: string;
  preRun?: string[];
}

interface DemoPackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  runbox?: DemoRunboxConfig;
}

interface ExecResult {
  stdout?: string;
  stderr?: string;
  exit_code: number;
}

const LOCK_FILE_PATHS = ['/package-lock.json', '/pnpm-lock.yaml', '/yarn.lock', '/bun.lock'] as const;

interface PyodideRuntime {
  FS: {
    analyzePath: (path: string) => { exists: boolean };
    mkdirTree: (path: string) => void;
    writeFile: (path: string, data: string) => void;
  };
  globals: {
    set: (name: string, value: unknown) => void;
    delete: (name: string) => void;
  };
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

let pyodideRuntimePromise: Promise<PyodideRuntime> | null = null;

function detectPackageManager(files: Record<string, string>, hint?: DemoPackageManager): DemoPackageManager {
  if (hint) return hint;
  if (files['/pnpm-lock.yaml']) return 'pnpm';
  if (files['/yarn.lock']) return 'yarn';
  if (files['/bun.lock']) return 'bun';
  return 'npm';
}

function lockfilePathFor(pm: DemoPackageManager): (typeof LOCK_FILE_PATHS)[number] {
  switch (pm) {
    case 'pnpm':
      return '/pnpm-lock.yaml';
    case 'yarn':
      return '/yarn.lock';
    case 'bun':
      return '/bun.lock';
    default:
      return '/package-lock.json';
  }
}

function normalizeVersionSpec(spec: string | undefined): string {
  if (!spec || spec === 'latest') return '1.0.0';
  const normalized = spec.trim().replace(/^[^\d]+/, '');
  return normalized || '1.0.0';
}

function buildGeneratedLockfile(
  pm: DemoPackageManager,
  packageJson: DemoPackageJson | null,
  resolvedVersions: Record<string, string>
): { path: string; content: string } | null {
  if (!packageJson) return null;

  const deps = packageJson.dependencies ?? {};
  const devDeps = packageJson.devDependencies ?? {};
  const entries = [
    ...Object.entries(deps).map(([name, spec]) => ({ name, spec, dev: false })),
    ...Object.entries(devDeps).map(([name, spec]) => ({ name, spec, dev: true }))
  ];

  if (entries.length === 0) return null;

  const path = lockfilePathFor(pm);

  if (pm === 'pnpm') {
    const lines: string[] = ["lockfileVersion: '9.0'", '', 'importers:', '  .:', '    dependencies:'];
    for (const entry of entries.filter((e) => !e.dev)) {
      const version = resolvedVersions[entry.name] ?? normalizeVersionSpec(entry.spec);
      lines.push(`      ${entry.name}:`);
      lines.push(`        specifier: "${entry.spec}"`);
      lines.push(`        version: "${version}"`);
    }
    const devOnly = entries.filter((e) => e.dev);
    if (devOnly.length > 0) {
      lines.push('    devDependencies:');
      for (const entry of devOnly) {
        const version = resolvedVersions[entry.name] ?? normalizeVersionSpec(entry.spec);
        lines.push(`      ${entry.name}:`);
        lines.push(`        specifier: "${entry.spec}"`);
        lines.push(`        version: "${version}"`);
      }
    }
    lines.push('', 'packages:');
    for (const entry of entries) {
      const version = resolvedVersions[entry.name] ?? normalizeVersionSpec(entry.spec);
      lines.push(`  /${entry.name}@${version}:`);
      lines.push('    resolution:');
      lines.push(`      integrity: sha512-generated-${entry.name.replace(/[^a-z0-9]/gi, '')}`);
    }
    return { path, content: lines.join('\n') + '\n' };
  }

  if (pm === 'yarn') {
    const lines = ['# yarn lockfile v1', ''];
    for (const entry of entries) {
      const version = resolvedVersions[entry.name] ?? normalizeVersionSpec(entry.spec);
      lines.push(`"${entry.name}@${entry.spec}":`);
      lines.push(`  version "${version}"`);
      lines.push(`  resolved "https://registry.yarnpkg.com/${entry.name}/-/${entry.name}-${version}.tgz"`);
      lines.push('  integrity sha512-generated');
      lines.push('');
    }
    return { path, content: lines.join('\n') };
  }

  const lockPackages: Record<string, unknown> = {
    '': {
      name: packageJson.name ?? 'app',
      version: packageJson.version ?? '1.0.0',
      dependencies: deps,
      devDependencies: devDeps
    }
  };

  for (const entry of entries) {
    const version = resolvedVersions[entry.name] ?? normalizeVersionSpec(entry.spec);
    lockPackages[`node_modules/${entry.name}`] = {
      version,
      resolved: `https://registry.npmjs.org/${entry.name}/-/${entry.name}-${version}.tgz`,
      integrity: 'sha512-generated'
    };
  }

  return {
    path,
    content: JSON.stringify(
      {
        name: packageJson.name ?? 'app',
        version: packageJson.version ?? '1.0.0',
        lockfileVersion: 3,
        requires: true,
        packages: lockPackages
      },
      null,
      2
    )
  };
}

function parsePythonScriptPath(command: string): string | null {
  const parts = command.trim().split(/\s+/);
  if (parts.length < 2) return null;
  if (parts[0] !== 'python' && parts[0] !== 'python3') return null;
  const candidate = parts[1];
  if (!candidate || candidate.startsWith('-')) return null;
  return candidate.startsWith('/') ? candidate : `/${candidate}`;
}

async function loadPyodideRuntime(): Promise<PyodideRuntime> {
  if (!pyodideRuntimePromise) {
    pyodideRuntimePromise = (async () => {
      const version = '0.27.7';
      const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;
      const pyodideModule = await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`);
      const runtime = await pyodideModule.loadPyodide({ indexURL });
      return runtime as PyodideRuntime;
    })();
  }
  return pyodideRuntimePromise;
}

async function runPythonScriptWithPyodide(
  command: string,
  files: Record<string, string>
): Promise<ExecResult | null> {
  const scriptPath = parsePythonScriptPath(command);
  if (!scriptPath) return null;

  const scriptCode = files[scriptPath];
  if (typeof scriptCode !== 'string') {
    return {
      stdout: '',
      stderr: `File not found: ${scriptPath}`,
      exit_code: 1
    };
  }

  const runtime = await loadPyodideRuntime();
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  runtime.setStdout({ batched: (text: string) => stdoutChunks.push(text) });
  runtime.setStderr({ batched: (text: string) => stderrChunks.push(text) });

  if (!runtime.FS.analyzePath('/workspace').exists) {
    runtime.FS.mkdirTree('/workspace');
  }

  for (const [path, content] of Object.entries(files)) {
    if (!path.endsWith('.py')) continue;
    const relPath = path.replace(/^\/+/, '');
    const targetPath = `/workspace/${relPath}`;
    const lastSlash = relPath.lastIndexOf('/');
    if (lastSlash > 0) {
      const dirPath = `/workspace/${relPath.slice(0, lastSlash)}`;
      if (!runtime.FS.analyzePath(dirPath).exists) {
        runtime.FS.mkdirTree(dirPath);
      }
    }
    runtime.FS.writeFile(targetPath, content);
  }

  const targetScript = `/workspace/${scriptPath.replace(/^\/+/, '')}`;

  try {
    runtime.globals.set('__runbox_script_path', targetScript);
    await runtime.runPythonAsync(`
import runpy
import sys
workspace = "/workspace"
if workspace not in sys.path:
    sys.path.insert(0, workspace)
runpy.run_path(__runbox_script_path, run_name="__main__")
`);
    runtime.globals.delete('__runbox_script_path');
    return {
      stdout: stdoutChunks.join('\n').trim(),
      stderr: stderrChunks.join('\n').trim(),
      exit_code: 0
    };
  } catch (error) {
    runtime.globals.delete('__runbox_script_path');
    stderrChunks.push((error as Error).message || String(error));
    return {
      stdout: stdoutChunks.join('\n').trim(),
      stderr: stderrChunks.join('\n').trim(),
      exit_code: 1
    };
  }
}

const DemoPage: React.FC = () => {
  const { t } = useTranslation();
  const [output, setOutput] = useState<string[]>(() => [`$ ${t('demo.output.init')}`]);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [serverPort, setServerPort] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState('/');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'explorer' | 'templates'>('explorer');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmRequestOptions | null>(null);

  const confirmResolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const requestConfirm = React.useCallback((options: ConfirmRequestOptions) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(false);
      confirmResolverRef.current = null;
    }

    return new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmDialog(options);
    });
  }, []);

  const closeConfirm = React.useCallback((confirmed: boolean) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(confirmed);
      confirmResolverRef.current = null;
    }
    setConfirmDialog(null);
  }, []);

  const fileSystem = useFileSystem(requestConfirm);

  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const initDoneRef = useRef(false);
  const runboxRef = useRef<RunboxInstance | null>(null);

  useEffect(() => {
    return () => {
      if (confirmResolverRef.current) {
        confirmResolverRef.current(false);
        confirmResolverRef.current = null;
      }
    };
  }, []);

  // â”€â”€ Init WASM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;
    try {
      const instance = new RunboxInstance();
      runboxRef.current = instance;
      setIsReady(true);
      setOutput(prev => [...prev, t('demo.output.ready')]);
    } catch (err) {
      setOutput(prev => [...prev, `[${t('demo.output.error_tag')}] ${t('demo.output.wasm_error')}: ${(err as Error).message}`]);
    }
  }, [t]);

  // â”€â”€ Auto-scroll terminal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!terminalDivRef.current) return;
    const el = terminalDivRef.current;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (!userScrolledUp && isAtBottom) outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, userScrolledUp]);

  const handleTerminalScroll = () => {
    if (!terminalDivRef.current) return;
    const el = terminalDivRef.current;
    setUserScrolledUp(el.scrollTop + el.clientHeight < el.scrollHeight - 10);
  };

  // â”€â”€ Run â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleRun = async () => {
    if (!isReady || isRunning) return;
    setIsRunning(true); setUserScrolledUp(false);
    setPreviewHtml(''); setServerPort(null); setBrowserUrl('/');

    try {
      const activeRunbox = new RunboxInstance();
      runboxRef.current = activeRunbox;

      for (const [path, content] of Object.entries(fileSystem.files)) {
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (dir) activeRunbox.exec(`mkdir -p ${dir}`);
        activeRunbox.write_file(path, new TextEncoder().encode(content));
      }

      let packageJson: DemoPackageJson | null = null;
      if (fileSystem.files['/package.json']) {
        try {
          packageJson = JSON.parse(fileSystem.files['/package.json']);
        } catch {
          packageJson = null;
        }
      }

      const runboxConfig = packageJson?.runbox ?? {};
      const packageManager = detectPackageManager(fileSystem.files, runboxConfig.packageManager);
      const shouldInstall = runboxConfig.install ?? !!fileSystem.files['/package.json'];
      const preRunCommands = Array.isArray(runboxConfig.preRun)
        ? runboxConfig.preRun.filter((cmd) => typeof cmd === 'string' && cmd.trim().length > 0)
        : [];
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const syncGeneratedLockfiles = () => {
        const generatedLocks: Record<string, string> = {};

        for (const lockPath of LOCK_FILE_PATHS) {
          if (!activeRunbox.file_exists(lockPath)) continue;
          try {
            generatedLocks[lockPath] = decoder.decode(activeRunbox.read_file(lockPath));
          } catch {
            // ignore unreadable lockfiles
          }
        }

        if (Object.keys(generatedLocks).length > 0) {
          fileSystem.setFiles((prev) => ({ ...prev, ...generatedLocks }));
        }
      };

      const appendExecOutput = (result: ExecResult) => {
        if (result.stdout) {
          result.stdout.split('\n').forEach((line) => {
            if (line.trim()) setOutput((prev) => [...prev, line]);
          });
        }
        const stderr = result.stderr?.trim();
        if (stderr) {
          setOutput((prev) => [...prev, `[${t('demo.output.error_tag')}] ${stderr}`]);
        }
      };

      const executeCommand = async (command: string): Promise<ExecResult> => {
        const pyodideResult = await runPythonScriptWithPyodide(command, fileSystem.files).catch(() => null);
        if (pyodideResult) return pyodideResult;
        return JSON.parse(activeRunbox.exec(command)) as ExecResult;
      };

      if (shouldInstall) {
        setOutput((prev) => [...prev, `$ ${packageManager} install`]);
        const needed: Array<{ name: string; version: string }> = JSON.parse(activeRunbox.npm_packages_needed());
        const resolvedVersions: Record<string, string> = {};
        if (needed.length > 0) {
          for (const pkg of needed) {
            setOutput((prev) => [...prev, `  -> ${pkg.name}@${pkg.version}`]);
            try {
              const meta = await fetch(`https://registry.npmjs.org/${pkg.name}/${pkg.version}`).then(r => r.json());
              resolvedVersions[pkg.name] = meta.version ?? normalizeVersionSpec(pkg.version);
              const tarball = await fetch(meta.dist.tarball).then(r => r.arrayBuffer());
              const result = JSON.parse(activeRunbox.npm_process_tarball(pkg.name, pkg.version, new Uint8Array(tarball)));
              if (!result.ok) setOutput((prev) => [...prev, `  x ${pkg.name}: ${result.error}`]);
            } catch (e) {
              resolvedVersions[pkg.name] = normalizeVersionSpec(pkg.version);
              setOutput((prev) => [...prev, `  x ${pkg.name}: ${(e as Error).message}`]);
            }
          }
          setOutput((prev) => [...prev, `  ${t('demo.output.packages_added', { count: needed.length })}`]);
        } else {
          setOutput((prev) => [...prev, `  ${t('demo.output.updated')}`]);
        }

        const generatedLock = buildGeneratedLockfile(packageManager, packageJson, resolvedVersions);
        if (generatedLock) {
          activeRunbox.write_file(generatedLock.path, encoder.encode(generatedLock.content));
          fileSystem.setFiles((prev) => ({ ...prev, [generatedLock.path]: generatedLock.content }));
          setOutput((prev) => [...prev, `  ${t('demo.output.generated')} ${generatedLock.path}`]);
        }

        syncGeneratedLockfiles();
      }

      for (const command of preRunCommands) {
        setOutput((prev) => [...prev, '', `$ ${command}`]);
        const preRunResult = await executeCommand(command);
        appendExecOutput(preRunResult);
        syncGeneratedLockfiles();
        if (preRunResult.exit_code !== 0) {
          setOutput((prev) => [...prev, `[${t('demo.output.error_tag')}] ${t('demo.output.process_exit', { code: preRunResult.exit_code })}`]);
          setIsRunning(false);
          return;
        }
      }

      let cmdToRun = runboxConfig.command?.trim();
      if (!cmdToRun) {
        if (packageJson?.scripts?.start) {
          cmdToRun = `${packageManager} run start`;
        } else {
          cmdToRun = 'bun run /index.js';
        }
      }

      setOutput((prev) => [...prev, '', `$ ${cmdToRun}`]);
      const execResult = await executeCommand(cmdToRun);
      appendExecOutput(execResult);
      syncGeneratedLockfiles();

      if (execResult.exit_code !== 0) {
        setOutput((prev) => [...prev, `[${t('demo.output.error_tag')}] ${t('demo.output.process_exit', { code: execResult.exit_code })}`]);
        setIsRunning(false);
        return;
      }

      const serverMatch = execResult.stdout?.match(/(?:localhost:(\d+)|(?:port|PORT)\s+(\d+)|[^:]:(\d{4,5})\b)/);
      const detectedPort = serverMatch && parseInt(serverMatch[1] ?? serverMatch[2] ?? serverMatch[3], 10);
      if (detectedPort) {
        const port = detectedPort;
        setServerPort(port); setBrowserUrl('/');
        const resp = JSON.parse(activeRunbox.http_handle_request(JSON.stringify({ port, method: 'GET', path: '/', headers: {}, body: null })));
        setPreviewHtml(injectNavScript(resp.body || ''));
        setHistoryStack(['/']);
        setHistoryIndex(0);
        setOutput((prev) => [...prev, t('demo.output.server_ready')]);
        setActiveView('preview');
      } else {
        setShowTerminal(true);
        setPreviewHtml(`<div style="padding:20px;text-align:center;color:#666"><p>${t('demo.output.check_terminal')}</p></div>`);
      }
    } catch (err) {
      setOutput((prev) => [...prev, `[${t('demo.output.error_tag')}] ${(err as Error).message}`]);
    }
    setIsRunning(false);
  };
  const injectNavScript = (html: string) => {
    const s = `<script>document.addEventListener('click',function(e){const a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(a){e.preventDefault();window.parent.postMessage({type:'__runbox_navigate',href:a.getAttribute('href')},'*');}});</script>`;
    if (html.includes('</body>')) return html.replace('</body>', s + '</body>');
    if (html.includes('</html>')) return html.replace('</html>', s + '</html>');
    return html + s;
  };

  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const handleNavigate = React.useCallback((path: string, replace = false) => {
    const activeRunbox = runboxRef.current;
    if (!activeRunbox || !serverPort) return;
    setBrowserUrl(path);
    const resp = JSON.parse(activeRunbox.http_handle_request(JSON.stringify({ port: serverPort, method: 'GET', path, headers: {}, body: null })));
    setPreviewHtml(injectNavScript(resp.body || ''));
    
    if (!replace) {
      setHistoryStack(prev => {
        const newStack = prev.slice(0, historyIndex + 1);
        newStack.push(path);
        setHistoryIndex(newStack.length - 1);
        return newStack;
      });
    }
  }, [serverPort, historyIndex]);

  const handleReload = () => {
    handleNavigate(browserUrl, true);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevPath = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      handleNavigate(prevPath, true);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextPath = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      handleNavigate(nextPath, true);
    }
  };

  useEffect(() => {
    const handler = (e: MessageEvent) => { if (e.data?.type === '__runbox_navigate') handleNavigate(e.data.href); };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleNavigate]);

  const handleReset = async () => {
    const didReset = await fileSystem.handleReset();
    if (!didReset) return;
    setPreviewHtml(''); setServerPort(null);
    setOutput([`$ ${t('demo.output.workspace_reset')}`]);
  };

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="h-screen w-full bg-[#141413] text-[#faf9f5] flex flex-col font-sans overflow-hidden">
      <RunboxLog />
      <TopBar
        activeView={activeView}
        setActiveView={setActiveView}
        showTerminal={showTerminal}
        setShowTerminal={setShowTerminal}
        handleReset={handleReset}
        handleRun={handleRun}
        isReady={isReady}
        isRunning={isRunning}
      />

      {/* â”€â”€ Main Body â”€â”€ */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0a0a09]">
        <ActivityBar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />

        {activeSidebar === 'explorer' ? (
          <Explorer {...fileSystem} />
        ) : (
          <TemplatesSidebar 
            onConfirmTemplateLoad={(templateName) =>
              requestConfirm({
                title: t('demo.confirm.load_title', { template: templateName }),
                message: t('demo.confirm.load_message'),
                confirmLabel: t('demo.confirm.load_confirm'),
                cancelLabel: t('demo.confirm.load_cancel'),
                tone: 'danger'
              })
            }
            onSelectTemplate={(_templateName, files) => {
              fileSystem.setFiles(files);
              fileSystem.setActiveFile(Object.keys(files).find(k => !k.endsWith('/')) || '');
              setActiveSidebar('explorer');
              setPreviewHtml(''); 
              setServerPort(null);
            }} 
          />
        )}

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a09]">
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {activeView === 'code' ? (
                <CodeEditor
                  files={fileSystem.files}
                  setFiles={fileSystem.setFiles}
                  activeFile={fileSystem.activeFile}
                  setActiveFile={fileSystem.setActiveFile}
                />
              ) : (
                <Preview
                  serverPort={serverPort}
                  browserUrl={browserUrl}
                  setBrowserUrl={setBrowserUrl}
                  handleNavigate={handleNavigate}
                  previewHtml={previewHtml}
                  handleReload={handleReload}
                  handleGoBack={handleGoBack}
                  handleGoForward={handleGoForward}
                  canGoBack={historyIndex > 0}
                  canGoForward={historyIndex < historyStack.length - 1}
                />
              )}
            </AnimatePresence>
          </div>

          <Terminal
            showTerminal={showTerminal}
            output={output}
            setOutput={setOutput}
            terminalDivRef={terminalDivRef}
            handleTerminalScroll={handleTerminalScroll}
            outputEndRef={outputEndRef}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmDialog}
        title={confirmDialog?.title ?? ''}
        message={confirmDialog?.message ?? ''}
        confirmLabel={confirmDialog?.confirmLabel ?? t('demo.confirm.default_confirm')}
        cancelLabel={confirmDialog?.cancelLabel ?? t('demo.confirm.default_cancel')}
        tone={confirmDialog?.tone ?? 'default'}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </div>
  );
};

export default DemoPage;


