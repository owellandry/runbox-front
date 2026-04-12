import React from 'react';
import { SiGit, SiJavascript, SiPnpm, SiPython, SiReact, SiTypescript, SiYarn } from 'react-icons/si';
import { defaultFiles } from '../constants/defaultFiles';

interface DemoTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  files: Record<string, string>;
}

export const templates: DemoTemplate[] = [
  {
    id: 'react-dashboard',
    name: 'React Dashboard',
    description: 'SSR React app with routes, reusable components, and npm deps.',
    icon: <SiReact className="text-[#61dafb] w-5 h-5" />,
    files: defaultFiles
  },
  {
    id: 'vanilla-js',
    name: 'Vanilla JS App',
    description: 'Simple HTTP app powered by bun runtime and local modules.',
    icon: <SiJavascript className="text-[#f0db4f] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "vanilla-app",
  "version": "1.0.0",
  "scripts": { "start": "bun run /index.js" },
  "runbox": { "packageManager": "bun" }
}`,
      '/index.js': `const http = require('http');
const { renderHome } = require('./src/view.js');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(renderHome(req.url || '/'));
});

server.listen(3000, () => console.log('Server running on port 3000'));`,
      '/src/view.js': `exports.renderHome = (path) => \`<!doctype html>
<html>
  <body style="font-family: ui-sans-serif, system-ui; padding: 48px; background: #111; color: #f8f8f8;">
    <h1>Vanilla template</h1>
    <p>Current route: <strong>\${path}</strong></p>
    <p>Try editing <code>/src/view.js</code> and click Run again.</p>
  </body>
</html>\`;`
    }
  },
  {
    id: 'typescript-api',
    name: 'TypeScript API',
    description: 'Node-compatible TypeScript server executed with Runbox Bun shim.',
    icon: <SiTypescript className="text-[#3178c6] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "ts-api-playground",
  "version": "1.0.0",
  "scripts": { "start": "node /src/server.ts" },
  "runbox": { "packageManager": "npm" }
}`,
      '/src/server.ts': `const http = require('http');
const metrics = new Object();
metrics.requests = 0;
metrics.startedAt = new Date().toISOString();

const server = http.createServer((req, res) => {
  metrics.requests = metrics.requests + 1;
  const path = (req.url || '/').split('?')[0];

  if (path === '/api/health') {
    const jsonHeaders = new Object();
    jsonHeaders['Content-Type'] = 'application/json';
    const payload = new Object();
    payload.ok = true;
    payload.requests = metrics.requests;
    payload.startedAt = metrics.startedAt;
    res.writeHead(200, jsonHeaders);
    res.end(JSON.stringify(payload, null, 2));
    return;
  }

  const htmlHeaders = new Object();
  htmlHeaders['Content-Type'] = 'text/html; charset=utf-8';
  res.writeHead(200, htmlHeaders);
  res.end(\`<!doctype html>
  <html>
    <body style="font-family: ui-sans-serif,system-ui; padding: 28px;">
      <h1>TypeScript API Template</h1>
      <p>Open <code>/api/health</code> in the preview URL bar.</p>
      <p>Requests served: \${metrics.requests}</p>
    </body>
  </html>\`);
});

server.listen(4173, () => {
  console.log('TS API listening at http://localhost:4173');
});`
    }
  },
  {
    id: 'python-data-lab',
    name: 'Python Data Lab',
    description: 'Demonstrates pip install/list/freeze and python runtime execution.',
    icon: <SiPython className="text-[#3776ab] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "python-data-lab",
  "version": "1.0.0",
  "runbox": {
    "install": false,
    "command": "python /main.py",
    "preRun": [
      "pip install pandas==2.2.2 matplotlib==3.9.0",
      "pip list",
      "pip freeze"
    ]
  }
}`,
      '/main.py': `import json
from datetime import datetime

rows = [
    {"name": "North", "sales": 120},
    {"name": "South", "sales": 95},
    {"name": "West", "sales": 133},
]

total = sum(item["sales"] for item in rows)
result = {
    "generated_at": datetime.utcnow().isoformat() + "Z",
    "rows": rows,
    "total_sales": total,
}

print("PYTHON_DATA_LAB_OK")
print(json.dumps(result, indent=2))`,
      '/requirements.txt': `pandas==2.2.2
matplotlib==3.9.0`
    }
  },
  {
    id: 'git-workflow',
    name: 'Git Workflow',
    description: 'Runs init/branch/commit/merge/log before launching a local app.',
    icon: <SiGit className="text-[#f1502f] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "git-workflow-demo",
  "version": "1.0.0",
  "scripts": { "start": "bun run /index.js" },
  "runbox": {
    "packageManager": "npm",
    "preRun": [
      "git init",
      "git config --global user.name \\"Runbox Demo\\"",
      "git config --global user.email \\"demo@runbox.dev\\"",
      "git add .",
      "git status",
      "git branch feature/demo",
      "git checkout feature/demo",
      "touch /feature.txt",
      "git add .",
      "git status",
      "git branch",
      "git remote add origin https://example.invalid/repo.git",
      "git remote -v"
    ]
  }
}`,
      '/index.js': `const http = require('http');
const buildId = Date.now().toString(36);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!doctype html>
  <html>
    <body style="font-family: ui-sans-serif,system-ui; padding: 28px;">
      <h1>Git workflow template</h1>
      <p>Build id: <strong>\${buildId}</strong></p>
      <p>Check terminal output for the git flow replay.</p>
    </body>
  </html>\`);
});

server.listen(3800, () => console.log('Git workflow app running at http://localhost:3800'));`
    }
  },
  {
    id: 'pnpm-showcase',
    name: 'pnpm Showcase',
    description: 'Uses pnpm install/list/audit and serves data with dependencies.',
    icon: <SiPnpm className="text-[#f69220] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "pnpm-showcase",
  "version": "1.0.0",
  "dependencies": {
    "dayjs": "^1.11.10",
    "lodash": "^4.17.21"
  },
  "scripts": { "start": "node /index.js" },
  "runbox": {
    "packageManager": "pnpm",
    "preRun": [
      "pnpm list --depth=0",
      "pnpm audit"
    ]
  }
}`,
      '/pnpm-lock.yaml': `lockfileVersion: '9.0'`,
      '/index.js': `const http = require('http');
