import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Terminal as TerminalIcon, Globe, FilePlus, Trash2, Edit2, Folder, Puzzle, Settings } from 'lucide-react';
import {
  SiJavascript, SiTypescript, SiReact, SiCss, SiHtml5,
  SiPython, SiMarkdown, SiRust, SiGnubash, SiSass,
} from 'react-icons/si';
import { VscJson, VscFile } from 'react-icons/vsc';
import { RunboxInstance } from 'runboxjs';
import _Editor from 'react-simple-code-editor';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor = (_Editor as any).default ?? _Editor;
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

(globalThis as unknown as Record<string, unknown>).__runbox_react = React;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom = ReactDOM;
(globalThis as unknown as Record<string, unknown>).__runbox_reactdom_server = ReactDOMServer;

// ── File icon ─────────────────────────────────────────────────────────────────

interface FileIconProps { path: string; className?: string }

function FileIcon({ path, className = 'w-3.5 h-3.5 shrink-0' }: FileIconProps) {
  const ext  = path.split('.').pop()?.toLowerCase() ?? '';
  const name = path.split('/').pop()?.toLowerCase() ?? '';

  if (name === 'package.json')                        return <VscJson   className={className} style={{ color: '#cb3837' }} />;
  if (ext === 'json')                                 return <VscJson   className={className} style={{ color: '#f0db4f' }} />;
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') return <SiJavascript className={className} style={{ color: '#f0db4f' }} />;
  if (ext === 'jsx')                                  return <SiReact   className={className} style={{ color: '#61dafb' }} />;
  if (ext === 'ts')                                   return <SiTypescript className={className} style={{ color: '#3178c6' }} />;
  if (ext === 'tsx')                                  return <SiReact   className={className} style={{ color: '#61dafb' }} />;
  if (ext === 'css')                                  return <SiCss     className={className} style={{ color: '#1572b6' }} />;
  if (ext === 'scss' || ext === 'sass')               return <SiSass    className={className} style={{ color: '#cc6699' }} />;
  if (ext === 'html' || ext === 'htm')                return <SiHtml5   className={className} style={{ color: '#e34f26' }} />;
  if (ext === 'py')                                   return <SiPython  className={className} style={{ color: '#3776ab' }} />;
  if (ext === 'md' || ext === 'mdx')                  return <SiMarkdown className={className} style={{ color: '#b0aea5' }} />;
  if (ext === 'rs')                                   return <SiRust    className={className} style={{ color: '#ce4a00' }} />;
  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') return <SiGnubash className={className} style={{ color: '#4eaa25' }} />;
  return <VscFile className={className} style={{ color: '#b0aea5' }} />;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = 'runbox_demo_workspace';

const defaultFiles: Record<string, string> = {
  '/package.json': `{
  "name": "my-react-app",
  "version": "1.0.0",
  "dependencies": {
    "dayjs": "^1.11.10"
  },
  "scripts": {
    "start": "bun run /index.js"
  }
}`,

  '/index.js': `/**
 * React SSR app running inside the RunBox WASM sandbox.
 * Uses React (provided by the host) + dayjs (installed from npm).
 */
const http   = require('http');
const React  = require('react');
const Server = require('react-dom/server');
const dayjs  = require('dayjs');

const e = React.createElement;

// ── Components ────────────────────────────────────────────────────────────────

function Navbar({ path }) {
  const links = [
    { href: '/',       label: 'Home'     },
    { href: '/about',  label: 'About'    },
    { href: '/stack',  label: 'Stack'    },
  ];
  return e('nav', { style: styles.nav },
    e('span', { style: styles.brand }, '⚡ MyApp'),
    e('div', { style: styles.navLinks },
      ...links.map(({ href, label }) =>
        e('a', {
          key: href, href,
          style: { ...styles.navLink, ...(path === href ? styles.navLinkActive : {}) },
        }, label)
      )
    )
  );
}

function HomePage() {
  const now = dayjs().format('ddd, MMM D YYYY · HH:mm');
  const features = [
    { icon: '🔷', title: 'React SSR',      desc: 'Rendered server-side with ReactDOMServer inside a WASM sandbox.' },
    { icon: '📦', title: 'npm packages',   desc: 'dayjs loaded from the real npm registry — no bundler needed.'    },
    { icon: '🌐', title: 'HTTP routing',   desc: 'Multi-page app served by a mock http.createServer() handler.'     },
    { icon: '⚡', title: 'Instant reload', desc: 'Edit any file and click Run — the sandbox re-executes in place.'  },
  ];
  return e('main', { style: styles.main },
    e('section', { style: styles.hero },
      e('h1', { style: styles.heroTitle }, 'Hello from RunBox!'),
      e('p',  { style: styles.heroSub  }, 'A full React app running inside a WebAssembly sandbox.'),
      e('div', { style: styles.badge }, '🕐 ' + now)
    ),
    e('section', { style: styles.grid },
      ...features.map(({ icon, title, desc }) =>
        e('div', { key: title, style: styles.card },
          e('span', { style: styles.cardIcon }, icon),
          e('h3',   { style: styles.cardTitle }, title),
          e('p',    { style: styles.cardDesc  }, desc)
        )
      )
    )
  );
}

function AboutPage() {
  return e('main', { style: styles.main },
    e('h2', { style: styles.pageTitle }, 'About'),
    e('p',  { style: styles.text },
      'This demo is a server-side rendered React application running entirely inside ',
      e('strong', null, 'RunBox'), ' — a WebAssembly sandbox built with Rust.'
    ),
    e('p', { style: styles.text },
      'No Node.js process. No Vite dev server. Pure WASM in your browser tab.'
    ),
    e('a', { href: '/', style: styles.link }, '← Back home')
  );
}

function StackPage() {
  const stack = [
    { name: 'Rust',             role: 'Sandbox runtime compiled to WASM'   },
    { name: 'wasm-bindgen',     role: 'Rust ↔ JS bridge'                    },
    { name: 'React 19',         role: 'UI components (SSR via renderToString)' },
    { name: 'dayjs',            role: 'Date formatting — zero dependencies'  },
    { name: 'http (mock)',       role: 'Built-in server shim in the sandbox' },
  ];
  return e('main', { style: styles.main },
    e('h2', { style: styles.pageTitle }, 'Tech Stack'),
    e('table', { style: styles.table },
      e('thead', null,
        e('tr', null,
          e('th', { style: styles.th }, 'Package'),
          e('th', { style: styles.th }, 'Role')
        )
      ),
      e('tbody', null,
        ...stack.map(({ name, role }) =>
          e('tr', { key: name, style: styles.tr },
            e('td', { style: { ...styles.td, fontWeight: 600 } }, name),
            e('td', { style: styles.td }, role)
          )
        )
      )
    ),
    e('a', { href: '/', style: styles.link }, '← Back home')
  );
}

function NotFound() {
  return e('main', { style: styles.main },
    e('h2', { style: { ...styles.pageTitle, color: '#e74c3c' } }, '404 — Not Found'),
    e('a', { href: '/', style: styles.link }, '← Go home')
  );
}

function App({ path }) {
  const pages = { '/': HomePage, '/about': AboutPage, '/stack': StackPage };
  const Page  = pages[path] || NotFound;
  return e('div', { style: styles.root },
    e(Navbar, { path }),
    e(Page)
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  root:          { fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8f7f4', color: '#1a1a1a' },
  nav:           { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 56, background: '#1a1a1a', color: '#fff' },
  brand:         { fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' },
  navLinks:      { display: 'flex', gap: 8 },
  navLink:       { color: '#aaa', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 14 },
  navLinkActive: { color: '#fff', background: '#333' },
  main:          { maxWidth: 780, margin: '0 auto', padding: '48px 24px' },
  hero:          { textAlign: 'center', marginBottom: 56 },
  heroTitle:     { fontSize: 48, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-2px', color: '#1a1a1a' },
  heroSub:       { fontSize: 18, color: '#666', margin: '0 0 24px' },
  badge:         { display: 'inline-block', background: '#1a1a1a', color: '#f0db4f', padding: '6px 16px', borderRadius: 99, fontSize: 13, fontFamily: 'monospace' },
  grid:          { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  card:          { background: '#fff', border: '1px solid #e8e5e0', borderRadius: 12, padding: '24px 20px' },
  cardIcon:      { fontSize: 28, display: 'block', marginBottom: 12 },
  cardTitle:     { margin: '0 0 8px', fontSize: 16, fontWeight: 700 },
  cardDesc:      { margin: 0, fontSize: 14, color: '#666', lineHeight: 1.6 },
  pageTitle:     { fontSize: 32, fontWeight: 800, marginBottom: 24, letterSpacing: '-1px' },
  text:          { fontSize: 16, color: '#444', lineHeight: 1.7, marginBottom: 16 },
  link:          { color: '#0070f3', textDecoration: 'none', fontWeight: 500 },
  table:         { width: '100%', borderCollapse: 'collapse', marginBottom: 32 },
  th:            { textAlign: 'left', padding: '10px 16px', background: '#1a1a1a', color: '#fff', fontSize: 13, fontWeight: 600 },
  td:            { padding: '12px 16px', borderBottom: '1px solid #e8e5e0', fontSize: 14 },
  tr:            {},
};

// ── Server ────────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  const body = Server.renderToString(e(App, { path }));

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MyApp — RunBox</title>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0}</style>
</head>
<body><div id="root">\${body}</div></body>
</html>\`);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});`,
};

// ── Component ─────────────────────────────────────────────────────────────────

const DemoPage: React.FC = () => {
  const [runbox, setRunbox] = useState<RunboxInstance | null>(null);
  const [output, setOutput]   = useState<string[]>(['$ Booting Runboxjs WASM Sandbox...']);
  const [isRunning, setIsRunning]   = useState(false);
  const [isReady, setIsReady]       = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [serverPort, setServerPort]   = useState<number | null>(null);
  const [browserUrl, setBrowserUrl]   = useState('/');
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const [creatingFile, setCreatingFile] = useState(false);
  const [newFileName, setNewFileName]   = useState('');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameInput, setRenameInput]   = useState('');

  const [activeView, setActiveView]   = useState<'code' | 'preview'>('code');
  const [showTerminal, setShowTerminal] = useState(false);

  const [files, setFiles] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultFiles;
    } catch { return defaultFiles; }
  });
  const [activeFile, setActiveFile] = useState<string>('/index.js');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const outputEndRef      = useRef<HTMLDivElement>(null);
  const terminalDivRef    = useRef<HTMLDivElement>(null);
  const initDoneRef       = useRef(false);

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

  // ── File ops ───────────────────────────────────────────────────────────────
  const handleCreateFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let path = newFileName.trim();
      if (!path) { setCreatingFile(false); return; }
      if (!path.startsWith('/')) path = '/' + path;
      if (!files[path]) { setFiles(prev => ({ ...prev, [path]: '' })); setActiveFile(path); }
      setCreatingFile(false); setNewFileName('');
    } else if (e.key === 'Escape') { setCreatingFile(false); setNewFileName(''); }
  };

  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${path}?`)) return;
    const next = { ...files };
    delete next[path];
    setFiles(next);
    if (activeFile === path) setActiveFile(Object.keys(next)[0] ?? '');
  };

  const startRename = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingFile(path); setRenameInput(path.replace(/^\//, ''));
  };

  const handleRenameFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && renamingFile) {
      let newPath = renameInput.trim();
      if (!newPath) { setRenamingFile(null); return; }
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      if (newPath !== renamingFile && !files[newPath]) {
        const next = { ...files, [newPath]: files[renamingFile] };
        delete next[renamingFile];
        setFiles(next);
        if (activeFile === renamingFile) setActiveFile(newPath);
      }
      setRenamingFile(null);
    } else if (e.key === 'Escape') setRenamingFile(null);
  };

  // ── Run ────────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (!runbox || !isReady || isRunning) return;
    setIsRunning(true); setUserScrolledUp(false);
    setPreviewHtml(''); setServerPort(null); setBrowserUrl('/');

    try {
      for (const [path, content] of Object.entries(files)) {
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
            const meta    = await fetch(`https://registry.npmjs.org/${pkg.name}/${pkg.version}`).then(r => r.json());
            const tarball = await fetch(meta.dist.tarball).then(r => r.arrayBuffer());
            const result  = JSON.parse(runbox.npm_process_tarball(pkg.name, pkg.version, new Uint8Array(tarball)));
            if (!result.ok) setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${result.error}`]);
          } catch (e) { setOutput(prev => [...prev, `  ✗ ${pkg.name}: ${(e as Error).message}`]); }
        }
        setOutput(prev => [...prev, `  added ${needed.length} packages`]);
      } else {
        setOutput(prev => [...prev, '  up to date']);
      }

      let cmdToRun = 'bun run /index.js';
      if (files['/package.json']) {
        try {
          const pkg = JSON.parse(files['/package.json']);
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
    if (html.includes('</body>'))  return html.replace('</body>',  s + '</body>');
    if (html.includes('</html>'))  return html.replace('</html>',  s + '</html>');
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
    if (!window.confirm('Reset the workspace? All local changes will be lost.')) return;
    setFiles(defaultFiles); setActiveFile('/index.js');
    setPreviewHtml(''); setServerPort(null);
    setOutput(['$ Workspace reset to default template.']);
  };

  const getLanguage = (path: string) => {
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.json'))                         return 'json';
    if (path.endsWith('.css'))                          return 'css';
    return 'javascript';
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-full bg-[#141413] text-[#faf9f5] flex flex-col font-sans overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-[#b0aea5]/10 shrink-0 bg-[#141413]">
        <div className="flex items-center gap-2 w-1/3">
          <TerminalIcon className="w-5 h-5 text-[#d97757]" />
          <h1 className="text-lg font-poppins font-medium tracking-tight">RunBox IDE</h1>
        </div>

        <div className="flex items-center justify-center w-1/3">
          <div className="flex bg-[#1e1e1d] p-1 rounded-full border border-[#b0aea5]/10">
            {(['preview', 'code'] as const).map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`relative px-4 py-1 text-xs font-poppins rounded-full transition-colors capitalize ${activeView === view ? 'text-[#141413] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
              >
                {activeView === view && (
                  <motion.span
                    layoutId="view-pill"
                    className="absolute inset-0 bg-[#6a9bcc] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 w-1/3">
          <button
            onClick={() => setShowTerminal(v => !v)}
            className={`text-xs font-poppins flex items-center gap-1 transition-colors ${showTerminal ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
          >
            <TerminalIcon className="w-4 h-4" /> Terminal
          </button>
          <button onClick={handleReset} className="text-xs font-poppins text-[#b0aea5] hover:text-[#faf9f5] transition-colors">Reset</button>
          <div className="h-4 w-px bg-[#b0aea5]/20" />
          <motion.div
            animate={{ scale: isReady ? 1 : [1, 1.3, 1] }}
            transition={{ repeat: isReady ? 0 : Infinity, duration: 1 }}
            className={`w-2 h-2 rounded-full ${isReady ? 'bg-[#788c5d]' : 'bg-[#d97757]'}`}
          />
          <motion.button
            onClick={handleRun}
            disabled={!isReady || isRunning}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-1.5 text-xs font-poppins font-medium text-[#141413] bg-[#d97757] px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3 h-3 fill-current" />
            {isRunning ? 'Running…' : 'Run'}
          </motion.button>
        </div>
      </header>

      {/* ── Main Body ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0a0a09]">

        {/* Activity Bar */}
        <div className="w-12 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col items-center py-4 gap-6">
          <button className="text-[#faf9f5] relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d97757] rounded-r-full" />
            <Folder className="w-5 h-5" />
          </button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors"><Puzzle className="w-5 h-5" /></button>
          <button className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors mt-auto"><Settings className="w-5 h-5" /></button>
        </div>

        {/* Explorer Sidebar */}
        <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-poppins font-medium text-[#faf9f5]">Explorer</span>
            <button onClick={() => setCreatingFile(true)} className="text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
              <FilePlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <AnimatePresence initial={false}>
              {Object.keys(files).sort().map(path => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="group"
                >
                  {renamingFile === path ? (
                    <div className="px-4 py-1.5 flex items-center gap-2">
                      <FileIcon path={path} />
                      <input
                        autoFocus value={renameInput}
                        onChange={e => setRenameInput(e.target.value)}
                        onKeyDown={handleRenameFile}
                        onBlur={() => setRenamingFile(null)}
                        className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setActiveFile(path)}
                      className={`px-4 py-1.5 flex items-center gap-2 cursor-pointer text-xs font-mono transition-colors ${
                        activeFile === path
                          ? 'bg-[#0a0a09] text-[#faf9f5] border-l-2 border-[#6a9bcc]'
                          : 'text-[#b0aea5] hover:bg-[#b0aea5]/5 border-l-2 border-transparent'
                      }`}
                    >
                      <FileIcon path={path} />
                      <span className="truncate flex-1">{path.replace(/^\//, '')}</span>
                      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                        <button onClick={e => startRename(path, e)} className="text-[#b0aea5] hover:text-[#faf9f5]"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={e => handleDeleteFile(path, e)} className="text-[#b0aea5] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {creatingFile && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                className="px-4 py-1.5 flex items-center gap-2"
              >
                <VscFile className="w-3.5 h-3.5 text-[#b0aea5] shrink-0" />
                <input
                  autoFocus value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={handleCreateFile}
                  onBlur={() => setCreatingFile(false)}
                  placeholder="filename.js"
                  className="w-full bg-[#0a0a09] text-xs font-mono text-[#faf9f5] border border-[#6a9bcc] px-1 py-0.5 outline-none"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a09]">
          <div className="flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {activeView === 'code' ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* File Tabs */}
                  <div className="flex items-end bg-[#141413] overflow-x-auto no-scrollbar">
                    {Object.keys(files).map(path => (
                      <button
                        key={path}
                        onClick={() => setActiveFile(path)}
                        className={`relative px-4 py-2.5 text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap border-r border-[#b0aea5]/10 ${
                          activeFile === path
                            ? 'bg-[#0a0a09] text-[#faf9f5]'
                            : 'bg-[#141413] text-[#b0aea5] hover:bg-[#1e1e1d]'
                        }`}
                      >
                        {activeFile === path && (
                          <motion.span
                            layoutId="tab-underline"
                            className="absolute top-0 inset-x-0 h-[2px] bg-[#6a9bcc]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <FileIcon path={path} />
                        {path.replace(/^\//, '')}
                      </button>
                    ))}
                  </div>

                  {/* Editor */}
                  <div className="flex-1 relative overflow-auto bg-[#0a0a09] no-scrollbar">
                    <div className="flex min-h-full">
                      <div className="w-12 bg-[#141413] border-r border-[#b0aea5]/10 pt-6 pb-6 text-right pr-3 shrink-0 select-none">
                        <div className="text-[13px] text-[#b0aea5]/40 font-mono leading-relaxed">
                          {(files[activeFile] ?? '').split('\n').map((_, i) => (
                            <div key={i} className="h-[21px]">{i + 1}</div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 pt-6 pb-6 min-w-0">
                        {activeFile && files[activeFile] !== undefined ? (
                          <Editor
                            value={files[activeFile]}
                            onValueChange={(code: string) => setFiles({ ...files, [activeFile]: code })}
                            highlight={(code: string) => Prism.highlight(code, Prism.languages[getLanguage(activeFile)], getLanguage(activeFile))}
                            padding={{ top: 0, right: 24, bottom: 0, left: 16 }}
                            style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: '21px', minHeight: '100%', backgroundColor: 'transparent' }}
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
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0 bg-white"
                >
                  {/* Address Bar */}
                  <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 gap-2 shrink-0">
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                    <div className="flex items-center flex-1 bg-white border border-gray-200 rounded px-2 py-1 gap-1">
                      <span className="text-xs text-gray-400 font-mono shrink-0">localhost:{serverPort || '3000'}</span>
                      <input
                        type="text" value={browserUrl}
                        onChange={e => setBrowserUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNavigate(browserUrl)}
                        disabled={!serverPort}
                        className="flex-1 text-xs font-mono text-gray-700 focus:outline-none min-w-0 disabled:bg-transparent"
                      />
                    </div>
                    <button
                      onClick={() => handleNavigate(browserUrl)} disabled={!serverPort}
                      className="text-xs bg-[#d97757] text-[#141413] px-3 py-1 rounded font-medium shrink-0 disabled:opacity-50"
                    >Go</button>
                  </div>

                  {/* Iframe */}
                  <div className="flex-1 overflow-y-auto text-black">
                    {serverPort ? (
                      <iframe
                        srcDoc={previewHtml}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                        onLoad={e => {
                          try {
                            e.currentTarget.contentDocument?.querySelectorAll('a[href]').forEach(a => {
                              (a as HTMLAnchorElement).addEventListener('click', ev => {
                                ev.preventDefault();
                                handleNavigate((a as HTMLAnchorElement).getAttribute('href') || '/');
                              });
                            });
                          } catch { /* cross-origin */ }
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal — slide in/out */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '33%', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="shrink-0 border-t border-[#b0aea5]/10 bg-[#141413] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#b0aea5]/10 bg-[#1e1e1d]">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="w-3.5 h-3.5 text-[#b0aea5]" />
                    <span className="text-xs font-mono text-[#b0aea5] uppercase tracking-wider">Terminal</span>
                  </div>
                  <button onClick={() => setOutput(['$ Terminal cleared.'])} className="text-xs font-mono text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
                    Clear
                  </button>
                </div>
                <div
                  ref={terminalDivRef} onScroll={handleTerminalScroll}
                  className="flex-1 p-4 font-mono text-xs text-[#e8e6dc] overflow-y-auto no-scrollbar"
                >
                  {output.map((line, i) => (
                    <p key={i} className={`mb-1.5 ${
                      line.startsWith('$') ? 'text-[#b0aea5]'
                      : line.includes('[ERROR]') || line.startsWith('Error:') ? 'text-red-400'
                      : 'text-[#788c5d]'
                    }`}>{line}</p>
                  ))}
                  <p className="mt-4"><span className="animate-pulse text-[#d97757]">_</span></p>
                  <div ref={outputEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
