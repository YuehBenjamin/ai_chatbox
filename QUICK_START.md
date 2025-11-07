# 快速開始

## 🚀 5 分鐘快速測試

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動（不需要 API Key）
```bash
npm run dev
```

### 3. 訪問
打開 http://localhost:5173/

就可以測試了！（使用模擬模式，不需要真實 AI）

---

## 📁 核心檔案說明

### 你需要關注的檔案：

```
src/
├── components/
│   └── AIChatbox.vue          ← 聊天框組件（複製這個到你的專案）
├── services/
│   └── aiService.js           ← AI 服務層（複製這個）
└── config/
    └── ai.config.js           ← 配置檔案（需要修改）
```

### 可以忽略的檔案：
- 所有 `.md` 文件（只是說明文件）
- `src/App.vue`（只是範例）

---

## 🔧 如何在你的專案中使用

### 1. 複製檔案
```bash
# 複製這三個檔案到你的專案
cp src/components/AIChatbox.vue [你的專案]/src/components/
cp src/services/aiService.js [你的專案]/src/services/
cp src/config/ai.config.js [你的專案]/src/config/
```

### 2. 在你的頁面中使用
```vue
<template>
  <div>
    <h1>我的專案</h1>

    <!-- 加入聊天框 -->
    <AIChatbox />
  </div>
</template>

<script setup>
import AIChatbox from '@/components/AIChatbox.vue'
</script>
```

### 3. 設定 AI（可選）

如果你有 API Key，編輯 `ai.config.js`：

```javascript
// 使用 Gemini（免費）
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: 'your-key',
  model: 'gemini-pro'
})

// 或使用 OpenAI
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: 'your-key',
  model: 'gpt-3.5-turbo'
})
```

沒有 API Key？沒關係！預設會使用模擬模式。

---

## 🎯 常見情況

### 情況 1：只想測試 UI
→ 不需要改任何東西，直接 `npm run dev` 就能測試

### 情況 2：要接入小組的 AI 後端
在 `ai.config.js` 中：
```javascript
setAIProvider(AI_PROVIDERS.CUSTOM, {
  endpoint: 'https://your-team-backend.com/api/chat'
})
```

### 情況 3：要用免費的 AI
1. 去 https://makersuite.google.com/app/apikey 申請 Gemini key（免費）
2. 在 `ai.config.js` 設定：
```javascript
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: 'your-gemini-key',
  model: 'gemini-pro'
})
```

---

## ⚠️ 重要提醒

### ❌ 不要做的事：
1. **不要把 API Key 提交到 Git**
2. 不要修改 `aiService.js`（除非你知道在做什麼）
3. 不要刪除模擬模式（讓沒有 key 的人也能測試）

### ✅ 應該做的事：
1. **先測試模擬模式**
2. 有問題看 `INTEGRATION_GUIDE.md`
3. 整合前先在自己的分支測試

---

## 🐛 遇到問題？

### 問題：無法啟動
```bash
# 解決：重新安裝
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 問題：API 錯誤
→ 檢查 `ai.config.js` 的設定
→ 或改用模擬模式測試

---

## 📚 更多資訊

- `INTEGRATION_GUIDE.md` - 詳細的整合指南
- `AI_SETUP.md` - 各種 AI 服務的設定方式

---

**就這麼簡單！有問題隨時問。** 🚀
