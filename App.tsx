import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UrlShortener from './components/UrlShortener';
import RedirectHandler from './components/RedirectHandler';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-100">
          <Header />
          
          <main className="flex-grow pt-10 pb-20">
            <div className="container mx-auto">
              <Routes>
                {/* Route for creating links */}
                <Route path="/" element={<UrlShortener />} />
                
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
