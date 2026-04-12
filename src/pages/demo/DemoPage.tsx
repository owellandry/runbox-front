import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { AnimatePresence } from 'framer-motion';
import { RunboxInstance } from 'runboxjs';

import { TopBar } from './components/TopBar';
import { ActivityBar } from './components/ActivityBar';
import { Explorer } from './components/Explorer';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { Terminal } from './components/Terminal';
import { useFileSystem } from './hooks/useFileSystem';

(globalThis as unknown as Record<string, unknown>).__runbox_react = React;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom = ReactDOM;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom_server = ReactDOMServer;

const DemoPage: React.FC = () => {
  const [runbox, setRunbox] = useState<RunboxInstance | null>(null);
  const [output, setOutput] = useState<string[]>(['$ Booting Runboxjs WASM Sandbox...']);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [serverPort, setServerPort] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState('/');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [showTerminal, setShowTerminal] = useState(false);

  const fileSystem = useFileSystem();

  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const initDoneRef = useRef(false);

  // ── Init WASM ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;
    try {
      const instance = new RunboxInstance();
      setRunbox(instance);
      setIsReady(true);
      setOutput(prev => [...prev, '[SUCCESS] Sandbox Ready. WebAssembly module loaded.']);
    } catch (err) {
      setOutput(prev => [...prev, `[ERROR] Error loading WASM: ${(err as Error).message}`]);
    }
  }, []);

  // ── Auto-scroll terminal ───────────────────────────────────────────────────
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

  // ── Run ────────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (!runbox || !isReady || isRunning) return;
    setIsRunning(true); setUserScrolledUp(false);
    setPreviewHtml(''); setServerPort(null); setBrowserUrl('/');

    try {
      for (const [path, content] of Object.entries(fileSystem.files)) {
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (dir) runbox.exec(`mkdir -p ${dir}`);
        runbox.write_file(path, new TextEncoder().encode(content));
      }

      setOutput(prev => [...prev, '$ npm install']);
      const needed: Array<{ name: string; version: string }> = JSON.parse(runbox.npm_packages_needed());
      if (needed.length > 0) {
        for (const pkg of needed) {
          setOutput(prev => [...prev, `  ↓ ${pkg.name}@${pkg.version}`]);
          try {
            const meta = await fetch(`https://registry.npmjs.org/${pkg.name}/${pkg.version}`).then(r => r.json());
            const tarball = await fetch(meta.dist.tarball).then(r => r.arrayBuffer());
            const result = JSON.parse(runbox.npm_process_tarball(pkg.name, pkg.version, new Uint8Array(tarball)));
            if (!result.ok) setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${result.error}`]);
          } catch (e) { setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${(e as Error).message}`]); }
        }
        setOutput(prev => [...prev, `  added ${needed.length} packages`]);
      } else {
        setOutput(prev => [...prev, '  up to date']);
      }

      let cmdToRun = 'bun run /index.js';
      if (fileSystem.files['/package.json']) {
        try {
          const pkg = JSON.parse(fileSystem.files['/package.json']);
          if (pkg.scripts?.start) cmdToRun = 'npm run start';
        } catch { /* ignore */ }
      }

      setOutput(prev => [...prev, '', `$ ${cmdToRun}`]);
      const execResult = JSON.parse(runbox.exec(cmdToRun));

      if (execResult.stdout) execResult.stdout.split('\n').forEach((l: string) => { if (l.trim()) setOutput(p => [...p, l]); });
      if (execResult.stderr) setOutput(prev => [...prev, `[ERROR] ${execResult.stderr}`]);
      if (execResult.exit_code !== 0) {
        setOutput(prev => [...prev, `[ERROR] Process exited with code ${execResult.exit_code}`]);
        setIsRunning(false); return;
      }

      const serverMatch = execResult.stdout?.match(/(?:localhost:(\d+)|(?:port|PORT)\s+(\d+)|[^:]:(\d{4,5})\b)/);
      const detectedPort = serverMatch && parseInt(serverMatch[1] ?? serverMatch[2] ?? serverMatch[3], 10);
      if (detectedPort) {
        const port = detectedPort;
        setServerPort(port); setBrowserUrl('/');
        const resp = JSON.parse(runbox.http_handle_request(JSON.stringify({ port, method: 'GET', path: '/', headers: {}, body: null })));
        setPreviewHtml(injectNavScript(resp.body || ''));
        setOutput(prev => [...prev, '✓ Server ready — navigate using the browser above']);
        setActiveView('preview');
      } else {
        setShowTerminal(true);
        setPreviewHtml('<div style="padding:20px;text-align:center;color:#666"><p>Check the terminal output</p></div>');
      }
    } catch (err) {
      setOutput(prev => [...prev, `[ERROR] ${(err as Error).message}`]);
    }
    setIsRunning(false);
  };

  const injectNavScript = (html: string) => {
    const s = `<script>document.addEventListener('click',function(e){const a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(a){e.preventDefault();window.parent.postMessage({type:'__runbox_navigate',href:a.getAttribute('href')},'*');}});</script>`;
    if (html.includes('</body>')) return html.replace('</body>', s + '</body>');
    if (html.includes('</html>')) return html.replace('</html>', s + '</html>');
    return html + s;
  };

  const handleNavigate = React.useCallback((path: string) => {
    if (!runbox || !serverPort) return;
    setBrowserUrl(path);
    const resp = JSON.parse(runbox.http_handle_request(JSON.stringify({ port: serverPort, method: 'GET', path, headers: {}, body: null })));
    setPreviewHtml(injectNavScript(resp.body || ''));
  }, [runbox, serverPort]);

  useEffect(() => {
    const handler = (e: MessageEvent) => { if (e.data?.type === '__runbox_navigate') handleNavigate(e.data.href); };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleNavigate]);

  const handleReset = () => {
    fileSystem.handleReset();
    setPreviewHtml(''); setServerPort(null);
    setOutput(['$ Workspace reset to default template.']);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-full bg-[#141413] text-[#faf9f5] flex flex-col font-sans overflow-hidden">
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

      {/* ── Main Body ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0a0a09]">
        <ActivityBar />

        <Explorer {...fileSystem} />

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
    </div>
  );
};

export default DemoPage;
