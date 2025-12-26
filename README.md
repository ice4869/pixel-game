# Pixel Quiz Game (生成式 AI 知識問答)

這是一個使用 React + Vite 開發的像素風問答遊戲，後端採用 Google Sheets + Google Apps Script (GAS) 作為資料庫與 API。

## 🚀 快速安裝 (Quick Start)

1. **安裝依賴**
   ```bash
   npm install
   ```
2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

---

## 🛠️ Google Sheets & Apps Script 設定指南

本專案需要連線到您的 Google 試算表才能運作。請依照以下步驟設定：

### 步驟 1：建立 Google Sheet
1. 前往 [Google Sheets](https://sheets.google.com) 建立一個新的試算表。
2. 將試算表命名為 `PixelGameDB` (或您喜歡的名稱)。
3. 建立兩個工作表 (Tabs)，名稱必須完全一致：
    - **`題目`**
    - **`回答`**

### 步驟 2：配置工作表欄位
請照以下順序設定欄位標題 (第一列)：

**工作表：`題目`**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Question | A | B | C | D | Answer |

**工作表：`回答`**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

### 步驟 3：部署 Google Apps Script
1. 在試算表中，點擊上方選單的 **`擴充功能` (Extensions) > `Apps Script`**。
2. 將專案根目錄下的 `gas_backend.js` 檔案內容，完全複製貼上到 Apps Script 的編輯器中 (覆蓋原本的 `Code.gs`)。
3. 點擊磁碟片圖示 **💾 儲存**。
4. 點擊右上角的 **`部署` (Deploy) > `新增部署` (New deployment)**。
5. 點擊齒輪圖示，選擇 **`網頁應用程式` (Web app)**。
6. 設定如下：
    - **說明**：Pixel Game API
    - **執行身份**：`我` (Me)
    - **誰可以存取**：**`任何人` (Anyone)**  <-- 重要！否則前端無法存取。
7. 點擊 **`部署` (Deploy)**。
8. 複製 **`網頁應用程式網址` (Web App URL)** (以 `/exec` 結尾的長網址)。

### 步驟 4：連線前端
1. 回到本專案目錄，打開 `.env` 檔案。
2. 將網址貼上：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=您的_GOOGLE_SCRIPT_網址
   ```
3. 重新啟動開發伺服器 (`npm run dev`)。

---

## 📚 測試題庫：生成式 AI 基礎知識 (可以直接複製貼上到 `題目` 工作表)

請將以下表格內容直接複製並貼上到您的 Google Sheet **`題目`** 工作表的 **A2** 儲存格開始處。

| ID | Question | A | B | C | D | Answer |
|----|----------|---|---|---|---|--------|
| Q01 | ChatGPT 是基於哪種神經網路架構？ | RNN | CNN | Transformer | LSTM | C |
| Q02 | 在 LLM 中，「Token」通常指的是什麼？ | 此加密貨幣 | 存取權杖 | 文本的最小單位 | 模型的權重 | C |
| Q03 | 下列何者是「文生圖」的生成式 AI 模型？ | GPT-4 | Midjourney | BERT | Llama 3 | B |
| Q04 | 什麼是 AI 的「幻覺 (Hallucination)」？ | AI 產生自我意識 | AI 生成看似合理但錯誤的資訊 | AI 拒絕回答問題 | AI 運算速度變慢 | B |
| Q05 | RAG 技術的全名是什麼？ | Retrieval-Augmented Generation | Real-Time AI Generation | Rapid AI Growth | Random Augmented Generation | A |
| Q06 | 調整模型的「Temperature」參數越高，會發生什麼事？ | 回答更固定、保守 | 回答更有創意、隨機性高 | 運算速度變快 | 模型會過熱當機 | B |
| Q07 | 以下哪個**不是**大型語言模型 (LLM)？ | Claude | Gemini | Llama | Photoshop | D |
| Q08 | 什麼是「Zero-shot Learning」？ | 模型經過大量微調 | 模型在沒有看過範例的情況下完成任務 | 模型無法學習任何新知識 | 模型需要 0 秒運算 | B |
| Q09 | 在 Prompt Engineering 中，「CoT」代表什麼？ | Chain of Thought | Code of Technology | Core of Transformer | Chat of Tools | A |
| Q10 | 將預訓練模型針對特定任務進行再訓練的過程稱為什麼？ | Pre-training | Fine-tuning | Inference | Tokenization | B |

---

## 🚀 自動部署到 GitHub Pages

本專案已設定好 GitHub Actions，只要推送程式碼到 GitHub，就會自動部署。

### 事前準備
1. 將專案上傳到 GitHub。
2. 進入 Repository 的 **Settings** > **Secrets and variables** > **Actions**。
3. 點擊 **New repository secret**，依序新增以下環境變數 (參考 `.env.example`)：
    - `VITE_GOOGLE_APP_SCRIPT_URL` : 您的 Apps Script Web App 網址
    - `VITE_QUESTION_COUNT` : 題目數量 (例如 `5`)
    - `VITE_PASS_THRESHOLD` : 通過門檻 (例如 `3`)

### 調整路徑 (重要！)
若您的網站並非部署在根目錄 (例如 `https://user.github.io/repo-name/`)，請修改 `vite.config.js`：

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/您的倉庫名稱/', // 例如 '/pixel-game/'
})
```

### 啟動部署
1. 推送程式碼到 `main` 分支。
2. 到 **Actions** 分頁查看部署進度。
3. 部署完成後，到 **Settings** > **Pages** 確認網址。

