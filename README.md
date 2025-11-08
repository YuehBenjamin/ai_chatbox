# AI Chatbox - 台中旅遊助手

一個基於 Vue 3 的智能聊天框組件，專門提供台中市的景點、美食和 Ubike 資訊。

## ✨ 特色

- 🎨 現代化的聊天 UI 介面
- 🤖 支援多種 AI 服務（Gemini、OpenAI、Anthropic、自定義 API）
- 📝 Markdown 格式回應渲染
- 💬 對話歷史記錄
- 🔄 即時打字指示器
- 📱 響應式設計
- 🎯 **台中旅遊專屬**：只回答台中相關的景點、美食、Ubike 問題
- 🗄️ 資料庫整合架構（目前使用模擬資料）

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定 API Key

複製環境變數範例文件：
```bash
cp .env.example .env
```

編輯 `.env` 文件，填入你的 Gemini API Key：
```env
VITE_GEMINI_API_KEY=your-api-key-here
VITE_GEMINI_MODEL=gemini-2.5-flash
```

取得免費 Gemini API Key：https://makersuite.google.com/app/apikey

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 http://localhost:5173

### 4. 構建生產版本

```bash
npm run build
```

預覽生產版本：
```bash
npm run preview
```

---

## 📁 專案結構

```
ai_chatbox/
├── src/
│   ├── components/
│   │   └── AIChatbox.vue          # 聊天框主組件
│   ├── services/
│   │   ├── aiService.js           # AI 服務層（整合多種 AI）
│   │   └── databaseService.js     # 資料庫服務層（目前使用模擬資料）
│   ├── config/
│   │   ├── ai.config.js           # AI 配置
│   │   └── system.config.js       # 系統配置（AI 行為、範圍限制）
│   ├── assets/
│   │   └── main.css               # 全域樣式
│   ├── App.vue                    # 主應用組件
│   └── main.js                    # 應用入口
├── public/                         # 靜態資源
├── .env                           # 環境變數（不提交到 Git）
├── .env.example                   # 環境變數範本
├── package.json                   # 依賴管理
└── vite.config.js                 # Vite 配置
```

---

## 🎯 核心功能

### 1. 台中旅遊範圍限制

AI 助手只回答台中相關的問題，包括：
- 🏛️ **打卡景點**：逢甲夜市、高美濕地、彩虹眷村、國家歌劇院等
- 🍜 **打卡美食**：宮原眼科、第四信用合作社、台中特色小吃等
- 🚲 **Ubike 站點**：即時查詢 Ubike 停靠站、可借車輛、可還空位

**超出範圍的問題會被禮貌拒絕**，例如：
- 其他城市的旅遊問題
- 住宿建議
- 活動資訊

### 2. 資料庫整合（前置作業已完成）

系統已建立資料庫查詢架構，目前使用模擬資料：
- 自動偵測 Ubike 相關問題
- 查詢並格式化站點資料
- 結合 AI 生成自然語言回應

**模擬的 Ubike 站點：**
- 台中火車站
- 逢甲大學
- 一中商圈
- 國家歌劇院
- 科博館

### 3. 智能範圍檢查

使用關鍵字和邏輯判斷：
- 台中關鍵字：台中、逢甲、一中、高美、彩虹眷村等
- 非台中關鍵字：台北、高雄、台南、日本、韓國等
- 自動過濾不相關問題

---

## 🤖 支援的 AI 服務

目前支援以下 AI 提供商：

| AI 服務 | 說明 | 適合場景 |
|---------|------|----------|
| **Google Gemini** (預設) | 免費額度大，回應快速 | 開發、測試、小型專案 |
| **OpenAI GPT** | GPT-3.5、GPT-4 | 需要高品質回應 |
| **Anthropic Claude** | Claude 3 系列 | 需要長文本理解 |
| **自定義 API** | 自己架設的後端 | 客製化需求 |

詳細設定請參考 [AI_SETUP.md](./AI_SETUP.md)

---

## 🛠️ 技術棧

- **前端框架**：Vue 3 (Composition API)
- **建置工具**：Vite
- **AI 整合**：多提供商抽象層
- **Markdown 渲染**：Marked
- **樣式**：Scoped CSS

---

## 📚 文檔

| 文件 | 說明 |
|------|------|
| [AI_SETUP.md](./AI_SETUP.md) | AI 服務設定指南（OpenAI、Gemini、Claude） |
| [QUICK_START.md](./QUICK_START.md) | 快速開始指南 |
| [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) | 整合到其他專案的指南 |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | 資料庫整合說明（目前使用模擬資料） |
| [CUSTOMIZATION.md](./CUSTOMIZATION.md) | 自訂與修改指南（可修改的設定檔案） |

---

## 🔧 自訂與配置

### 修改 AI 行為

