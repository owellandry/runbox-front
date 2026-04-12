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
    "dayjs": "^1.11.10",
    "clsx": "^2.1.1",
    "react-icons": "^5.4.0"
  },
  "scripts": {
    "start": "bun run /index.js"
  }
}`,

  '/index.js': `/**
 * Dashboard SaaS — React SSR inside RunBox WASM sandbox.
 * Deps: react (host), react-dom/server (host), dayjs, clsx, react-icons/fi
 */
const http   = require('http');
const React  = require('react');
const Server = require('react-dom/server');
const dayjs  = require('dayjs');
const clsx   = require('clsx');

// react-icons — graceful fallback to text if not yet loaded
let FiIcons = {};
try { FiIcons = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fallback) => FiIcons[name]
  ? React.createElement(FiIcons[name], { size: 18 })
  : React.createElement('span', null, fallback);

const e = React.createElement;

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       '#0f0f11',
  surface:  '#18181b',
  border:   '#27272a',
  accent:   '#6d6afe',
  green:    '#22c55e',
  yellow:   '#eab308',
  red:      '#ef4444',
  text:     '#fafafa',
  muted:    '#a1a1aa',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const users = [
  { id: 1, name: 'Ana García',    email: 'ana@acme.io',    role: 'Admin',    status: 'active',   joined: '2024-01-12' },
  { id: 2, name: 'Luis Torres',   email: 'luis@acme.io',   role: 'Editor',   status: 'active',   joined: '2024-02-08' },
  { id: 3, name: 'Sara Kim',      email: 'sara@acme.io',   role: 'Viewer',   status: 'inactive', joined: '2024-03-21' },
  { id: 4, name: 'Tomás Ruiz',    email: 'tomas@acme.io',  role: 'Editor',   status: 'active',   joined: '2024-04-05' },
  { id: 5, name: 'Elena Romero',  email: 'elena@acme.io',  role: 'Viewer',   status: 'active',   joined: '2024-05-17' },
];

const stats = [
  { label: 'Total Users',    value: '2,841',  change: '+12%',  up: true,  icon: 'FiUsers'     },
  { label: 'Monthly Revenue','value: $48,290', change: '+8.2%', up: true,  icon: 'FiDollarSign'},
  { label: 'Active Projects','value: 134',     change: '-3%',   up: false, icon: 'FiFolder'    },
  { label: 'Uptime',         value: '99.97%', change: '+0.1%', up: true,  icon: 'FiActivity'  },
];

const activity = [
  { text: 'Ana García deployed v2.4.1',       time: '2 min ago',  color: C.green  },
  { text: 'Luis Torres updated /api/users',    time: '14 min ago', color: C.accent },
  { text: 'Build failed on staging branch',   time: '1 hr ago',   color: C.red    },
  { text: 'Sara Kim joined the workspace',     time: '3 hr ago',   color: C.yellow },
  { text: 'Database backup completed',         time: '6 hr ago',   color: C.green  },
];

// ── Components ────────────────────────────────────────────────────────────────

function Sidebar({ path }) {
  const nav = [
    { href: '/',        label: 'Dashboard', icon: 'FiGrid'    },
    { href: '/users',   label: 'Users',     icon: 'FiUsers'   },
    { href: '/projects',label: 'Projects',  icon: 'FiFolder'  },
    { href: '/settings',label: 'Settings',  icon: 'FiSettings'},
  ];
  return e('aside', { style: s.sidebar },
    e('div', { style: s.sidebarBrand },
      Icon('FiZap', '⚡'),
      e('span', { style: { marginLeft: 10, fontWeight: 700, fontSize: 16 } }, 'Acme HQ')
    ),
    e('nav', { style: { marginTop: 32 } },
      ...nav.map(({ href, label, icon }) =>
        e('a', {
          key: href, href,
          style: clsx ? {
            ...s.navItem,
            ...(path === href ? s.navItemActive : {}),
          } : s.navItem,
        },
          Icon(icon, '•'),
          e('span', { style: { marginLeft: 10 } }, label)
        )
      )
    ),
    e('div', { style: s.sidebarFooter },
      e('div', { style: s.avatar }, 'AH'),
      e('div', null,
        e('div', { style: { fontSize: 13, fontWeight: 600 } }, 'Admin Hub'),
        e('div', { style: { fontSize: 11, color: C.muted } }, 'admin@acme.io')
      )
    )
  );
}

