# 執行並部署您的 AI Studio 應用程式

此專案包含在本機執行應用程式所需的所有內容。

在 AI Studio 中檢視您的應用程式：https://ai.studio/apps/drive/1MWbgOzJLFrI_jsC2_MkhzvZ695sejH71

## 本機執行

**前置需求：** Node.js

1. 安裝相依套件：
   ```bash
   npm install
   ```

2. 在根目錄建立 `.env.local` 檔案（從 `.env.local.example` 複製）：
   ```bash
   cp .env.local.example .env.local
   ```

3. 在 `.env.local` 中設定您的環境變數：
   - `GEMINI_API_KEY`：您的 Gemini API 金鑰（用於 AI 生成短網址）
   - `FIREBASE_API_KEY`：您的 Firebase API 金鑰
   - `FIREBASE_AUTH_DOMAIN`：您的 Firebase 驗證網域
   - `FIREBASE_PROJECT_ID`：您的 Firebase 專案 ID
   - `FIREBASE_STORAGE_BUCKET`：您的 Firebase 儲存空間
   - `FIREBASE_MESSAGING_SENDER_ID`：您的 Firebase 訊息傳送者 ID
   - `FIREBASE_APP_ID`：您的 Firebase 應用程式 ID

4. **設定 Firebase Firestore 安全規則：**
   
   為了讓短網址服務正常運作（特別是在無痕/隱私瀏覽模式下），您需要部署 Firestore 安全規則以允許公開讀取存取：
   
   a. 安裝 Firebase CLI（如果尚未安裝，或使用 npx 無需安裝直接執行）：
   ```bash
   npm install -g firebase-tools
   # 或使用 npx 無需全域安裝：
   # npx firebase-tools <指令>
   ```
   
   b. 登入 Firebase：
   ```bash
   firebase login
   ```
   
   c. 在您的專案中初始化 Firebase（如果尚未完成）：
   ```bash
   firebase init firestore
   ```
   出現提示時選擇您的 Firebase 專案，並使用現有的 `firestore.rules` 檔案。
   
   d. 部署安全規則：
   ```bash
   firebase deploy --only firestore:rules
   ```
   
   **替代方法（透過 Firebase 控制檯）：**
   - 前往 [Firebase 控制檯](https://console.firebase.google.com/)
   - 選擇您的專案
   - 導航至 Firestore Database → Rules
   - 複製此儲存庫中 `firestore.rules` 檔案的內容
   - 貼上至規則編輯器並發布
   
   **重要安全注意事項：**
   - 安全規則允許對 `links` 集合進行公開讀取存取，這是讓任何人無需驗證即可使用短網址的必要條件
   - 預設情況下，刪除操作需要驗證。如果您需要刪除連結，有兩個選項：
     1. **（推薦）** 在應用程式中實作 Firebase 驗證
     2. **（較不安全）** 修改 `firestore.rules` 檔案以允許公開刪除存取（請參閱檔案中的註解）
   - 更新操作僅限於 `clicks` 欄位，以防止未經授權的修改

5. 執行應用程式：
   ```bash
   npm run dev
   ```

## GitHub Pages 部署

當變更推送到 `main` 分支時，此應用程式會自動部署到 GitHub Pages。

**部署網址：** https://bluehomewu.github.io/ShortURL/

### 設定說明

若要為您的儲存庫啟用 GitHub Pages 部署：

1. **設定 GitHub Secrets：**
   - 前往您的儲存庫 Settings → Secrets and variables → Actions
   - 新增以下 secrets（儲存庫金鑰）：
     - `GEMINI_API_KEY`（用於 AI 生成短網址）
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

2. **啟用 GitHub Pages：**
   - 前往儲存庫 Settings → Pages
   - 在「Build and deployment」下：
     - Source：選擇「GitHub Actions」

3. **部署：**
   - 推送變更到 `main` 分支以觸發自動部署

### 手動建置

在本機建置專案：

```bash
npm run build
```

建置後的檔案將位於 `dist` 目錄中。

若要使用自訂基礎路徑建置，請設定 `BASE_PATH` 環境變數：

```bash
BASE_PATH=/my-custom-path/ npm run build
```
