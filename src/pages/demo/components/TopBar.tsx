import React from 'react';
import { Terminal as TerminalIcon, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandLogo from '../../../components/BrandLogo';

interface TopBarProps {
  activeView: 'code' | 'preview';
  setActiveView: (view: 'code' | 'preview') => void;
  showTerminal: boolean;
  setShowTerminal: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
  handleRun: () => void;
  isRunning: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  setActiveView,
  showTerminal,
  setShowTerminal,
  handleReset,
  handleRun,
  isRunning
}) => {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b border-[#b0aea5]/10 shrink-0 bg-[#141413]">
      <Link to="/" className="flex items-center gap-2 w-1/3 cursor-pointer hover:opacity-80 transition-opacity">
        <BrandLogo className="w-5 h-5 shrink-0" />
        <h1 className="text-lg font-poppins font-medium tracking-tight text-[#faf9f5]">Runbox IDE</h1>
      </Link>

      <div className="flex items-center justify-center w-1/3">
        <div className="flex bg-[#1e1e1d] p-1 rounded-full border border-[#b0aea5]/10 relative">
          <button
            onClick={() => setActiveView('preview')}
            className={`relative px-4 py-1 text-xs font-poppins rounded-full transition-colors capitalize cursor-pointer ${activeView === 'preview' ? 'text-[#faf9f5] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
          >
            {activeView === 'preview' && (
              <motion.span
                layoutId="activeViewBubble"
                className="absolute inset-0 bg-[#d97757] rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {t('demo.topbar.preview')}
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`relative px-4 py-1 text-xs font-poppins rounded-full transition-colors capitalize cursor-pointer ${activeView === 'code' ? 'text-[#faf9f5] font-medium' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
          >
            {activeView === 'code' && (
              <motion.span
                layoutId="activeViewBubble"
                className="absolute inset-0 bg-[#d97757] rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {t('demo.topbar.code')}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-1/3">
        <button
          onClick={() => setShowTerminal(v => !v)}
          className={`text-xs font-poppins flex items-center gap-1 transition-colors cursor-pointer ${showTerminal ? 'text-[#faf9f5]' : 'text-[#b0aea5] hover:text-[#faf9f5]'}`}
        >
          <TerminalIcon className="w-4 h-4" /> {t('demo.terminal.title')}
        </button>
        <button
          onClick={handleReset}
          className="text-xs font-poppins text-[#b0aea5] hover:text-[#faf9f5] transition-colors cursor-pointer"
        >
          {t('demo.topbar.reset')}
        </button>
        <div className="h-4 w-px bg-[#b0aea5]/20" />
        <motion.button 
          whileHover={!isRunning ? { scale: 1.05 } : {}}
          whileTap={!isRunning ? { scale: 0.95 } : {}}
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 text-xs font-poppins font-medium text-[#faf9f5] bg-[#d97757] px-4 py-1.5 rounded-full hover:bg-[#c76547] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          {isRunning ? t('demo.topbar.running') : t('demo.topbar.run')}
        </motion.button>
      </div>
    </header>
  );
};