編輯 `src/config/system.config.js`：
```javascript
export const SYSTEM_PROMPT = `你是台中市打卡景點與美食推薦助手...`
```

可以修改：
- AI 的角色定位
- 回應格式
- 語氣風格
- 範圍限制

### 切換 AI 服務

編輯 `src/config/ai.config.js`：
```javascript
// 使用 Gemini (預設)
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  model: 'gemini-2.5-flash'
})

// 或改用 OpenAI
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo'
})
```

### 連接真實資料庫

編輯 `src/services/databaseService.js`，將模擬資料改為真實查詢。

支援三種方式：
1. MySQL/PostgreSQL 資料庫
2. 政府開放資料 API
3. 自己的後端 API

詳細說明請參考 [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 💡 使用範例

### 基本使用

```vue
<template>
  <div>
    <h1>台中旅遊助手</h1>
    <AIChatbox />
  </div>
</template>

<script setup>
import AIChatbox from '@/components/AIChatbox.vue'
</script>
```

### 測試問題範例

**✅ 會回答的問題：**
- "台中有什麼好拍照的景點？"
- "火車站附近有什麼美食？"
- "逢甲大學的 Ubike 還有車嗎？"
- "台中必吃的小吃有哪些？"

**❌ 不會回答的問題：**
- "台北101怎麼去？" → 會禮貌拒絕
- "台中有推薦的飯店嗎？" → 會引導到景點/美食
- "高雄有什麼好玩的？" → 會說明只服務台中

---

## 🔍 功能展示

### 範圍限制展示

```
使用者：「台北101怎麼去？」
AI：「抱歉，我是台中市旅遊助手，專門提供台中相關的資訊。
     我可以幫您解答：
     - 🏛️ 台中景點推薦
     - 🍜 台中美食介紹
     - 🚲 Ubike 站點查詢

     如果您有任何台中相關的問題，歡迎隨時詢問！」
```

### Ubike 查詢展示

```
使用者：「火車站的 Ubike 還有車嗎？」
AI：「找到 1 個 Ubike 站點：

     **1. 台中火車站**
        📍 地址：台中市中區建國路172號
        🚲 可借：15 輛
        🅿️  可還：25 位
        ℹ️  狀態：營運中

     目前台中火車站的 Ubike 站有 15 輛可借車輛，
     可還空位有 25 個，狀態正常營運中喔！」
```

---

## 🚨 常見問題

### Q1: 如何取得 API Key？

**Google Gemini (免費):**
1. 前往 https://makersuite.google.com/app/apikey
2. 登入 Google 帳號
3. 點擊「Create API Key」
4. 複製 API Key 到 `.env` 文件

**OpenAI (付費):**
- 前往 https://platform.openai.com/api-keys
- 需要信用卡

### Q2: 為什麼 AI 沒有按照設定的範圍回答？

1. 清除對話重新開始
2. 重新整理頁面
3. 檢查 `src/config/system.config.js` 是否正確設定

### Q3: 如何修改 AI 的回應風格？

編輯 `src/config/system.config.js` 中的 `SYSTEM_PROMPT`，
詳細說明請參考 [CUSTOMIZATION.md](./CUSTOMIZATION.md)

### Q4: 資料庫何時會連接？

目前使用模擬資料進行開發，連接真實資料庫的準備工作已完成。
可以參考 [DATABASE_SETUP.md](./DATABASE_SETUP.md) 了解如何連接。

---

## 📦 NPM Scripts

```bash
# 開發模式
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 🛡️ 注意事項

### 安全

- ⚠️ **不要** 將 `.env` 提交到 Git
- ⚠️ **不要** 在程式碼中硬編碼 API Key
- ✅ 使用環境變數管理敏感資訊
- ✅ 將 `.env` 加入 `.gitignore`

### 開發建議

1. **使用模擬模式測試 UI**：不需要 API Key 也能測試介面
2. **清楚的 commit message**：例如 `feat: 新增景點查詢功能`
3. **修改前先建立分支**：避免直接在 main 分支修改
4. **測試後再提交**：確保功能正常運作

---

## 🌟 未來規劃

- [ ] 連接真實 Ubike API
- [ ] 新增景點資料庫查詢
- [ ] 新增餐廳資料庫查詢
- [ ] 支援地圖顯示
- [ ] 支援圖片上傳（Gemini Vision）
- [ ] 多語言支援
- [ ] 語音輸入

---

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

---

## 📄 License

MIT

---

## 👨‍💻 開發工具推薦

- **IDE**: [VS Code](https://code.visualstudio.com/) + [Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- **瀏覽器擴充**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **API 測試**: [Postman](https://www.postman.com/)

---

## 📞 支援

如有問題或建議，歡迎：
- 提交 Issue
- 參考文檔：[CUSTOMIZATION.md](./CUSTOMIZATION.md)
- 查看範例：[QUICK_START.md](./QUICK_START.md)
