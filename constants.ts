// This matches the user's request for their GitHub Pages path
// If the repo name is 'shortURL', this should be the basename.
// However, HashRouter handles pathing gracefully without strict basename in most cases.
export const REPO_NAME = 'shortURL';

export const APP_TITLE = 'EdwardWu の 個人短網址服務';
export const APP_DESCRIPTION = 'AI-Powered URL Shortener';

// Placeholder for storage keys
export const STORAGE_KEY_LINKS = 'gemini_short_links';
export const STORAGE_KEY_FIREBASE_CONFIG = 'gemini_firebase_config';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';