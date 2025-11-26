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

4. **Configure Firebase Firestore Security Rules:**
   
   For the URL shortener to work properly (especially in incognito/private browsing mode), you need to deploy the Firestore security rules to allow public read access:
   
   a. Install Firebase CLI if you haven't already (or use npx to run without installing):
   ```bash
   npm install -g firebase-tools
   # Or use npx without installing globally:
   # npx firebase-tools <command>
   ```
   
   b. Login to Firebase:
   ```bash
   firebase login
   ```
   
   c. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```
   Select your Firebase project when prompted, and use the existing `firestore.rules` file.
   
   d. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   
   **Alternative method (via Firebase Console):**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Firestore Database → Rules
   - Copy the content from `firestore.rules` file in this repository
   - Paste it into the rules editor and publish
   
   **Important Security Notes:**
   - The security rules allow public read access to the `links` collection, which is necessary for anyone to use shortened URLs without authentication
   - By default, delete operations require authentication. If you need to delete links, you have two options:
     1. **(Recommended)** Implement Firebase Authentication in the app
     2. **(Less Secure)** Modify the `firestore.rules` file to allow public delete access (see comments in the file)
   - Update operations are restricted to only the `clicks` field to prevent unauthorized modifications

5. Run the app:
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
     - `GEMINI_API_KEY` (for AI-powered slug generation)
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

## Troubleshooting

### Short URLs return 404 in incognito/private browsing mode

**Problem:** Short URLs work in your regular browser but return 404 errors when accessed in incognito/private browsing mode or by other users.

**Possible Causes and Solutions:**

#### 1. GitHub Secrets Not Configured (Most Common)

If your Firebase rules are already open (`allow read, write: if true;`), the issue is likely that Firebase credentials are missing from the deployed build.

**Check and fix:**

1. Verify that ALL Firebase secrets are set in your GitHub repository:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Ensure these secrets exist with correct values from your [Firebase Console](https://console.firebase.google.com/):
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

2. After adding/updating secrets, trigger a new deployment:
   ```bash
   git commit --allow-empty -m "Trigger rebuild with updated secrets"
   git push origin main
   ```

3. **Debug the deployed build:**
   - Open your deployed app: https://bluehomewu.github.io/shortURL/
   - Open browser DevTools (F12) → Console tab
   - Look for errors like:
     - `"Firebase has not been configured in firebaseConfig.ts"`
     - `"Database not configured"`
   - If you see these errors, your secrets are not properly set in GitHub

4. **Verify Firebase config in the built app:**
   - In DevTools Console, type: `window.location.href`
   - Check the Network tab when accessing a short URL
   - Look for Firestore API calls - if there are none, Firebase isn't initialized

#### 2. Firebase Security Rules (Less Common)

If your Firebase rules are restrictive, you may need to deploy updated rules:

1. Deploy the `firestore.rules` file using Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. Or update rules via Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Firestore Database → Rules
   - Ensure rules allow public read access

**Quick Test:**
- Open incognito mode
- Navigate to your app: https://bluehomewu.github.io/shortURL/
- Open DevTools Console (F12)
- Check for Firebase initialization errors
- Try to create a short link and observe any error messages
