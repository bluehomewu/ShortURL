import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full py-6 mt-12 border-t border-slate-800 text-center">
      <p className="text-slate-500 text-sm">
        {t('footerPowered')} <span className="text-blue-400 font-semibold">Gemini 2.5 Flash</span> & React
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="https://github.com/bluehomewu" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-white transition-colors">
          <i className="fa-brands fa-github"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
