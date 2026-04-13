import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TerminalProps {
  showTerminal: boolean;
  output: string[];
  setOutput: React.Dispatch<React.SetStateAction<string[]>>;
  terminalDivRef: React.RefObject<HTMLDivElement | null>;
  handleTerminalScroll: () => void;
  outputEndRef: React.RefObject<HTMLDivElement | null>;
}

export const Terminal: React.FC<TerminalProps> = ({
  showTerminal,
  output,
  setOutput,
  terminalDivRef,
  handleTerminalScroll,
  outputEndRef
}) => {
  const { t } = useTranslation();

  return (
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
              <span className="text-xs font-mono text-[#b0aea5] uppercase tracking-wider">{t('demo.terminal.title')}</span>
            </div>
            <button onClick={() => setOutput([`$ ${t('demo.output.terminal_cleared')}`])} className="text-xs font-mono text-[#b0aea5] hover:text-[#faf9f5] transition-colors">
              {t('demo.terminal.clear')}
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
  );
};
