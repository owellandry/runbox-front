import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { Play, Terminal as TerminalIcon, Globe, Package, Code } from 'lucide-react';
import { RunboxInstance } from 'runboxjs';

// Exponer React en globalThis para el sandbox RunBox
(globalThis as any).__runbox_react = React;
(globalThis as any).__runbox_reactdom = ReactDOM;
(globalThis as any).__runbox_reactdom_server = ReactDOMServer;

const DemoPage: React.FC = () => {
  const [runbox, setRunbox] = useState<RunboxInstance | null>(null);
  const [output, setOutput] = useState<string[]>(['$ Booting Runboxjs WASM Sandbox...']);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [serverPort, setServerPort] = useState<number | null>(null);
  const [browserUrl, setBrowserUrl] = useState('/');
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [activeFile, setActiveFile] = useState<'package.json' | 'index.js'>('index.js');

  const packageJson = `{
  "name": "data-processor",
  "version": "1.0.0",
  "description": "Data Processing Script",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "bun /index.js",
    "dev": "bun /index.js"
  },
  "author": "RunBox Team",
  "license": "MIT"
}`;

  const indexJs = `// Data Processing Script with Bun
// Edit this code and click 'Run' to execute it in RunBox WebAssembly

// Sample data
const users = [
  { id: 1, name: 'Alice Johnson', age: 28, department: 'Engineering' },
  { id: 2, name: 'Bob Smith', age: 35, department: 'Sales' },
  { id: 3, name: 'Carol White', age: 32, department: 'Engineering' },
  { id: 4, name: 'David Brown', age: 41, department: 'Management' },
  { id: 5, name: 'Emma Davis', age: 26, department: 'Sales' }
];

console.log('[INFO] User Processing Script');
console.log('================================\\n');

// Total users
console.log(\`Total Users: \${users.length}\`);

// Users by department
console.log('\\nUsers by Department:');
const byDept = users.reduce((acc, u) => {
  acc[u.department] = (acc[u.department] || 0) + 1;
  return acc;
}, {});
Object.entries(byDept).forEach(([dept, count]) => {
  console.log(\`  \${dept}: \${count}\`);
});

// Average age
const avgAge = (users.reduce((sum, u) => sum + u.age, 0) / users.length).toFixed(1);
console.log(\`\\nAverage Age: \${avgAge} years\`);

// Engineers
const engineers = users.filter(u => u.department === 'Engineering');
console.log(\`\\nEngineering Team (\${engineers.length}):\`);
engineers.forEach(u => {
  console.log(\`  - \${u.name} (\${u.age})\`);
});

console.log('\\n[SUCCESS] Processing complete!');`;

  const [files, setFiles] = useState({
    'package.json': packageJson,
    'index.js': indexJs
  });
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

  const handleRun = async () => {
    if (!runbox || !isReady || isRunning) return;

    setIsRunning(true);
    setUserScrolledUp(false);
    setPreviewHtml('');
    setServerPort(null);
    setBrowserUrl('/');

    try {
      // Write both files to VFS with user's edited content
      const pkgJsonBytes = new TextEncoder().encode(files['package.json']);
      const indexJsBytes = new TextEncoder().encode(files['index.js']);

      runbox.write_file('/package.json', pkgJsonBytes);
      runbox.write_file('/index.js', indexJsBytes);

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

      setOutput(prev => [...prev, '']);
      setOutput(prev => [...prev, '$ bun run /index.js']);

      // Execute with Bun run subcommand
      const execResult = JSON.parse(runbox.exec('bun run /index.js'));

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

  return (
    <div className="min-h-screen bg-anthropic-dark text-anthropic-light pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-12">
        <header className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-medium tracking-tight">RunBox Live Demo</h1>
          <p className="text-xl font-lora text-anthropic-mid-gray leading-relaxed max-w-2xl">
            Execute real JavaScript code in your browser using Bun runtime inside RunBox WebAssembly. Edit the code, change package.json, and click Run to see actual execution results.
          </p>
        </header>

        <div className="flex flex-col gap-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor with File Tabs */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-[#1a1a19] overflow-hidden flex flex-col shadow-2xl h-[400px]">
              {/* File Tabs */}
              <div className="flex items-center justify-between bg-[#15151a] border-b border-anthropic-light-gray/10 px-4 py-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFile('package.json')}
                    className={`px-4 py-3 text-xs font-mono transition-colors border-b-2 flex items-center gap-2 ${
                      activeFile === 'package.json'
                        ? 'border-anthropic-orange text-anthropic-orange'
                        : 'border-transparent text-anthropic-mid-gray hover:text-anthropic-light-gray'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    package.json
                  </button>
                  <button
                    onClick={() => setActiveFile('index.js')}
                    className={`px-4 py-3 text-xs font-mono transition-colors border-b-2 flex items-center gap-2 ${
                      activeFile === 'index.js'
                        ? 'border-anthropic-orange text-anthropic-orange'
                        : 'border-transparent text-anthropic-mid-gray hover:text-anthropic-light-gray'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    index.js
                  </button>
                </div>
                <button
                  onClick={handleRun}
                  disabled={!isReady || isRunning}
                  className="flex items-center gap-2 text-xs font-poppins font-medium text-anthropic-dark bg-anthropic-orange px-4 py-2 rounded-lg hover:bg-[#c76547] transition-colors disabled:opacity-50 disabled:cursor-not-allowed m-2"
                >
                  <Play className="w-3 h-3" /> {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>

              {/* Code Editor */}
              <div className="flex-1 relative overflow-hidden">
                {/* Line numbers (decorative) */}
                <div className="absolute top-0 left-0 w-12 bg-[#0f0f14] border-r border-anthropic-light-gray/10 pt-6 pointer-events-none text-right pr-3 h-full overflow-hidden">
                  <div className="text-xs text-anthropic-mid-gray/40 font-mono leading-relaxed">
                    {files[activeFile].split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                </div>
                <textarea
                  value={files[activeFile]}
                  onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
                  spellCheck="false"
                  placeholder="Edit the code and click 'Run' to execute..."
                  className="w-full h-full pl-14 pr-6 pt-6 pb-6 font-mono text-sm text-anthropic-light-gray bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed no-scrollbar placeholder:text-anthropic-mid-gray/50"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="rounded-3xl border border-anthropic-light-gray/10 bg-white overflow-hidden flex flex-col shadow-2xl h-[400px]">
              {serverPort ? (
                /* Mini browser cuando hay servidor HTTP */
                <>
                  <div className="flex items-center px-3 py-2 border-b border-gray-200 bg-gray-100 gap-2">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 gap-1">
                      <span className="text-xs text-gray-400 font-mono shrink-0">localhost:{serverPort}</span>
                      <input
                        type="text"
                        value={browserUrl}
                        onChange={e => setBrowserUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNavigate(browserUrl)}
                        className="flex-1 text-xs font-mono text-gray-700 focus:outline-none min-w-0"
                      />
                    </div>
                    <button
                      onClick={() => handleNavigate(browserUrl)}
                      className="text-xs bg-anthropic-orange text-white px-2 py-1 rounded font-mono shrink-0"
                    >
                      Go
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto text-black">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts"
                      onLoad={e => {
                        // Interceptar clicks en links para navegar dentro del servidor
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
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-gray-50 gap-2">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-mono text-gray-500">Script Output & Info</span>
                  </div>
                  <div className="flex-1 p-6 text-black overflow-y-auto">
                    {previewHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 font-poppins text-sm text-center">
                        <div>
                          <p className="mb-2">Click "Run" to execute the script</p>
                          <p className="text-xs">Output from your code will appear in the terminal</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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