const dayjs = require('dayjs');
const _ = require('lodash');

const server = http.createServer((req, res) => {
  const requestId = _.random(100000, 999999);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    template: 'pnpm-showcase',
    requestId,
    now: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, null, 2));
});

server.listen(3550, () => console.log('pnpm showcase running on http://localhost:3550'));`
    }
  },
  {
    id: 'yarn-showcase',
    name: 'Yarn Showcase',
    description: 'Runs yarn install/outdated and boots a small SSR page.',
    icon: <SiYarn className="text-[#2c8ebb] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "yarn-showcase",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^4.17.21",
    "dayjs": "^1.11.10"
  },
  "scripts": { "start": "node /index.js" },
  "runbox": {
    "packageManager": "yarn",
    "preRun": [
      "yarn outdated"
    ]
  }
}`,
      '/yarn.lock': `# yarn lockfile v1`,
      '/index.js': `const http = require('http');
const _ = require('lodash');
const dayjs = require('dayjs');

const server = http.createServer((req, res) => {
  const requestId = _.random(100000, 999999);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!doctype html>
  <html>
    <body style="font-family: ui-sans-serif,system-ui; padding: 28px;">
      <h1>Yarn showcase</h1>
      <p>Timestamp: \${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>Request id from lodash: <code>\${requestId}</code></p>
    </body>
  </html>\`);
});

server.listen(3650, () => console.log('yarn showcase running on http://localhost:3650'));`
    }
  }
];

interface TemplatesSidebarProps {
  onSelectTemplate: (templateName: string, files: Record<string, string>) => void;
  onConfirmTemplateLoad: (templateName: string) => Promise<boolean>;
}

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ onSelectTemplate, onConfirmTemplateLoad }) => {
  return (
    <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
      <div className="flex items-center px-4 py-3">
        <span className="text-xs font-poppins font-medium text-[#faf9f5]">Templates</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-3">
        {templates.map(tpl => (
          <div
            key={tpl.id}
            onClick={async () => {
              const confirmLoad = await onConfirmTemplateLoad(tpl.name);
              if (confirmLoad) {
                onSelectTemplate(tpl.name, tpl.files);
              }
            }}
            className="p-3 rounded-lg border border-[#b0aea5]/10 bg-[#1e1e1d] hover:border-[#d97757]/50 hover:bg-[#1e1e1d]/80 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center justify-center w-6 h-6">{tpl.icon}</div>
              <span className="text-sm font-medium text-[#faf9f5] group-hover:text-[#d97757] transition-colors">{tpl.name}</span>
            </div>
            <p className="text-xs text-[#b0aea5] leading-relaxed">
              {tpl.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
