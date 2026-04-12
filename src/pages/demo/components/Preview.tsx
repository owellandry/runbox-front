import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface PreviewProps {
  serverPort: number | null;
  browserUrl: string;
  setBrowserUrl: (url: string) => void;
  handleNavigate: (path: string) => void;
  previewHtml: string;
}

export const Preview: React.FC<PreviewProps> = ({
  serverPort,
  browserUrl,
  setBrowserUrl,
  handleNavigate,
  previewHtml
}) => {
  return (
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
  );
};
