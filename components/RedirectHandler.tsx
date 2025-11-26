import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { useLanguage } from '../contexts/LanguageContext';

const RedirectHandler: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleRedirect = async () => {
      if (!slug) {
        navigate('/'); // Go home if no slug
        return;
      }

      try {
        const response = await dbService.getLink(slug);
        
        if (response.success && response.data) {
          // Increment views (async, don't wait)
          dbService.incrementClicks(slug);
          
          // Perform Redirect
          // Use location.replace to avoid back-button loops
          window.location.replace(response.data.originalUrl);
        } else {
          setError(t('redirectErrorMsg'));
        }
      } catch (err) {
        setError(t('redirectErrorMsg'));
      }
    };

    handleRedirect();
  }, [slug, navigate, t]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 text-3xl">
           <i className="fa-solid fa-broken-link"></i>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{t('redirectErrorTitle')}</h2>
        <p className="text-slate-400 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-slate-700"
        >
          {t('btnHome')}
        </button>
      </div>
    );
  }

  // Loading State
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-white animate-pulse">{t('redirecting')}</h2>
      <p className="text-slate-500 mt-2 text-sm">{t('redirectWait')}</p>
    </div>
  );
};

export default RedirectHandler;
