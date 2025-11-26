import { FirebaseConfig } from './types';

// Load Firebase configuration from environment variables
// These should be set in .env.local for local development
// and as GitHub Secrets for GitHub Pages deployment
export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

// Check if Firebase is configured (all required fields are present)
// Note: storageBucket and messagingSenderId are optional for basic Firestore functionality
export const isConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain &&
  firebaseConfig.appId
);