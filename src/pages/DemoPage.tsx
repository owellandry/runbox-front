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
  "name": "acme-dashboard",
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

  '/index.js': `const http   = require('http');
const React  = require('react');
const Server = require('react-dom/server');
const App    = require('./app.js');

const server = http.createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  const html = Server.renderToString(React.createElement(App, { path }));
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Acme HQ</title>
  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}a{text-decoration:none}</style>
</head>
<body>\${html}</body>
</html>\`);
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});`,

  '/app.js': `const React = require('react');
const Sidebar   = require('./components/Sidebar.js');
const Dashboard = require('./pages/Dashboard.js');
const Users     = require('./pages/Users.js');
const Settings  = require('./pages/Settings.js');
const e = React.createElement;

const PAGES = {
  '/':         Dashboard,
  '/users':    Users,
  '/settings': Settings,
};

function NotFound() {
  const { muted, accent } = require('./lib/tokens.js');
  return e('div', { style: { textAlign: 'center', padding: '80px 24px', color: muted } },
    e('div', { style: { fontSize: 48, marginBottom: 12 } }, '404'),
    e('p', null, 'Page not found'),
    e('a', { href: '/', style: { color: accent } }, '← Back to dashboard')
  );
}

function App({ path }) {
  const { bg, text } = require('./lib/tokens.js');
  const Page = PAGES[path] || NotFound;
  return e('div', { style: { display: 'flex', minHeight: '100vh', background: bg, color: text } },
    e(Sidebar, { path }),
    e('main', { style: { flex: 1, padding: '32px 36px', overflowY: 'auto' } },
      e(Page)
    )
  );
}

module.exports = App;`,

  '/lib/tokens.js': `module.exports = {
  bg:      '#0f0f11',
  surface: '#18181b',
  border:  '#27272a',
  accent:  '#6d6afe',
  green:   '#22c55e',
  yellow:  '#eab308',
  red:     '#ef4444',
  text:    '#fafafa',
  muted:   '#a1a1aa',
};`,

  '/lib/data.js': `const dayjs = require('dayjs');

const users = [
  { id: 1, name: 'Ana García',   email: 'ana@acme.io',   role: 'Admin',  status: 'active',   joined: '2024-01-12' },
  { id: 2, name: 'Luis Torres',  email: 'luis@acme.io',  role: 'Editor', status: 'active',   joined: '2024-02-08' },
  { id: 3, name: 'Sara Kim',     email: 'sara@acme.io',  role: 'Viewer', status: 'inactive', joined: '2024-03-21' },
  { id: 4, name: 'Tomás Ruiz',   email: 'tomas@acme.io', role: 'Editor', status: 'active',   joined: '2024-04-05' },
  { id: 5, name: 'Elena Romero', email: 'elena@acme.io', role: 'Viewer', status: 'active',   joined: '2024-05-17' },
];

const stats = [
  { label: 'Total Users',     value: '2,841',  delta: '+12%',  up: true  },
  { label: 'Monthly Revenue', value: '$48,290', delta: '+8.2%', up: true  },
  { label: 'Active Projects', value: '134',     delta: '-3%',   up: false },
  { label: 'Uptime',          value: '99.97%', delta: '+0.1%', up: true  },
];

const activity = [
  { text: 'Ana García deployed v2.4.1',     time: '2 min ago',  type: 'success' },
  { text: 'Luis Torres updated /api/users', time: '14 min ago', type: 'info'    },
  { text: 'Build failed on staging',        time: '1 hr ago',   type: 'error'   },
  { text: 'Sara Kim joined the workspace',  time: '3 hr ago',   type: 'warning' },
  { text: 'Database backup completed',      time: '6 hr ago',   type: 'success' },
];

module.exports = { users, stats, activity, dayjs };`,

  '/components/Sidebar.js': `const React = require('react');
const clsx  = require('clsx');
const { surface, border, accent, muted, text } = require('../lib/tokens.js');

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 16 }) : React.createElement('span', null, fb);

const e = React.createElement;

const NAV = [
  { href: '/',         label: 'Dashboard', icon: 'FiGrid',    fb: '⊞' },
  { href: '/users',    label: 'Users',     icon: 'FiUsers',   fb: '👥' },
  { href: '/settings', label: 'Settings',  icon: 'FiSettings',fb: '⚙' },
];

function Sidebar({ path }) {
  return e('aside', {
    style: { width: 220, minHeight: '100vh', background: surface, borderRight: '1px solid ' + border,
             padding: '24px 12px', display: 'flex', flexDirection: 'column', flexShrink: 0 }
  },
    // Brand
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 32 } },
      Icon('FiZap', '⚡'),
      e('span', { style: { fontWeight: 700, fontSize: 16 } }, 'Acme HQ')
    ),
    // Nav links
    e('nav', { style: { flex: 1 } },
      ...NAV.map(({ href, label, icon, fb }) =>
        e('a', {
          key: href, href,
          style: {
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, marginBottom: 2,
            textDecoration: 'none', fontSize: 14,
            color: path === href ? text : muted,
            background: path === href ? accent + '22' : 'transparent',
          }
        }, Icon(icon, fb), label)
      )
    ),
    // Footer
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', borderTop: '1px solid ' + border } },
      e('div', { style: { width: 32, height: 32, borderRadius: 99, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 } }, 'AH'),
      e('div', null,
        e('div', { style: { fontSize: 13, fontWeight: 600 } }, 'Admin'),
        e('div', { style: { fontSize: 11, color: muted } }, 'admin@acme.io')
      )
    )
  );
}

module.exports = Sidebar;`,

  '/components/StatCard.js': `const React = require('react');
const { surface, border, accent, green, red, muted } = require('../lib/tokens.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

function StatCard({ label, value, delta, up }) {
  return e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
    e('div', { style: { fontSize: 12, color: muted, fontWeight: 500, marginBottom: 12 } }, label),
    e('div', { style: { fontSize: 28, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 } }, value),
    e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: up ? green : red } },
      Icon(up ? 'FiTrendingUp' : 'FiTrendingDown', up ? '▲' : '▼'),
      delta + ' vs last month'
    )
  );
}

module.exports = StatCard;`,

  '/components/Badge.js': `const React = require('react');
const { green, red } = require('../lib/tokens.js');
const e = React.createElement;

function Badge({ status }) {
  const color = status === 'active' ? green : red;
  return e('span', {
    style: { background: color + '22', color, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }
  }, status);
}

module.exports = Badge;`,

  '/pages/Dashboard.js': `const React    = require('react');
const StatCard = require('../components/StatCard.js');
const { accent, border, muted, surface, green, yellow, red } = require('../lib/tokens.js');
const { stats, activity, dayjs } = require('../lib/data.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

const ACTIVITY_COLOR = { success: green, info: accent, error: red, warning: yellow };

function Dashboard() {
  return e('div', null,
    // Header
    e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 } },
      e('div', null,
        e('h1', { style: { fontSize: 22, fontWeight: 700, margin: 0 } }, 'Dashboard'),
        e('p',  { style: { fontSize: 12, color: muted, marginTop: 4 } }, 'Last updated: ' + dayjs().format('MMM D, YYYY · HH:mm'))
      ),
      e('a', { href: '/users', style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: accent, color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 } },
        Icon('FiUsers', '👥'), 'View Users'
      )
    ),
    // Stat cards
    e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 } },
      ...stats.map(s => e(StatCard, { key: s.label, ...s }))
    ),
    // Two-column section
    e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 } },
      // Activity feed
      e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
        e('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 16 } },
          e('span', { style: { fontWeight: 600, fontSize: 14 } }, 'Recent Activity'),
          e('a', { href: '/users', style: { fontSize: 12, color: accent, textDecoration: 'none' } }, 'View all')
        ),
        e('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } },
          ...activity.map((item, i) =>
            e('li', { key: i, style: { display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid ' + border : 'none' } },
              e('div', { style: { width: 8, height: 8, borderRadius: 99, background: ACTIVITY_COLOR[item.type], marginTop: 4, flexShrink: 0 } }),
              e('div', null,
                e('div', { style: { fontSize: 13 } }, item.text),
                e('div', { style: { fontSize: 11, color: muted, marginTop: 2 } }, item.time)
              )
            )
          )
        )
      ),
      // Progress bars
      e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: 20 } },
        e('div', { style: { fontWeight: 600, fontSize: 14, marginBottom: 20 } }, 'System Health'),
        e('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
          ...[
            { label: 'API uptime',      value: 99, color: green  },
            { label: 'Storage used',    value: 62, color: yellow },
            { label: 'CI/CD success',   value: 88, color: accent },
            { label: 'Error rate',      value: 3,  color: red    },
          ].map(({ label, value, color }) =>
            e('div', { key: label },
              e('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: muted, marginBottom: 6 } },
                e('span', null, label), e('span', { style: { color: '#fafafa', fontWeight: 600 } }, value + '%')
              ),
              e('div', { style: { height: 6, background: border, borderRadius: 99 } },
                e('div', { style: { height: '100%', width: value + '%', background: color, borderRadius: 99 } })
              )
            )
          )
        )
      )
    )
  );
}

module.exports = Dashboard;`,

  '/pages/Users.js': `const React = require('react');
const Badge = require('../components/Badge.js');
const { accent, border, muted, surface } = require('../lib/tokens.js');
const { users, dayjs } = require('../lib/data.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 14 }) : React.createElement('span', null, fb);

function Users() {
  return e('div', null,
    e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 } },
      e('h1', { style: { fontSize: 22, fontWeight: 700, margin: 0 } }, 'Users'),
      e('button', { style: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: accent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 } },
        Icon('FiUserPlus', '+'), 'Invite User'
      )
    ),
    e('div', { style: { background: surface, border: '1px solid ' + border, borderRadius: 12, overflow: 'hidden' } },
      e('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        e('thead', null,
          e('tr', null,
            ...['Name', 'Email', 'Role', 'Status', 'Joined'].map(h =>
              e('th', { key: h, style: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid ' + border } }, h)
            )
          )
        ),
        e('tbody', null,
          ...users.map((u, i) =>
            e('tr', { key: u.id },
              e('td', { style: { padding: '14px 16px', borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } },
                e('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                  e('div', { style: { width: 30, height: 30, borderRadius: 99, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 } },
                    u.name.split(' ').map(n => n[0]).join('')
                  ),
                  e('span', { style: { fontSize: 13, fontWeight: 500 } }, u.name)
                )
              ),
              e('td', { style: { padding: '14px 16px', fontSize: 13, color: muted, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, u.email),
              e('td', { style: { padding: '14px 16px', fontSize: 13, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, u.role),
              e('td', { style: { padding: '14px 16px', borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } }, e(Badge, { status: u.status })),
              e('td', { style: { padding: '14px 16px', fontSize: 12, color: muted, borderBottom: i < users.length - 1 ? '1px solid ' + border : 'none' } },
                dayjs(u.joined).format('MMM D, YYYY')
              )
            )
          )
        )
      )
    )
  );
}

module.exports = Users;`,

  '/pages/Settings.js': `const React = require('react');
const { accent, border, muted, surface, text } = require('../lib/tokens.js');
const e = React.createElement;

let Fi = {};
try { Fi = require('react-icons/fi'); } catch(_) {}
const Icon = (name, fb) => Fi[name] ? React.createElement(Fi[name], { size: 16 }) : React.createElement('span', null, fb);

const SECTIONS = [
  { icon: 'FiUser',    fb: '👤', title: 'Profile',      desc: 'Update your name, avatar, and contact info.' },
  { icon: 'FiLock',    fb: '🔒', title: 'Security',     desc: 'Two-factor auth, password, and active sessions.' },
  { icon: 'FiBell',    fb: '🔔', title: 'Notifications', desc: 'Email, push, and in-app notification preferences.' },
  { icon: 'FiGlobe',   fb: '🌐', title: 'Integrations', desc: 'Connect GitHub, Slack, and third-party services.' },
  { icon: 'FiCreditCard', fb: '💳', title: 'Billing',   desc: 'Manage subscription, invoices, and payment methods.' },
];

function Settings() {
  return e('div', null,
    e('h1', { style: { fontSize: 22, fontWeight: 700, margin: '0 0 28px' } }, 'Settings'),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      ...SECTIONS.map(({ icon, fb, title, desc }) =>
        e('div', { key: title, style: { background: surface, border: '1px solid ' + border, borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            e('div', { style: { width: 36, height: 36, borderRadius: 8, background: accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent } },
              Icon(icon, fb)
            ),
            e('div', null,
              e('div', { style: { fontWeight: 600, fontSize: 14 } }, title),
              e('div', { style: { fontSize: 12, color: muted, marginTop: 2 } }, desc)
            )
          ),
          e('div', { style: { color: muted } }, Icon('FiChevronRight', '›'))
        )
      )
    )
  );
}

module.exports = Settings;`,
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
