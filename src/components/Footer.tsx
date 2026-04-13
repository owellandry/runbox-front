import React from 'react';
import { Box, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

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
          <div className="flex items-center gap-2 mr-4">
            <Globe className="w-3.5 h-3.5" />
            <select 
              value={i18n.language} 
              onChange={handleLanguageChange}
              className="bg-transparent border-none text-anthropic-mid-gray hover:text-anthropic-light outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <Link to="/privacy" className="hover:text-anthropic-light transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-anthropic-light transition-colors">{t('footer.terms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;