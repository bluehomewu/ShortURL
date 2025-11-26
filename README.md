<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MWbgOzJLFrI_jsC2_MkhzvZ695sejH71

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

3. Configure your environment variables in `.env.local`:
   - `GEMINI_API_KEY`: Your Gemini API key for AI-powered slug generation
   - `FIREBASE_API_KEY`: Your Firebase API key
   - `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `FIREBASE_APP_ID`: Your Firebase app ID

4. Run the app:
   ```bash
   npm run dev
   ```

## GitHub Pages Deployment

This app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Deployment URL:** https://bluehomewu.github.io/ShortURL/

### Setup Instructions

To enable GitHub Pages deployment for your repository:

1. **Configure GitHub Secrets:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add the following secrets (Repository secrets):
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Under "Build and deployment":
     - Source: Select "GitHub Actions"

3. **Deploy:**
   - Push changes to the `main` branch to trigger automatic deployment

### Manual Build

To build the project locally:

```bash
npm run build
```

The built files will be in the `dist` directory.

To build with a custom base path, set the `BASE_PATH` environment variable:

```bash
BASE_PATH=/my-custom-path/ npm run build
```
