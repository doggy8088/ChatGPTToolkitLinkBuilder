# ChatGPT 萬能工具箱：提示連結產生器

這是一個方便的網頁工具，可以幫助你建立 ChatGPT 提示詞連結，讓你快速分享和使用預先設定好的提示詞。

## 專案簡介

ChatGPT 提示連結產生器可以讓你：

- 🔗 建立包含預設提示詞的書籤連結
- 🤖 支援多種 AI 平台（ChatGPT、Claude、Gemini、Groq、Perplexity 等）
- 📋 一鍵複製連結或 Markdown 格式
- 🔍 設定為瀏覽器搜尋引擎快捷方式
- 💾 自動儲存設定到瀏覽器
- 🔄 支援連結分享功能

## 功能特色

### 1. 支援多個 AI 平台

本工具支援以下 AI 對話平台：
- ChatGPT（包含 GPT-4、GPT-4o、o1 等多種模型）
- Claude
- Google Gemini
- Groq
- Perplexity
- phind
- 各種 ChatGPT GPTs 自訂應用

### 2. 提示範本

內建多個常用提示範本：
- 使用正體中文回應
- 翻譯成正體中文
- 總結長文內容

### 3. 進階選項

- **自動送出提示詞**：開啟連結時自動送出提示
- **自動貼上圖片**：自動貼上剪貼簿中的圖片

### 4. 多種輸出格式

- 書籤連結：可拖曳到書籤列
- URL 格式：點擊自動複製
- Markdown 格式：適合文件撰寫
- 搜尋引擎設定：可設為 Chrome 自訂搜尋引擎

## 使用方式

### 線上使用

直接造訪：[https://ct-link-builder.gh.miniasp.com/](https://ct-link-builder.gh.miniasp.com/)

### 本地開發

#### 前置需求

- [Node.js](https://nodejs.org/) (v18 或更高版本)

#### 安裝步驟

1. 複製專案
```bash
git clone https://github.com/doggy8088/ChatGPTToolkitLinkBuilder.git
cd ChatGPTToolkitLinkBuilder
```

2. 執行建置
```bash
npm run build
```

建置後的檔案會輸出到 `dist/` 目錄。

## 建置說明

本專案使用 Node.js 作為建置工具，會自動：

1. 讀取 `src/` 目錄中的原始檔案
2. 最小化 HTML、CSS、JavaScript
3. 將 CSS 和 JS 內嵌到 HTML 中
4. 從 `package.json` 讀取版本號並更新到頁面上
5. 輸出最終檔案到 `dist/` 目錄

## 專案結構

```
ChatGPTToolkitLinkBuilder/
├── src/
│   ├── index.html      # 主要 HTML 檔案
│   ├── style.css       # 樣式表
│   └── app.js          # JavaScript 邏輯
├── dist/               # 建置輸出目錄
├── build.mjs           # Node.js 建置腳本
├── package.json        # 專案設定檔
├── LICENSE             # MIT 授權條款
├── README.md           # 專案說明文件
├── CNAME               # GitHub Pages 自訂網域
└── .nojekyll           # 停用 Jekyll
```

## 搭配擴充套件使用

為了獲得最佳體驗，建議安裝 [ChatGPT 萬能工具箱](https://chrome.google.com/webstore/detail/chatgpt-%E8%90%AC%E8%83%BD%E5%B7%A5%E5%85%B7%E7%AE%B1/fmijcafgekkphdijpclfgnjhchmiokgp?hl=zh-TW) Chrome 擴充套件。

## 授權條款

本專案採用 [MIT License](LICENSE) 授權。

## 作者

Will 保哥

## 貢獻

歡迎提交 Issue 或 Pull Request！

## 更新日誌

### v1.0.0
- 初始版本
- 支援多個 AI 平台
- 建置系統改用 Bun
- 重新設計前端介面
- 自動發佈到 GitHub Pages
