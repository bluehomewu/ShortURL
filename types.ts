export interface ShortLink {
  id: string; // The slug (e.g., 'gemini-docs')
  originalUrl: string;
  createdAt: number;
  clicks: number;
  aiGenerated: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GeminiConfig {
  apiKey: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}