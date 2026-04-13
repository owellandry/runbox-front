import React, { useState, useRef, useEffect } from 'react';
import { Box, Globe, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="bg-anthropic-dark pt-24 pb-12 px-6 md:px-12 border-t border-anthropic-light-gray/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-poppins font-medium tracking-tight text-anthropic-light w-fit hover:opacity-80 transition-opacity">
            <Box className="w-6 h-6 text-anthropic-orange" />
            <span>Runboxjs</span>
          </Link>
          <p className="text-anthropic-mid-gray font-lora max-w-sm leading-relaxed">
            {t('footer.description')}
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-poppins font-medium text-anthropic-light mb-2">{t('footer.resources')}</h4>
          <Link to="/docs" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">{t('footer.docs')}</Link>
          <Link to="/demo" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">{t('footer.demo')}</Link>
          <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-orange transition-colors w-fit">{t('footer.blog')}</a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-poppins font-medium text-anthropic-light mb-2">{t('footer.community')}</h4>
          <a href="https://github.com/owellandry/runbox-front" target="_blank" rel="noopener noreferrer" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">GitHub</a>
          <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">Discord</a>
          <a href="#" className="text-sm font-poppins text-anthropic-mid-gray hover:text-anthropic-blue transition-colors w-fit">Twitter / X</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-anthropic-light-gray/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-poppins text-anthropic-mid-gray/70">
        <p>© 2026 Runboxjs. {t('footer.rights')}</p>
        <div className="flex gap-6 items-center">
          <div className="relative mr-4" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1e1d] border border-[#b0aea5]/20 text-[#faf9f5] hover:border-[#d97757]/50 hover:bg-[#d97757]/10 transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#d97757]" />
              <span className="text-xs font-medium tracking-wide">{currentLang.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#b0aea5] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute bottom-full left-0 mb-2 w-36 bg-[#1e1e1d] border border-[#b0aea5]/20 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="py-1 flex flex-col">
                    {languages.map((lang) => {
                      const isActive = lang.code === currentLang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`flex items-center justify-between w-full px-4 py-2.5 text-xs text-left transition-colors cursor-pointer ${
                            isActive 
                              ? 'bg-[#d97757]/10 text-[#d97757] font-medium' 
                              : 'text-[#faf9f5] hover:bg-[#2a2a29]'
                          }`}
                        >
                          {lang.label}
                          {isActive && <Check className="w-3.5 h-3.5 text-[#d97757]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/privacy" className="hover:text-anthropic-light transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-anthropic-light transition-colors">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;