import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { isConfigured } from '../firebaseConfig';

interface HeaderProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, setApiKey }) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh-TW' : 'en');
  };

  return (
    <header className="w-full p-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-link"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {t('appTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Config Status Indicator */}
          {!isConfigured && (
             <div className="hidden md:flex items-center gap-2 text-[10px] px-2 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 animate-pulse">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Setup Required
             </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold flex items-center gap-2"
            title="Switch Language"
          >
            <i className="fa-solid fa-globe"></i>
            {language === 'en' ? '中文' : 'EN'}
          </button>

          {/* Settings Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800 ${isSettingsOpen ? 'text-white bg-slate-800' : ''}`}
              title={t('settings')}
            >
              <i className="fa-solid fa-gear text-xl"></i>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 z-50">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider border-b border-slate-700 pb-2">{t('config')}</h3>
                
                {/* API Key Section */}
                <div className="mb-4">
                  <label className="block text-xs text-blue-400 font-bold mb-1 uppercase">
                     <i className="fa-solid fa-robot mr-1"></i> {t('apiKeyLabel')}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t('apiKeyPlaceholder')}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 focus:outline-none transition-colors mb-1"
                  />
                  <p className="text-[10px] text-slate-500">
                    {t('apiKeyHelp')}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <p className="text-[10px] text-slate-500 leading-tight">
                    <i className="fa-solid fa-cloud mr-1"></i>
                    {isConfigured ? t('dbConnected') : t('dbNotConfigured')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;