function StatCard({ label, value, change, up, icon }) {
  return e('div', { style: s.statCard },
    e('div', { style: s.statHeader },
      e('span', { style: s.statLabel }, label),
      e('div', { style: { ...s.statIcon, background: C.accent + '22' } }, Icon(icon, '●'))
    ),
    e('div', { style: s.statValue }, value),
    e('div', { style: { color: up ? C.green : C.red, fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 } },
      Icon(up ? 'FiTrendingUp' : 'FiTrendingDown', up ? '▲' : '▼'),
      e('span', null, change + ' vs last month')
    )
  );
}

function Badge({ status }) {
  const color = status === 'active' ? C.green : C.red;
  return e('span', {
    style: { background: color + '22', color, padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }
  }, status);
}

function DashboardPage() {
  const now = dayjs().format('MMM D, YYYY HH:mm');
  return e('div', null,
    e('div', { style: s.pageHeader },
      e('div', null,
        e('h1', { style: s.pageTitle }, 'Dashboard'),
        e('p',  { style: { color: C.muted, fontSize: 13, marginTop: 4 } }, 'Last updated: ' + now)
      ),
      e('button', { style: s.btn },
        Icon('FiPlus', '+'),
        e('span', { style: { marginLeft: 6 } }, 'New Project')
      )
    ),
    e('div', { style: s.statsGrid },
      ...stats.map(stat => e(StatCard, { key: stat.label, ...stat }))
    ),
    e('div', { style: s.twoCol },
      e('div', { style: s.panel },
        e('div', { style: s.panelHeader },
          e('span', { style: s.panelTitle }, 'Recent Activity'),
          e('a', { href: '/users', style: s.panelLink }, 'View all')
        ),
        e('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } },
          ...activity.map((item, i) =>
            e('li', { key: i, style: s.activityItem },
              e('div', { style: { ...s.activityDot, background: item.color } }),
              e('div', { style: { flex: 1 } },
                e('div', { style: { fontSize: 13 } }, item.text),
                e('div', { style: { fontSize: 11, color: C.muted, marginTop: 2 } }, item.time)
              )
            )
          )
        )
      ),
      e('div', { style: s.panel },
        e('div', { style: s.panelHeader },
          e('span', { style: s.panelTitle }, 'Quick Stats'),
          null
        ),
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          ...[
            { label: 'API calls today',  value: 94, color: C.accent },
            { label: 'Storage used',     value: 62, color: C.yellow },
            { label: 'CI/CD success',    value: 88, color: C.green  },
            { label: 'Error rate',       value: 3,  color: C.red    },
          ].map(({ label, value, color }) =>
            e('div', { key: label },
              e('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 } },
                e('span', { style: { color: C.muted } }, label),
                e('span', { style: { fontWeight: 600 } }, value + '%')
              ),
              e('div', { style: { height: 6, background: C.border, borderRadius: 99 } },
                e('div', { style: { height: '100%', width: value + '%', background: color, borderRadius: 99 } })
              )
            )
          )
        )
      )
    )
  );
}

function UsersPage() {
  return e('div', null,
    e('div', { style: s.pageHeader },
      e('h1', { style: s.pageTitle }, 'Users'),
      e('button', { style: s.btn },
        Icon('FiUserPlus', '+'),
        e('span', { style: { marginLeft: 6 } }, 'Invite User')
      )
    ),
    e('div', { style: s.panel },
      e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        e('thead', null,
          e('tr', null,
            ...['Name', 'Email', 'Role', 'Status', 'Joined'].map(h =>
              e('th', { key: h, style: s.th }, h)
            )
          )
        ),
        e('tbody', null,
          ...users.map(u =>
            e('tr', { key: u.id, style: s.tr },
              e('td', { style: s.td },
                e('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                  e('div', { style: { ...s.avatar, width: 30, height: 30, fontSize: 11 } },
                    u.name.split(' ').map(n => n[0]).join('')
                  ),
                  e('span', { style: { fontWeight: 500, fontSize: 13 } }, u.name)
                )
              ),
              e('td', { style: { ...s.td, color: C.muted, fontSize: 13 } }, u.email),
              e('td', { style: s.td }, e('span', { style: { fontSize: 13 } }, u.role)),
              e('td', { style: s.td }, e(Badge, { status: u.status })),
              e('td', { style: { ...s.td, color: C.muted, fontSize: 12 } },
                dayjs(u.joined).format('MMM D, YYYY')
              )
            )
          )
        )
      )
    )
  );
}

