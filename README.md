# ShortURL - AI 短網址產生器

使用 Gemini AI 智慧生成短網址的服務，部署於 GitHub Pages。

🔗 **線上版本：** https://bluehomewu.github.io/ShortURL/

## 功能特色

- 🤖 AI 智慧生成好記的短網址程式碼
- 🔥 Firebase Firestore 資料儲存
- 📊 點選次數統計
- 🚀 GitHub Pages 自動部署

## 快速開始：部署到 GitHub Pages

### 步驟 1：Fork 此專案

點選右上角的 **Fork** 按鈕，將此專案複製到您的 GitHub 帳戶。

### 步驟 2：建立 Firebase 專案

1. 前往 [Firebase 控制檯](https://console.firebase.google.com/)
2. 點選「新增專案」建立新專案
3. 在專案設定中，新增「網頁應用程式」
4. 複製 Firebase 設定資訊（稍後使用）

### 步驟 3：設定 Firestore 資料庫

1. 在 Firebase 控制檯，前往「Firestore Database」
2. 點選「建立資料庫」
3. 前往「Rules」頁籤，將這個專案中的 `firestore.rules` 檔案內容貼上並發布

### 步驟 4：取得 Gemini API 金鑰

1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 點選「Get API key」取得 API 金鑰

### 步驟 5：設定 GitHub Secrets

在您 Fork 的儲存庫中：

1. 前往 **Settings** → **Secrets and variables** → **Actions**
2. 點選 **New repository secret**，新增以下金鑰：

| Secret 名稱 | 說明 |
|------------|------|
| `GEMINI_API_KEY` | Google AI Studio 的 API 金鑰 |
| `FIREBASE_API_KEY` | Firebase 設定中的 apiKey |
| `FIREBASE_AUTH_DOMAIN` | Firebase 設定中的 authDomain |
| `FIREBASE_PROJECT_ID` | Firebase 設定中的 projectId |
| `FIREBASE_STORAGE_BUCKET` | Firebase 設定中的 storageBucket |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase 設定中的 messagingSenderId |
| `FIREBASE_APP_ID` | Firebase 設定中的 appId |

### 步驟 6：啟用 GitHub Pages

1. 前往儲存庫 **Settings** → **Pages**
2. 在「Build and deployment」區塊：
   - **Source**：選擇「**GitHub Actions**」

### 步驟 7：觸發部署

推送任何變更到 `main` 分支，或手動執行 Actions：

1. 前往儲存庫的 **Actions** 頁籤
2. 選擇「Deploy to GitHub Pages」工作流程
3. 點選「Run workflow」

部署完成後，您的短網址服務將在以下網址上線：
```
https://<您的使用者名稱>.github.io/ShortURL/
```

## 本機開發

如需在本機執行開發：

```bash
# 安裝相依套件
npm install

# 複製環境變數範本
cp .env.local.example .env.local

# 編輯 .env.local 填入您的 API 金鑰

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 http://localhost:3000 啟動。

## 技術架構

- **前端框架**：React 19 + TypeScript
- **建置工具**：Vite
- **AI 服務**：Google Gemini API
- **資料庫**：Firebase Firestore
- **部署平臺**：GitHub Pages

## 授權

MIT License
