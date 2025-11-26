<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 執行並部署您的 AI Studio 應用程式

此專案包含在本機執行應用程式所需的所有內容。

在 AI Studio 中查看您的應用程式：https://ai.studio/apps/drive/1MWbgOzJLFrI_jsC2_MkhzvZ695sejH71

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
   
   **替代方法（透過 Firebase 控制台）：**
   - 前往 [Firebase 控制台](https://console.firebase.google.com/)
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
   - 新增以下 secrets（儲存庫密鑰）：
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

## 疑難排解

### 短網址在無痕/隱私瀏覽模式下返回 404

**問題：** 短網址在一般瀏覽器中可正常運作，但在無痕/隱私瀏覽模式或其他使用者存取時返回 404 錯誤。

**可能原因及解決方案：**

#### 1. GitHub Secrets 未設定（最常見）

如果您的 Firebase 規則已經開放（`allow read, write: if true;`），問題可能是部署的建置中缺少 Firebase 憑證。

**檢查並修復：**

1. 確認所有 Firebase secrets 都已在您的 GitHub 儲存庫中設定：
   - 前往您的儲存庫 → Settings → Secrets and variables → Actions
   - 確保這些 secrets 存在且值正確（來自您的 [Firebase 控制台](https://console.firebase.google.com/)）：
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

2. 新增/更新 secrets 後，觸發新的部署：
   ```bash
   git commit --allow-empty -m "Trigger rebuild with updated secrets"
   git push origin main
   ```

3. **除錯已部署的建置：**
   - 開啟您已部署的應用程式：https://bluehomewu.github.io/ShortURL/
   - 開啟瀏覽器開發者工具（F12）→ Console 分頁
   - 尋找以下錯誤訊息：
     - `"Firebase has not been configured in firebaseConfig.ts"`
     - `"Database not configured"`
   - 如果您看到這些錯誤，表示您的 secrets 未在 GitHub 中正確設定

4. **驗證已建置應用程式中的 Firebase 設定：**
   - 在開發者工具 Console 中輸入：`window.location.href`
   - 存取短網址時檢查 Network 分頁
   - 尋找 Firestore API 呼叫 - 如果沒有，表示 Firebase 未初始化

#### 2. URL 大小寫敏感性

**重要：** GitHub Pages URL 是**區分大小寫**的。請務必使用正確的大小寫：
- ✅ 正確：`https://bluehomewu.github.io/ShortURL/#/yr1uty`
- ❌ 錯誤：`https://bluehomewu.github.io/shortURL/#/yr1uty`

請注意「ShortURL」中的大寫「S」和「U」。

#### 3. Firebase 安全規則（較少見）

如果您的 Firebase 規則是限制性的，您可能需要部署更新的規則：

1. 使用 Firebase CLI 部署 `firestore.rules` 檔案：
   ```bash
   firebase deploy --only firestore:rules
   ```

2. 或透過 Firebase 控制台更新規則：
   - 前往 [Firebase 控制台](https://console.firebase.google.com/)
   - 選擇您的專案 → Firestore Database → Rules
   - 確保規則允許公開讀取存取

**快速測試：**
- 開啟無痕模式
- 導航至您的應用程式：https://bluehomewu.github.io/ShortURL/
- 開啟開發者工具 Console（F12）
- 檢查 Firebase 初始化錯誤
- 嘗試建立短連結並觀察任何錯誤訊息
