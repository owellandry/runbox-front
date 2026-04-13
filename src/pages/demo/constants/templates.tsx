import React from 'react';
import { SiGit, SiJavascript, SiPnpm, SiPython, SiReact, SiTypescript, SiYarn } from 'react-icons/si';
import { defaultFiles } from './defaultFiles';

export interface DemoTemplate {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  files: Record<string, string>;
}

export const templates: DemoTemplate[] = [
  {
    id: 'react-dashboard',
    nameKey: 'demo.templates.items.react_dashboard.name',
    descriptionKey: 'demo.templates.items.react_dashboard.description',
    icon: <SiReact className="text-[#61dafb] w-5 h-5" />,
    files: defaultFiles
  },
  {
    id: 'vanilla-js',
    nameKey: 'demo.templates.items.vanilla_js.name',
    descriptionKey: 'demo.templates.items.vanilla_js.description',
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

server.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));`,
      '/src/view.js': `exports.renderHome = (path) => \`<!doctype html>
<html>
  <body style="font-family: ui-sans-serif, system-ui; padding: 48px; background: #111; color: #f8f8f8;">
    <h1>Plantilla Vanilla</h1>
    <p>Ruta actual: <strong>\${path}</strong></p>
    <p>Prueba editar <code>/src/view.js</code> y haz clic en Ejecutar de nuevo.</p>
  </body>
</html>\`;`
    }
  },
  {
    id: 'typescript-api',
    nameKey: 'demo.templates.items.typescript_api.name',
    descriptionKey: 'demo.templates.items.typescript_api.description',
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
      <h1>Plantilla API TypeScript</h1>
      <p>Abre <code>/api/health</code> en la barra de direcciones de la previsualización.</p>
      <p>Peticiones atendidas: \${metrics.requests}</p>
    </body>
  </html>\`);
});

server.listen(4173, () => {
  console.log('API TS escuchando en http://localhost:4173');
});`
    }
  },
  {
    id: 'python-data-lab',
    nameKey: 'demo.templates.items.python_data_lab.name',
    descriptionKey: 'demo.templates.items.python_data_lab.description',
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
    {"name": "Norte", "sales": 120},
    {"name": "Sur", "sales": 95},
    {"name": "Oeste", "sales": 133},
]

total = sum(item["sales"] for item in rows)
result = {
    "generado_en": datetime.utcnow().isoformat() + "Z",
    "filas": rows,
    "ventas_totales": total,
}

print("PYTHON_DATA_LAB_OK")
print(json.dumps(result, indent=2))`,
      '/requirements.txt': `pandas==2.2.2
matplotlib==3.9.0`
    }
  },
  {
    id: 'git-workflow',
    nameKey: 'demo.templates.items.git_workflow.name',
    descriptionKey: 'demo.templates.items.git_workflow.description',
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
      <h1>Plantilla de flujo de trabajo Git</h1>
      <p>ID de compilación: <strong>\${buildId}</strong></p>
      <p>Revisa la salida de la terminal para ver los comandos de git ejecutados.</p>
    </body>
  </html>\`);
});

server.listen(3800, () => console.log('App con flujo de Git corriendo en http://localhost:3800'));`
    }
  },
  {
    id: 'pnpm-showcase',
    nameKey: 'demo.templates.items.pnpm_showcase.name',
    descriptionKey: 'demo.templates.items.pnpm_showcase.description',
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

server.listen(3550, () => console.log('pnpm showcase corriendo en http://localhost:3550'));`
    }
  },
  {
    id: 'yarn-showcase',
    nameKey: 'demo.templates.items.yarn_showcase.name',
    descriptionKey: 'demo.templates.items.yarn_showcase.description',
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
      '/index.js': `const http = require('http');
const _ = require('lodash');
const dayjs = require('dayjs');

const server = http.createServer((req, res) => {
  const requestId = _.random(100000, 999999);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(\`<!doctype html>
  <html>
    <body style="font-family: ui-sans-serif,system-ui; padding: 28px;">
      <h1>Demostración Yarn</h1>
      <p>Marca de tiempo: \${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      <p>ID de petición usando lodash: <code>\${requestId}</code></p>
    </body>
  </html>\`);
});

server.listen(3650, () => console.log('yarn showcase corriendo en http://localhost:3650'));`
    }
  }
];
