import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Play, Terminal as TerminalIcon, Globe, Package, Code, FileText, FilePlus, Trash2, Edit2 } from 'lucide-react';
import { RunboxInstance } from 'runboxjs';

// Exponer React en globalThis para el sandbox RunBox
(globalThis as any).__runbox_react = React;
(globalThis as any).__runbox_reactdom = ReactDOM;
(globalThis as any).__runbox_reactdom_server = ReactDOMServer;

const LOCAL_STORAGE_KEY = 'runbox_demo_workspace';

const defaultFiles: Record<string, string> = {
  '/package.json': `{
  "name": "runbox-demo",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "bun run /index.js"
  }
}`,
  '/index.js': `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello from Runboxjs IDE!</h1><p>Edit this file and click Run.</p>');
});

app.listen(port, () => {
  console.log(\`Server listening on port \${port}\`);
});`
};

const DemoPage: React.FC = () => {
  const [runbox, setRunbox] = useState<RunboxInstance | null>(null);
  const [output, setOutput] = useState<string[]>(['$ Booting Runboxjs WASM Sandbox...']);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [serverPort, setServerPort] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState('/');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const [creatingFile, setCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const [files, setFiles] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultFiles;
      }
    }
    return defaultFiles;
  });
  
  const [activeFile, setActiveFile] = useState<string>('/index.js');
  
  // Effect to save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const terminalDivRef = useRef<HTMLDivElement>(null);
  const initDoneRef = useRef(false);

  useEffect(() => {
    // Initialize RunBox instance ONLY ONCE (WASM auto-initializes on import)
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    try {
      const instance = new RunboxInstance();
      setRunbox(instance);
      setIsReady(true);
      setOutput(prev => [...prev, '[SUCCESS] Sandbox Ready. WebAssembly module loaded.']);
    } catch (err: any) {
      setOutput(prev => [...prev, `[ERROR] Error loading WASM: ${err.message}`]);
    }
  }, []);

  // Handle scroll behavior - only auto-scroll if user hasn't scrolled up
  useEffect(() => {
    if (!terminalDivRef.current) return;

    const terminal = terminalDivRef.current;

    // Check if we're at the bottom
    const isAtBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;

    // Only auto-scroll if user hasn't scrolled up AND we're at bottom
    if (!userScrolledUp && isAtBottom) {
      outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, userScrolledUp]);

  const handleTerminalScroll = () => {
    if (!terminalDivRef.current) return;

    const terminal = terminalDivRef.current;
    const isAtBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;

    // Mark as scrolled up if not at bottom
    setUserScrolledUp(!isAtBottom);
  };

  const handleCreateFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let path = newFileName.trim();
      if (!path) {
        setCreatingFile(false);
        return;
      }
      if (!path.startsWith('/')) path = '/' + path;
      
      if (!files[path]) {
        setFiles(prev => ({ ...prev, [path]: '' }));
        setActiveFile(path);
      }
      setCreatingFile(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setCreatingFile(false);
      setNewFileName('');
    }
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${path}?`)) {
      const newFiles = { ...files };
      delete newFiles[path];
      setFiles(newFiles);
      if (activeFile === path) {
        const remaining = Object.keys(newFiles);
        setActiveFile(remaining.length > 0 ? remaining[0] : '');
      }
    }
  };

  const startRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFile(path);
    setRenameInput(path.replace(/^\//, ''));
  };

  const handleRenameFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && renamingFile) {
      let newPath = renameInput.trim();
      if (!newPath) {
        setRenamingFile(null);
        return;
      }
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      
      if (newPath !== renamingFile && !files[newPath]) {
        const newFiles = { ...files };
        newFiles[newPath] = newFiles[renamingFile];
        delete newFiles[renamingFile];
        setFiles(newFiles);
        if (activeFile === renamingFile) setActiveFile(newPath);
      }
      setRenamingFile(null);
    } else if (e.key === 'Escape') {
      setRenamingFile(null);
    }
  };

  const handleRun = async () => {
    if (!runbox || !isReady || isRunning) return;

    setIsRunning(true);
    setUserScrolledUp(false);
    setPreviewHtml('');
    setServerPort(null);
    setBrowserUrl('/');

    try {
      // Write all files from state to VFS
      for (const [path, content] of Object.entries(files)) {
        // Create parent directories if needed
        const dir = path.substring(0, path.lastIndexOf('/'));
        if (dir && dir !== '') {
           runbox.exec(`mkdir -p ${dir}`);
        }
        
        const bytes = new TextEncoder().encode(content);
        runbox.write_file(path, bytes);
      }

      setOutput(prev => [...prev, '$ npm install']);

      // Instalar dependencias reales desde npm registry
      const needed: Array<{name: string, version: string}> = JSON.parse(runbox.npm_packages_needed());
      if (needed.length > 0) {
        for (const pkg of needed) {
          setOutput(prev => [...prev, `  ↓ ${pkg.name}@${pkg.version}`]);
          try {
            const meta = await fetch(`https://registry.npmjs.org/${pkg.name}/${pkg.version}`).then(r => r.json());
            const tarball = await fetch(meta.dist.tarball).then(r => r.arrayBuffer());
            const result = JSON.parse(runbox.npm_process_tarball(pkg.name, pkg.version, new Uint8Array(tarball)));
            if (!result.ok) setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${result.error}`]);
          } catch (e: any) {
            setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${e.message}`]);
          }
        }
        setOutput(prev => [...prev, `  added ${needed.length} packages`]);
      } else {
        setOutput(prev => [...prev, '  up to date']);
      }

      let cmdToRun = 'bun run /index.js';
      
      // Basic detection if they have a package.json start script
      if (files['/package.json']) {
         try {
           const pkg = JSON.parse(files['/package.json']);
           if (pkg.scripts && pkg.scripts.start) {
             cmdToRun = 'npm run start';
           }
         } catch(e) {}
      }

      setOutput(prev => [...prev, '']);
      setOutput(prev => [...prev, `$ ${cmdToRun}`]);

      // Execute with Bun run subcommand
      const execResult = JSON.parse(runbox.exec(cmdToRun));

      if (execResult.stdout) {
        execResult.stdout.split('\n').forEach((line: string) => {
          if (line.trim()) setOutput(prev => [...prev, line]);
        });
      }

      if (execResult.stderr) {
        setOutput(prev => [...prev, `[ERROR] ${execResult.stderr}`]);
      }

      if (execResult.exit_code !== 0) {
        setOutput(prev => [...prev, `[ERROR] Process exited with code ${execResult.exit_code}`]);
        setIsRunning(false);
        return;
      }

      // Detectar si hay un servidor HTTP corriendo
      const serverMatch = execResult.stdout?.match(/localhost:(\d+)/);
      if (serverMatch) {
        const port = parseInt(serverMatch[1], 10);
        setServerPort(port);
        setBrowserUrl('/');
        // Primera request al servidor
        const response = JSON.parse(runbox.http_handle_request(JSON.stringify({
          port, method: 'GET', path: '/', headers: {}, body: null
        })));
        setPreviewHtml(injectNavScript(response.body || ''));
        setOutput(prev => [...prev, `✓ Server ready — navigate using the browser above`]);
      } else {
        setPreviewHtml('<div style="padding: 20px; text-align: center; color: #666;"><p>Check the terminal output above</p></div>');
      }

      setIsRunning(false);

    } catch (err: any) {
      setOutput(prev => [...prev, `[ERROR] ${err.message}`]);
      setIsRunning(false);
    }
  };

  const handleNavigate = (path: string) => {
    if (!runbox || !serverPort) return;
    setBrowserUrl(path);
    const response = JSON.parse(runbox.http_handle_request(JSON.stringify({
      port: serverPort, method: 'GET', path, headers: {}, body: null
    })));
    setPreviewHtml(injectNavScript(response.body || ''));
  };

  // Inyecta un script en el HTML del servidor que intercepta clicks en links
  // y los envía al parent via postMessage (evita CORS al navegar)
  const injectNavScript = (html: string) => {
    const navScript = `<script>
      document.addEventListener('click', function(e) {
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (a) {
          e.preventDefault();
          window.parent.postMessage({ type: '__runbox_navigate', href: a.getAttribute('href') }, '*');
        }
      });
    </script>`;
    if (html.includes('</body>')) return html.replace('</body>', navScript + '</body>');
    if (html.includes('</html>')) return html.replace('</html>', navScript + '</html>');
    return html + navScript;
  };

  // Escuchar eventos de navegación del iframe via postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === '__runbox_navigate') {
        handleNavigate(e.data.href);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [serverPort, runbox]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workspace? All local changes will be lost.')) {
      setFiles(defaultFiles);
      setActiveFile('/index.js');
      setPreviewHtml('');
      setServerPort(null);
      setOutput(['$ Workspace reset to default template.']);
    }
  };

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#15151a] p-4 rounded-2xl border border-anthropic-light-gray/10 shadow-lg">
          <div>
            <h1 className="text-2xl font-poppins font-medium tracking-tight">RunBox IDE</h1>
            <p className="text-sm font-lora text-anthropic-mid-gray">
              Local WebAssembly Node.js Environment
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs font-poppins text-anthropic-mid-gray hover:text-white transition-colors"
            >
              Reset Workspace
            </button>
            <div className="h-6 w-px bg-anthropic-light-gray/20"></div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-anthropic-green' : 'bg-anthropic-orange animate-pulse'}`}></span>
              <span className="text-xs font-mono text-anthropic-mid-gray">{isReady ? 'Ready' : 'Booting...'}</span>
            </div>
            <button 
              onClick={handleRun}
              disabled={!isReady || isRunning}
              className="flex items-center gap-2 text-sm font-poppins font-medium text-anthropic-dark bg-anthropic-orange px-6 py-2 rounded-xl hover:bg-[#c76547] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(217,119,87,0.2)]"
            >
              <Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Run'}
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            {/* Explorer Sidebar (Span 2) */}
            <div className="lg:col-span-2 rounded-2xl border border-anthropic-light-gray/10 bg-[#15151a] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-anthropic-light-gray/10">
                <span className="text-xs font-poppins font-medium text-anthropic-mid-gray uppercase tracking-wider">Explorer</span>
                <div className="flex gap-1">
                  <button onClick={() => setCreatingFile(true)} className="text-anthropic-mid-gray hover:text-white transition-colors">
                    <FilePlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {Object.keys(files).sort().map(path => (
                  <div key={path} className="group">
                    {renamingFile === path ? (
                      <div className="px-4 py-1.5 flex items-center">
                        <FileText className="w-3.5 h-3.5 text-anthropic-blue mr-2 shrink-0" />
                        <input
                          autoFocus
                          value={renameInput}
                          onChange={e => setRenameInput(e.target.value)}
                          onKeyDown={handleRenameFile}
                          onBlur={() => setRenamingFile(null)}
                          className="w-full bg-[#0d0d0c] text-xs font-mono text-white border border-anthropic-blue px-1 py-0.5 outline-none"
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => setActiveFile(path)}
                        className={`px-4 py-1.5 flex items-center cursor-pointer text-xs font-mono transition-colors ${activeFile === path ? 'bg-anthropic-blue/10 text-anthropic-light border-l-2 border-anthropic-blue' : 'text-anthropic-mid-gray hover:bg-white/5 border-l-2 border-transparent'}`}
                      >
                        <FileText className={`w-3.5 h-3.5 mr-2 shrink-0 ${activeFile === path ? 'text-anthropic-blue' : 'text-anthropic-mid-gray'}`} />
                        <span className="truncate flex-1">{path.replace(/^\//, '')}</span>
                        
                        <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2">
                          <button onClick={(e) => startRename(path, e)} className="text-anthropic-mid-gray hover:text-white"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={(e) => handleDeleteFile(path, e)} className="text-anthropic-mid-gray hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {creatingFile && (
                  <div className="px-4 py-1.5 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-anthropic-blue mr-2 shrink-0" />
                    <input
                      autoFocus
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      onKeyDown={handleCreateFile}
                      onBlur={() => setCreatingFile(false)}
                      placeholder="filename.js"
                      className="w-full bg-[#0d0d0c] text-xs font-mono text-white border border-anthropic-blue px-1 py-0.5 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Editor (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center bg-[#15151a] border-b border-anthropic-light-gray/10 overflow-x-auto no-scrollbar">
                {Object.keys(files).map(path => (
                  <button
                    key={path}
                    onClick={() => setActiveFile(path)}
                    className={`px-4 py-3 text-xs font-mono transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      activeFile === path
                        ? 'border-anthropic-orange text-anthropic-orange bg-[#1a1a19]'
                        : 'border-transparent text-anthropic-mid-gray hover:text-anthropic-light-gray hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {path.replace(/^\//, '')}
                  </button>
                ))}
              </div>

              <div className="flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 bg-[#0f0f14] border-r border-anthropic-light-gray/10 pt-6 pointer-events-none text-right pr-3 h-full overflow-hidden">
                  <div className="text-xs text-anthropic-mid-gray/40 font-mono leading-relaxed">
                    {activeFile && files[activeFile] ? files[activeFile].split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    )) : <div>1</div>}
                  </div>
                </div>
                {activeFile && files[activeFile] !== undefined ? (
                  <textarea
                    value={files[activeFile]}
                    onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
                    spellCheck="false"
                    className="w-full h-full pl-14 pr-6 pt-6 pb-6 font-mono text-sm text-anthropic-light-gray bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed no-scrollbar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-anthropic-mid-gray font-mono text-sm">
                    Select or create a file to edit
                  </div>
                )}
              </div>
            </div>

            {/* Live Preview (Span 5) */}
            <div className="lg:col-span-5 rounded-2xl border border-anthropic-light-gray/10 bg-white overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-gray-100 gap-2">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 gap-1">
                  <span className="text-xs text-gray-400 font-mono shrink-0">localhost:{serverPort || '3000'}</span>
                  <input
                    type="text"
                    value={browserUrl}
                    onChange={e => setBrowserUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNavigate(browserUrl)}
                    disabled={!serverPort}
                    className="flex-1 text-xs font-mono text-gray-700 focus:outline-none min-w-0 disabled:bg-transparent"
                  />
                </div>
                <button
                  onClick={() => handleNavigate(browserUrl)}
                  disabled={!serverPort}
                  className="text-xs bg-anthropic-orange text-white px-2 py-1 rounded font-mono shrink-0 disabled:opacity-50"
                >
                  Go
                </button>
              </div>
              <div className="flex-1 overflow-y-auto text-black">
                {serverPort ? (
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={e => {
                      const iframe = e.currentTarget;
                      try {
                        iframe.contentDocument?.querySelectorAll('a[href]').forEach(a => {
                          (a as HTMLAnchorElement).addEventListener('click', ev => {
                            ev.preventDefault();
                            const href = (a as HTMLAnchorElement).getAttribute('href') || '/';
                            handleNavigate(href);
                          });
                        });
                      } catch (_) {}
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 font-poppins text-sm text-center p-6">
                    <div>
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="mb-2 text-gray-600">No server running</p>
                      <p className="text-xs">Click "Run" to execute your code. If it starts an HTTP server, the preview will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal / Output */}
          <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#0d0d0c] overflow-hidden flex flex-col shadow-2xl h-[250px]">
            <div className="flex items-center px-6 py-4 border-b border-anthropic-light-gray/10 bg-[#1e1e1d] gap-2">
              <TerminalIcon className="w-4 h-4 text-anthropic-mid-gray" />
              <span className="text-xs font-mono text-anthropic-mid-gray">Server Output & API Calls</span>
            </div>
            <div
              ref={terminalDivRef}
              onScroll={handleTerminalScroll}
              className="flex-1 p-6 font-mono text-sm text-anthropic-light-gray overflow-y-auto no-scrollbar"
            >
              {output.map((line, i) => (
                <p key={i} className={`mb-2 ${line.startsWith('$') ? 'text-anthropic-mid-gray' : line.startsWith('Error:') ? 'text-red-400' : 'text-anthropic-green'}`}>
                  {line}
                </p>
              ))}
              <p className="mt-4"><span className="animate-pulse text-anthropic-orange">_</span></p>
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;