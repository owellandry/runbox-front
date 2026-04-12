import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Play, Terminal as TerminalIcon, Globe, FileText, FilePlus, Trash2, Edit2, Folder, Puzzle, Settings } from 'lucide-react';
import { RunboxInstance } from 'runboxjs';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

// Exponer React en globalThis para el sandbox RunBox
(globalThis as unknown as Record<string, unknown>).__runbox_react = React;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom = ReactDOM;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom_server = ReactDOMServer;

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

  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [showTerminal, setShowTerminal] = useState(false);

  const [files, setFiles] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
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
  const editorLineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and line numbers
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (editorLineNumbersRef.current) {
      editorLineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };
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
    } catch (err) {
      setOutput(prev => [...prev, `[ERROR] Error loading WASM: ${(err as Error).message}`]);
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
          } catch (e) {
            setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${(e as Error).message}`]);
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
         } catch {
           // ignore
         }
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
        setActiveView('preview');
      } else {
        setShowTerminal(true);
        setPreviewHtml('<div style="padding: 20px; text-align: center; color: #666;"><p>Check the terminal output</p></div>');
      }

      setIsRunning(false);

    } catch (err) {
      setOutput(prev => [...prev, `[ERROR] ${(err as Error).message}`]);
      setIsRunning(false);
    }
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

  const handleNavigate = React.useCallback((path: string) => {
    if (!runbox || !serverPort) return;
    setBrowserUrl(path);
    const response = JSON.parse(runbox.http_handle_request(JSON.stringify({
      port: serverPort, method: 'GET', path, headers: {}, body: null
    })));
    setPreviewHtml(injectNavScript(response.body || ''));
  }, [runbox, serverPort]);

  // Escuchar eventos de navegación del iframe via postMessage
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === '__runbox_navigate') {
        handleNavigate(e.data.href);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleNavigate]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workspace? All local changes will be lost.')) {
      setFiles(defaultFiles);
      setActiveFile('/index.js');
      setPreviewHtml('');
      setServerPort(null);
      setOutput(['$ Workspace reset to default template.']);
    }
  };

  // Determine Prism language based on file extension
  const getLanguage = (path: string) => {
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.css')) return 'css';
    return 'javascript';
  };

  return (
    <div className="h-screen w-full bg-[#141413] text-[#faf9f5] flex flex-col font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-[#b0aea5]/10 shrink-0 bg-[#141413]">
        <div className="flex items-center gap-2 w-1/3">
          <TerminalIcon className="w-5 h-5 text-[#d97757]" />
          <h1 className="text-lg font-poppins font-medium tracking-tight">RunBox IDE</h1>
        </div>
        
        <div className="flex items-center justify-center w-1/3">
          <div className="flex bg-[#1e1e1d] p-1 rounded-full border border-[#b0aea5]/10">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-4 py-1 text-xs font-poppins rounded-full transition-colors ${activeView === 'preview' ? 'bg-[#6a9bcc] text-[#141413] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`px-4 py-1 text-xs font-poppins rounded-full transition-colors ${activeView === 'code' ? 'bg-[#6a9bcc] text-[#141413] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
            >
              Code
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`text-xs font-poppins flex items-center gap-1 transition-colors ${showTerminal ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
          >
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </button>
          <button
            onClick={handleReset}
            className="text-xs font-poppins text-[#b0aea5] hover:text-[#faf9f5] transition-colors"
          >
            Reset
          </button>
          <div className="h-4 w-px bg-[#b0aea5]/20"></div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-[#788c5d]' : 'bg-[#d97757] animate-pulse'}`}></span>
          </div>
          <button 
            onClick={handleRun}
            disabled={!isReady || isRunning}
            className="flex items-center gap-1.5 text-xs font-poppins font-medium text-[#141413] bg-[#d97757] px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3 h-3 fill-current" /> {isRunning ? 'Running' : 'Run'}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0a0a09]">
        {/* Activity Bar */}
        <div className="w-12 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col items-center py-4 gap-6">
          <button className="text-[#faf9f5] relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full"></div>
            <Folder className="w-5 h-5" />
          </button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
            <Puzzle className="w-5 h-5" />
          </button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors mt-auto">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Explorer Sidebar */}
        <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-poppins font-medium text-[#faf9f5]">Explorer</span>
            <div className="flex gap-2">
              <button onClick={() => setCreatingFile(true)} className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
                <FilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {Object.keys(files).sort().map(path => (
              <div key={path} className="group">
                {renamingFile === path ? (
                  <div className="px-4 py-1.5 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-[#6a9bcc] mr-2 shrink-0" />
                    <input
                      autoFocus
                      value={renameInput}
                      onChange={e => setRenameInput(e.target.value)}
                      onKeyDown={handleRenameFile}
                      onBlur={() => setRenamingFile(null)}
                      className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
                    />
                  </div>
                ) : (
                  <div 
                    onClick={() => setActiveFile(path)}
                    className={`px-4 py-1.5 flex items-center cursor-pointer text-xs font-mono transition-colors ${activeFile === path ? 'bg-[#0a0a09] text-[#faf9f5] border-l-2 border-[#6a9bcc]' : 'text-[#b0aea5] hover:bg-[#b0aea5]/5 border-l-2 border-transparent'}`}
                  >
                    <FileText className={`w-3.5 h-3.5 mr-2 shrink-0 ${activeFile === path ? 'text-[#6a9bcc]' : 'text-[#b0aea5]'}`} />
                    <span className="truncate flex-1">{path.replace(/^\//, '')}</span>
                    
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2">
                      <button onClick={(e) => startRename(path, e)} className="text-[#b0aea5] hover:text-[#faf9f5]"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={(e) => handleDeleteFile(path, e)} className="text-[#b0aea5] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {creatingFile && (
              <div className="px-4 py-1.5 flex items-center">
                <FileText className="w-3.5 h-3.5 text-[#6a9bcc] mr-2 shrink-0" />
                <input
                  autoFocus
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={handleCreateFile}
                  onBlur={() => setCreatingFile(false)}
                  placeholder="filename.js"
                  className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Area (Editor/Preview + Terminal) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a09]">
          {/* Dynamic Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {activeView === 'code' ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* File Tabs */}
                <div className="flex items-center bg-[#141413] overflow-x-auto no-scrollbar">
                  {Object.keys(files).map(path => (
                    <button
                      key={path}
                      onClick={() => setActiveFile(path)}
                      className={`px-4 py-2.5 text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap border-r border-[#b0aea5]/10 ${
                        activeFile === path
                          ? 'bg-[#0a0a09] text-[#6a9bcc] border-t-2 border-t-[#6a9bcc]'
                          : 'bg-[#141413] text-[#b0aea5] hover:bg-[#1e1e1d] border-t-2 border-t-transparent'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {path.replace(/^\//, '')}
                    </button>
                  ))}
                </div>
                  <div className="flex-1 relative overflow-auto bg-[#0a0a09] no-scrollbar">
                    <div className="flex min-h-full">
                      <div 
                        className="w-12 bg-[#141413] border-r border-[#b0aea5]/10 pt-6 pb-6 text-right pr-3 shrink-0"
                      >
                        <div className="text-[13px] text-[#b0aea5]/40 font-mono leading-relaxed">
                          {activeFile && files[activeFile] ? files[activeFile].split('\n').map((_, i) => (
                            <div key={i} className="h-[21px]">{i + 1}</div>
                          )) : <div className="h-[21px]">1</div>}
                        </div>
                      </div>
                      <div className="flex-1 pt-6 pb-6 min-w-0">
                        {activeFile && files[activeFile] !== undefined ? (
                          <Editor
                            value={files[activeFile]}
                            onValueChange={code => setFiles({ ...files, [activeFile]: code })}
                            highlight={code => Prism.highlight(code, Prism.languages[getLanguage(activeFile)], getLanguage(activeFile))}
                            padding={{ top: 0, right: 24, bottom: 0, left: 16 }}
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 13,
                              lineHeight: '21px',
                              minHeight: '100%',
                              backgroundColor: 'transparent',
                            }}
                            className="w-full text-[#faf9f5] focus:outline-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#b0aea5] font-mono text-sm">
                            Select or create a file to edit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                {/* Address Bar */}
                <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 gap-2 shrink-0">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex items-center flex-1 bg-white border border-gray-200 rounded px-2 py-1 gap-1">
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
                    className="text-xs bg-[#d97757] text-[#141413] px-3 py-1 rounded font-medium shrink-0 disabled:opacity-50"
                  >
                    Go
                  </button>
                </div>
                {/* Iframe */}
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
                        } catch {
                          // ignore errors
                        }
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
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-1/3 shrink-0 border-t border-[#b0aea5]/10 bg-[#141413] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#b0aea5]/10 bg-[#1e1e1d]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#b0aea5]" />
                  <span className="text-xs font-mono text-[#b0aea5] uppercase tracking-wider">Terminal</span>
                </div>
                <button 
                  onClick={() => setOutput(['$ Terminal cleared.'])}
                  className="text-xs font-mono text-[#b0aea5] hover:text-[#faf9f5]"
                >
                  Clear
                </button>
              </div>
              <div
                ref={terminalDivRef}
                onScroll={handleTerminalScroll}
                className="flex-1 p-4 font-mono text-xs text-[#e8e6dc] overflow-y-auto no-scrollbar"
              >
                {output.map((line, i) => (
                  <p key={i} className={`mb-1.5 ${line.startsWith('$') ? 'text-[#b0aea5]' : line.includes('[ERROR]') || line.startsWith('Error:') ? 'text-red-400' : 'text-[#788c5d]'}`}>
                    {line}
                  </p>
                ))}
                <p className="mt-4"><span className="animate-pulse text-[#d97757]">_</span></p>
                <div ref={outputEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;