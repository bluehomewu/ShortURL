import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UrlShortener from './components/UrlShortener';
import RedirectHandler from './components/RedirectHandler';
import { STORAGE_KEY_API_KEY } from './constants';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load API Key from local storage on mount
    const storedKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_KEY_API_KEY, key);
  };

  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
          <Header apiKey={apiKey} setApiKey={handleSetApiKey} />
          
          <main className="flex-grow pt-10 pb-20">
            <div className="container mx-auto">
              <Routes>
                {/* Route for creating links */}
                <Route path="/" element={<UrlShortener apiKey={apiKey} />} />
                
                {/* Route for handling redirects (/:slug) */}
                <Route path="/:slug" element={<RedirectHandler />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>

          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
