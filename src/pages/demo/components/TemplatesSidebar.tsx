import React from 'react';
import { SiReact, SiJavascript } from 'react-icons/si';
import { defaultFiles } from '../constants/defaultFiles';

// Podemos extender esto en el futuro con más plantillas
export const templates = [
  {
    id: 'react-dashboard',
    name: 'React Dashboard',
    description: 'A modern React dashboard with components, pages, and mock data.',
    icon: <SiReact className="text-[#61dafb] w-5 h-5" />,
    files: defaultFiles
  },
  {
    id: 'vanilla-js',
    name: 'Vanilla JS App',
    description: 'A simple Vanilla JavaScript application with a basic HTTP server.',
    icon: <SiJavascript className="text-[#f0db4f] w-5 h-5" />,
    files: {
      '/package.json': `{
  "name": "vanilla-app",
  "scripts": { "start": "bun run /index.js" }
}`,
      '/index.js': `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(\`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
        <h1>Hello from Vanilla JS!</h1>
        <p>Edit /index.js and re-run.</p>
      </body>
    </html>
  \`);
});

server.listen(3000, () => console.log('Server running on port 3000'));`
    }
  }
];

interface TemplatesSidebarProps {
  onSelectTemplate: (files: Record<string, string>) => void;
}

export const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ onSelectTemplate }) => {
  return (
    <div className="w-64 shrink-0 bg-[#141413] border-r border-[#b0aea5]/10 flex flex-col">
      <div className="flex items-center px-4 py-3">
        <span className="text-xs font-poppins font-medium text-[#faf9f5]">Templates</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-3">
        {templates.map(tpl => (
          <div 
            key={tpl.id}
            onClick={() => {
              if (window.confirm(`Load ${tpl.name}? Current changes will be lost.`)) {
                onSelectTemplate(tpl.files);
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
