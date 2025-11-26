import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEY_FIREBASE_CONFIG } from '../constants';
import { FirebaseConfig } from '../types';
import { firebaseConfig as staticConfig, isConfigured as isStaticConfigured } from '../firebaseConfig';

type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "EdwardWu's Shortener",
    settings: "Settings",
    config: "Configuration",
    apiKeyLabel: "Gemini API Key",
    apiKeyPlaceholder: "Paste your API key here",
    apiKeyHelp: "Required for AI Smart Slugs. (Optional for basic shortening)",
    
    firebaseLabel: "Firebase Config (JSON)",
    firebasePlaceholder: "Paste config object: { apiKey: '...', ... }",
    firebaseHelp: "Required for cloud storage. Paste from Firebase Console.",

    dbConnected: "Connected to Firebase Cloud.",
    dbNotConfigured: "Local Mode (Config in Settings)",

    footerPowered: "Powered by",
    shortenTitle: "Shorten a long URL",
    shortenDescAI: "AI-powered smart slugs enabled",
    shortenDescNoAI: "Enter a URL below. Add an API key in settings for AI features.",
    inputUrlPlaceholder: "Paste long URL here (e.g., https://super-long-domain.com/article...)",
    inputSlugPlaceholder: "Custom slug (optional)",
    inputSlugPlaceholderAI: "Custom slug (optional - leave empty for AI)",
    btnShortening: "Shortening...",
    btnShorten: "Shorten URL",
    errorGeneric: "An unexpected error occurred.",
    errorFailed: "Failed to create link",
    errorSlugExists: "Slug already exists. Please choose another.",
    recentLinks: "Recent Links",
    noLinks: "No links created yet.",
    copy: "Copy",
    copied: "Copied",
    visit: "Visit Original",
    delete: "Delete",
    confirmDelete: "Delete this link?",
    redirecting: "Redirecting...",
    redirectWait: "Please wait while we take you to your destination",
    redirectErrorTitle: "Oops!",
    redirectErrorMsg: "Link not found or expired.",
    btnHome: "Go to Home",
    aiTag: "AI"
  },
  'zh-TW': {
    appTitle: "EdwardWu の 個人短網址服務",
    settings: "設定",
    config: "系統設定",
    apiKeyLabel: "Gemini API 金鑰",
    apiKeyPlaceholder: "在此貼上您的 API 金鑰",
    apiKeyHelp: "用於 AI 智慧縮網址 (若不填寫仍可使用一般縮址)。",
    
    firebaseLabel: "Firebase 設定檔 (JSON)",
    firebasePlaceholder: "貼上設定物件：{ apiKey: '...', ... }",
    firebaseHelp: "雲端儲存必要設定。請從 Firebase 控制台複製貼上。",

    dbConnected: "已連線至 Firebase 雲端資料庫。",
    dbNotConfigured: "本地模式 (請於設定中輸入 Firebase 設定)",

    footerPowered: "技術提供：",
    shortenTitle: "縮短您的長網址",
    shortenDescAI: "已啟用 AI 智慧縮網址功能",
    shortenDescNoAI: "請在下方輸入網址。在設定中加入 API 金鑰即可啟用 AI 功能。",
    inputUrlPlaceholder: "在此貼上長網址 (例如：https://super-long-domain.com/article...)",
    inputSlugPlaceholder: "自訂短網址代碼 (選填)",
    inputSlugPlaceholderAI: "自訂短網址代碼 (選填，若留空則由 AI 產生)",
    btnShortening: "縮址中...",
    btnShorten: "縮短網址",
    errorGeneric: "發生未預期的錯誤。",
    errorFailed: "建立連結失敗",
    errorSlugExists: "該短網址代碼已存在，請選擇其他的。",
    recentLinks: "最近建立的連結",
    noLinks: "尚未建立任何連結。",
    copy: "複製",
    copied: "已複製",
    visit: "訪問原連結",
    delete: "刪除",
    confirmDelete: "確定要刪除此連結嗎？",
    redirecting: "正在重新導向...",
    redirectWait: "請稍候，我們正在帶您前往目的地",
    redirectErrorTitle: "糟糕！",
    redirectErrorMsg: "連結找不到或已過期。",
    btnHome: "返回首頁",
    aiTag: "AI"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-TW');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_language') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'zh-TW')) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};