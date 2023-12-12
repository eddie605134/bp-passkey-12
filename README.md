# OAuth前後端示例項目

這個項目展示了如何在前後端分離的架構中實現基於Google的OAuth認證。前端使用React、Vite和TypeScript，後端則使用Node.js和TypeScript。

## 前端設置

1. **安裝依賴**:
   在前端項目目錄下，執行以下命令安裝依賴：
   ```bash
   npm install
   ```

2. **設置環境變數**:
   創建一個`.env`檔案在項目根目錄下，並添加以下內容：
   ```
   VITE_REACT_APP_CLIENT_ID=您的Google客戶端ID
   VITE_REACT_APP_REDIRECT_URI=您的重定向URI
   ```
   請替換上述值為您自己的設定。

3. **運行項目**:
   使用以下命令啟動前端開發服務器：
   ```bash
   npm run dev
   ```

## 後端設置

1. **安裝依賴**:
   在後端項目目錄下，執行以下命令安裝依賴：
   ```bash
   npm install
   ```

2. **設置環境變數**:
   創建一個`.env`檔案在項目根目錄下，並添加以下內容：
   ```
   CLIENT_ID=您的Google客戶端ID
   CLIENT_SECRET=您的Google客戶端密鑰
   REDIRECT_URI=您的重定向URI
   ```
   請替換上述值為您自己的設定。

3. **運行項目**:
   使用以下命令啟動後端服務器：
   ```bash
   npm start
   ```

## 如何使用

- 啟動前端和後端服務器後，訪問前端應用的URL（預設為`http://localhost:3000`）。
- 點擊登入按鈕並完成Google身份認證流程。
- 認證成功後，您將看到相關資訊顯示在前端應用中。

## 貢獻

歡迎對本項目進行貢獻。若要貢獻，請首先討論您想要更改的內容。

## 授權

[MIT](https://choosealicense.com/licenses/mit/)
