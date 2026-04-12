import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface PreviewProps {
  serverPort: number | null;
  browserUrl: string;
  setBrowserUrl: (url: string) => void;
  handleNavigate: (path: string) => void;
  previewHtml: string;
  handleReload: () => void;
  handleGoBack: () => void;
  handleGoForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export const Preview: React.FC<PreviewProps> = ({
  serverPort,
  browserUrl,
  setBrowserUrl,
  handleNavigate,
  previewHtml,
  handleReload,
  handleGoBack,
  handleGoForward,
  canGoBack,
  canGoForward
}) => {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex-1 flex flex-col min-h-0 bg-[#0a0a09] border-l border-[#b0aea5]/10"
    >
      {/* Address Bar */}
      <div className="flex items-center px-4 py-2 border-b border-[#b0aea5]/10 bg-[#141413] gap-2 shrink-0">
        <div className="flex items-center gap-1 mr-1">
          <button 
            onClick={handleGoBack} 
            disabled={!serverPort || !canGoBack}
            className="p-1 rounded text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#1e1e1d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleGoForward} 
            disabled={!serverPort || !canGoForward}
            className="p-1 rounded text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#1e1e1d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReload} 
            disabled={!serverPort}
            className="p-1 rounded text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#1e1e1d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center flex-1 bg-[#1e1e1d] border border-[#b0aea5]/20 rounded px-3 py-1.5 gap-2 focus-within:border-[#d97757]/50 transition-colors">
          <Globe className="w-3.5 h-3.5 text-[#b0aea5]/60 shrink-0" />
          <span className="text-xs text-[#b0aea5]/60 font-mono shrink-0">localhost:{serverPort || '3000'}</span>
          <input
            type="text" value={browserUrl}
            onChange={e => setBrowserUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNavigate(browserUrl)}
            disabled={!serverPort}
            className="flex-1 text-xs font-mono text-[#faf9f5] focus:outline-none min-w-0 disabled:bg-transparent placeholder:text-[#b0aea5]/30"
          />
        </div>
        <button
          onClick={() => handleNavigate(browserUrl)} disabled={!serverPort}
          className="text-xs bg-[#d97757] hover:bg-[#c76547] text-[#141413] px-4 py-1.5 rounded font-medium shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >Go</button>
      </div>

      {/* Iframe */}
      <div className="flex-1 overflow-y-auto bg-white">
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
          <div className="h-full flex items-center justify-center bg-[#0a0a09] text-[#b0aea5] font-poppins text-sm text-center p-6">
            <div className="max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1e1e1d] flex items-center justify-center border border-[#b0aea5]/10 shadow-inner">
                <Globe className="w-8 h-8 text-[#d97757] opacity-80" />
              </div>
              <h3 className="text-base font-medium text-[#faf9f5] mb-2 tracking-tight">No server running</h3>
              <p className="text-xs text-[#b0aea5]/70 leading-relaxed max-w-sm mx-auto">
                Click the <span className="text-[#d97757] font-medium">Run</span> button to execute your code. If it starts an HTTP server, the preview will automatically appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
