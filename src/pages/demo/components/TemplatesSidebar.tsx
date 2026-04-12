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
    description: 'Aplicación React con rutas (SSR), componentes reutilizables y dependencias npm.',
    icon: <SiReact className="text-[#61dafb] w-5 h-5" />,
    files: defaultFiles
  },
  {
    id: 'vanilla-js',
    name: 'App Vanilla JS',
    description: 'Aplicación HTTP sencilla ejecutada por bun y módulos locales.',
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
    name: 'API TypeScript',
    description: 'Servidor TypeScript compatible con Node ejecutado con el shim de Bun en Runbox.',
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
    name: 'Laboratorio Datos Python',
    description: 'Demuestra ejecución con python y pip install/list/freeze.',
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
    name: 'Flujo de Trabajo Git',
    description: 'Ejecuta comandos como init/branch/commit/merge antes de iniciar la app.',
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
    name: 'Demostración pnpm',
    description: 'Usa pnpm install/list/audit y expone datos con dependencias.',
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
    name: 'Demostración Yarn',
    description: 'Ejecuta yarn install/outdated e inicia una pequeña página SSR.',
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

interface TemplatesSidebarProps {
  onSelectTemplate: (templateName: string, files: Record<string, string>) => void;
  onConfirmTemplateLoad: (templateName: string) => Promise<boolean>;
}

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ onSelectTemplate, onConfirmTemplateLoad }) => {
  return (
    <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
      <div className="flex items-center px-4 py-3">
        <span className="text-xs font-poppins font-medium text-[#faf9f5]">Plantillas</span>
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