function SettingsPage() {
  const sections = [
    { title: 'General',      desc: 'Workspace name, timezone, and locale.' },
    { title: 'Security',     desc: 'Two-factor authentication and session management.' },
    { title: 'Integrations', desc: 'Connect GitHub, Slack, and third-party services.' },
    { title: 'Billing',      desc: 'Manage your subscription and payment methods.' },
  ];
  return e('div', null,
    e('div', { style: s.pageHeader }, e('h1', { style: s.pageTitle }, 'Settings')),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      ...sections.map(({ title, desc }) =>
        e('div', { key: title, style: { ...s.panel, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' } },
          e('div', null,
            e('div', { style: { fontWeight: 600, marginBottom: 4 } }, title),
            e('div', { style: { fontSize: 13, color: C.muted } }, desc)
          ),
          e('button', { style: { ...s.btn, background: 'transparent', border: '1px solid ' + C.border, color: C.text } },
            Icon('FiChevronRight', '›')
          )
        )
      )
    )
  );
}

function NotFound() {
  return e('div', { style: { textAlign: 'center', padding: '80px 24px' } },
    e('h2', { style: { fontSize: 24, marginBottom: 8 } }, '404'),
    e('p',  { style: { color: C.muted } }, 'Page not found'),
    e('a',  { href: '/', style: s.panelLink }, '← Dashboard')
  );
}

function Layout({ path, children }) {
  return e('div', { style: { display: 'flex', minHeight: '100vh', background: C.bg, color: C.text } },
    e(Sidebar, { path }),
    e('div', { style: { flex: 1, overflow: 'auto' } },
      e('div', { style: { maxWidth: 1100, margin: '0 auto', padding: '32px 32px' } }, children)
    )
  );
}

function App({ path }) {
  const pages = { '/': DashboardPage, '/users': UsersPage, '/settings': SettingsPage };
  const Page  = pages[path] || NotFound;
  return e(Layout, { path }, e(Page));
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  sidebar:       { width: 220, minHeight: '100vh', background: C.surface, borderRight: '1px solid ' + C.border, padding: '24px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarBrand:  { display: 'flex', alignItems: 'center', padding: '0 8px', color: C.text },
  sidebarFooter: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '16px 8px', borderTop: '1px solid ' + C.border },
  navItem:       { display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 8, color: C.muted, textDecoration: 'none', fontSize: 14, marginBottom: 2 },
  navItemActive: { background: C.accent + '22', color: C.text },
  avatar:        { width: 36, height: 36, borderRadius: 99, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 },
  pageHeader:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  pageTitle:     { fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' },
  statsGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 },
  statCard:      { background: C.surface, border: '1px solid ' + C.border, borderRadius: 12, padding: '20px 20px' },
  statHeader:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statLabel:     { fontSize: 12, color: C.muted, fontWeight: 500 },
  statValue:     { fontSize: 26, fontWeight: 700, letterSpacing: '-1px' },
  statIcon:      { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  twoCol:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  panel:         { background: C.surface, border: '1px solid ' + C.border, borderRadius: 12, padding: '20px 20px' },
  panelHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  panelTitle:    { fontWeight: 600, fontSize: 14 },
  panelLink:     { fontSize: 12, color: C.accent, textDecoration: 'none' },
  activityItem:  { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid ' + C.border },
  activityDot:   { width: 8, height: 8, borderRadius: 99, marginTop: 4, flexShrink: 0 },
  btn:           { display: 'flex', alignItems: 'center', padding: '8px 16px', background: C.accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' },
  th:            { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid ' + C.border },
  td:            { padding: '12px 16px', borderBottom: '1px solid ' + C.border },
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
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Acme HQ</title>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}a{text-decoration:none}</style>
</head>
<body>\${body}</body>
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
