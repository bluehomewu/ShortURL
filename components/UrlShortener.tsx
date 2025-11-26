import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { generateSmartSlug } from '../services/geminiService';
import { ShortLink } from '../types';
import { STORAGE_KEY_API_KEY, REPO_NAME } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface UrlShortenerProps {
  apiKey: string;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ apiKey }) => {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const response = await dbService.getAllLinks();
    if (response.success && response.data) {
      setHistory(response.data);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setError(null);
    setIsLoading(true);

    try {
      let finalSlug = slug.trim();

      // If no custom slug, and API key exists, try AI
      if (!finalSlug && apiKey) {
        try {
          finalSlug = await generateSmartSlug(url, apiKey);
        } catch (err) {
          console.warn("AI generation failed, falling back to random", err);
        }
      }

      // Create in DB
      const result = await dbService.createLink(url, finalSlug || undefined);
      
      if (result.success && result.data) {
        setUrl('');
        setSlug('');
        await loadHistory();
      } else {
        // Map backend errors to translations if possible
        if (result.error && result.error.includes("Slug already exists")) {
            setError(t('errorSlugExists'));
        } else {
            setError(result.error || t('errorFailed'));
        }
      }
    } catch (err) {
      setError(t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm(t('confirmDelete'))) return;
    await dbService.deleteLink(id);
    await loadHistory();
  };

  const getFullShortUrl = (id: string) => {
    // Construct the URL based on GitHub Pages environment
    const { protocol, host } = window.location;
    // We use HashRouter format for GitHub Pages compatibility
    return `${protocol}//${host}/${REPO_NAME}/#/${id}`;
  };

  const copyToClipboard = async (id: string) => {
    const fullUrl = getFullShortUrl(id);
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Input Section */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 md:p-10 shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">{t('shortenTitle')}</h2>
        <p className="text-center text-slate-400 mb-8">
           {apiKey ? t('shortenDescAI') : t('shortenDescNoAI')}
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <i className="fa-solid fa-link"></i>
            </div>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('inputUrlPlaceholder')}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
               <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={apiKey ? t('inputSlugPlaceholderAI') : t('inputSlugPlaceholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/25 transform transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <span><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> {t('btnShortening')}</span>
              ) : (
                <span>{t('btnShorten')} <i className="fa-solid fa-arrow-right ml-2"></i></span>
              )}
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}
        </form>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
          <i className="fa-solid fa-clock-rotate-left mr-3 text-slate-500"></i> {t('recentLinks')}
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
            <i className="fa-solid fa-ghost text-4xl text-slate-700 mb-3"></i>
            <p className="text-slate-500">{t('noLinks')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((link) => (
              <div key={link.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <a 
                        href={`#/${link.id}`} 
                        className="text-xl font-bold text-blue-400 hover:text-blue-300 hover:underline truncate"
                      >
                        /{link.id}
                      </a>
                      {link.aiGenerated && (
                        <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider font-bold">
                          {t('aiTag')}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm truncate max-w-lg mb-2" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 gap-4">
                      <span><i className="fa-regular fa-calendar mr-1"></i> {new Date(link.createdAt).toLocaleDateString()}</span>
                      <span><i className="fa-solid fa-chart-simple mr-1"></i> {link.clicks} clicks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(link.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        copiedId === link.id 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      }`}
                    >
                      {copiedId === link.id ? (
                        <span><i className="fa-solid fa-check mr-1"></i> {t('copied')}</span>
                      ) : (
                        <span><i className="fa-regular fa-copy mr-1"></i> {t('copy')}</span>
                      )}
                    </button>
                    <button
                      onClick={() => window.open(link.originalUrl, '_blank')}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                      title={t('visit')}
                    >
                      <i className="fa-solid fa-external-link-alt"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      title={t('delete')}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
                {/* Decorative background gradient */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
