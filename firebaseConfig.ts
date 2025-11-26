import { FirebaseConfig } from './types';

// TODO: 請將您的 Firebase 設定值填入下方
// TODO: Replace the values below with your specific Firebase configuration
export const firebaseConfig: FirebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 檢查是否已設定 (Check if configured)
export const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";