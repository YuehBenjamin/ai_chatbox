# 整合到小組專案指南

這份文件說明如何將 AI 聊天框整合到現有專案中。

## 📦 核心組件清單

### 必要檔案（一定要整合）

#### 1. 前端組件
```
src/components/AIChatbox.vue          ← 聊天框主組件
```

#### 2. AI 服務層
```
src/services/aiService.js             ← AI API 抽象層（支援多種 AI）
src/config/ai.config.js               ← AI 配置（需要修改）
```

### 可選檔案（參考用）

```
src/App.vue                            ← 範例使用方式
src/assets/main.css                    ← 基本樣式
```

### 文件檔案（不需要整合）

```
README.md
AI_SETUP.md
INTEGRATION_GUIDE.md                   ← 這個檔案
```

---

## 🔧 整合步驟

### 步驟 1：複製核心檔案

將以下檔案複製到小組專案：

```bash
# 從這個專案複製到小組專案
cp src/components/AIChatbox.vue [小組專案]/src/components/
cp src/services/aiService.js [小組專案]/src/services/
cp src/config/ai.config.js [小組專案]/src/config/
```

### 步驟 2：在小組專案中使用

在任何 Vue 組件中：

```vue
<template>
  <div>
    <!-- 你們的其他內容 -->

    <!-- AI 聊天框 -->
    <AIChatbox />
  </div>
</template>

<script setup>
import AIChatbox from '@/components/AIChatbox.vue'
</script>
```

---

## ⚙️ 配置說明

### 必須修改的設定

#### `src/config/ai.config.js`

**目前的測試配置：**
```javascript
// Google Gemini (目前使用)
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  model: 'gemini-pro'
})
```

**整合到小組專案時的選項：**

##### 選項 A：使用小組的 AI 後端
```javascript
setAIProvider(AI_PROVIDERS.CUSTOM, {
  endpoint: 'https://your-team-backend.com/api/chat',
  apiKey: 'your-team-api-key'  // 如果需要
})
```

##### 選項 B：使用公開 AI 服務
```javascript
// OpenAI
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: process.env.VITE_OPENAI_KEY,
  model: 'gpt-3.5-turbo'
})

// 或 Gemini（免費額度）
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: process.env.VITE_GEMINI_KEY,
  model: 'gemini-pro'
})
```

---

## 🔐 環境變數設定

### 創建 `.env` 檔案

在小組專案根目錄：

```bash
# .env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=your-api-key-here
VITE_AI_MODEL=gpt-3.5-turbo
```

### 更新 `.gitignore`

確保不會上傳敏感資訊：

```gitignore
# AI 配置
.env
.env.local
.env.*.local
/src/config/ai.config.local.js
```

### 使用環境變數

在 `src/config/ai.config.js`：

```javascript
export function initAIConfig() {
  const provider = import.meta.env.VITE_AI_PROVIDER || 'mock'
  const apiKey = import.meta.env.VITE_AI_API_KEY
  const model = import.meta.env.VITE_AI_MODEL

  if (provider === 'openai' && apiKey) {
    setAIProvider(AI_PROVIDERS.OPENAI, { apiKey, model })
  } else if (provider === 'gemini' && apiKey) {
    setAIProvider(AI_PROVIDERS.GEMINI, { apiKey, model })
  } else {
    // 預設使用模擬模式
    setAIProvider(AI_PROVIDERS.MOCK)
  }
}
```

---

## 📝 團隊協作建議

### 1. 標記測試程式碼

在開發時標記你的測試程式碼：

```javascript
// TODO: [你的名字] 整合時需要更新 AI endpoint
// FIXME: 改用小組的 AI 後端
```

### 2. 分支策略

```bash
# 在自己的分支開發
git checkout -b feature/ai-chatbox

# 測試完成後
git add .
git commit -m "feat: 添加 AI 聊天框功能"

# 合併前先 pull 最新程式碼
git checkout main
git pull
git checkout feature/ai-chatbox
git merge main

# 解決衝突後推送
git push origin feature/ai-chatbox
```

### 3. Pull Request 檢查清單

提交 PR 前確認：

- [ ] 移除個人的 API Keys
- [ ] 更新為環境變數
- [ ] 測試在模擬模式下可運行
- [ ] 添加使用文件
- [ ] 更新 `.gitignore`
- [ ] 程式碼註解清楚
- [ ] 移除 console.log 除錯訊息

---

## 🎨 樣式整合

### 方式 A：獨立樣式（推薦）

聊天框已經是 scoped style，不會影響其他組件。

### 方式 B：使用小組的設計系統

如果小組有設計系統（如 Tailwind、Vuetify），可以修改：

```vue
<!-- 將 AIChatbox.vue 的樣式改成 Tailwind -->
<div class="max-w-3xl mx-auto h-[600px] flex flex-col rounded-xl shadow-lg">
  <!-- ... -->
</div>
```

### 方式 C：主題變數

使用 CSS 變數讓團隊可以自訂：

```css
.chatbox-container {
  --primary-color: var(--team-primary, #667eea);
  --bg-color: var(--team-bg, #f8f9fa);
  /* ... */
}
```

---

## 🧪 測試建議

### 單元測試範例

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AIChatbox from '@/components/AIChatbox.vue'

describe('AIChatbox', () => {
  it('renders properly', () => {
    const wrapper = mount(AIChatbox)
    expect(wrapper.find('.chatbox-container').exists()).toBe(true)
  })

  it('sends message on button click', async () => {
    const wrapper = mount(AIChatbox)
    const input = wrapper.find('input')
    await input.setValue('測試訊息')
    await wrapper.find('button').trigger('click')
    // 驗證訊息被添加
  })
})
```

---

## 📚 文件整合

### 在小組專案的 README 添加

```markdown
## AI 聊天功能

本專案整合了 AI 聊天框功能。

### 快速開始

1. 設定環境變數：
```bash
cp .env.example .env
# 編輯 .env 填入你的 API Key
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 使用聊天框：
在任何頁面引入 `<AIChatbox />` 組件即可。

### 配置

查看 `src/config/ai.config.js` 了解支援的 AI 服務。

目前支援：
- OpenAI GPT
- Google Gemini
- Anthropic Claude
- 自定義 API

---

## 🔄 版本控制建議

### `.gitignore` 必須包含

```gitignore
# 環境變數
.env
.env.local
.env.*.local

# AI 配置
/src/config/ai.config.local.js

# 測試用的 API keys
**/secrets/
**/keys/

# Tunnel配置
cloudflared.yml
```

### 提交範例

```bash
# 好的提交
git commit -m "feat: 添加 AI 聊天框組件"
git commit -m "refactor: 將 AI 配置改為環境變數"
git commit -m "docs: 添加 AI 聊天框使用文件"

# 避免
git commit -m "test"  # 訊息不清楚
git commit -m "add my api key"  # 不要提交 key！
```

---

## 🚨 常見問題

### Q1: 如何在小組專案中測試？

**A:** 使用模擬模式：
```javascript
setAIProvider(AI_PROVIDERS.MOCK)
```
不需要任何 API Key 就能測試 UI。

### Q2: 團隊成員沒有 API Key 怎麼辦？

**A:** 三種方式：
1. 統一使用一個團隊帳號的 key（放在環境變數）
2. 使用免費服務（Gemini 有免費額度）
3. 開發時用模擬模式，只在演示時用真實 AI

### Q3: 如何避免 API 費用過高？

**A:**
1. 設定使用限制
2. 使用較便宜的模型（gpt-3.5 而非 gpt-4）
3. 添加速率限制
4. 監控使用量

### Q4: 合併時有衝突怎麼辦？

**A:**
```bash
# 保持你的版本
git checkout --ours [檔案]

# 保持他們的版本
git checkout --theirs [檔案]

# 手動解決
# 編輯檔案，保留需要的部分
git add [檔案]
git commit
```

---

## ✅ 整合前檢查清單

在提交給團隊前確認：

### 程式碼
- [ ] 移除所有個人 API Keys
- [ ] 改用環境變數或配置檔案
- [ ] 測試在模擬模式下可運行
- [ ] 程式碼有適當的註解
- [ ] 移除 console.log 和除錯程式碼
- [ ] 符合團隊的程式碼風格

### 文件
- [ ] 更新 README
- [ ] 添加使用範例
- [ ] 說明如何設定
- [ ] 列出支援的 AI 服務

### 配置
- [ ] 更新 `.gitignore`
- [ ] 提供 `.env.example`
- [ ] 說明環境變數

### 測試
- [ ] 本地測試通過
- [ ] 模擬模式可用
- [ ] 多個 AI 服務都測試過

---

## 📞 需要幫助？

整合時如果遇到問題：

1. 查看 `AI_SETUP.md` - 各種 AI 服務的設定
2. 查看 `aiService.js` - 了解 API 抽象層
3. 查看 `AIChatbox.vue` - 了解組件用法

---

## 🎯 總結

### 最少需要的檔案：
1. `AIChatbox.vue` - 聊天框組件
2. `aiService.js` - AI 服務層
3. `ai.config.js` - 配置（記得修改）

### 建議的整合方式：
1. 先用模擬模式測試 UI
2. 再接入團隊的 AI 後端
3. 或使用免費的 AI 服務

### 記得：
- ✅ 不要提交 API Keys
- ✅ 使用環境變數
- ✅ 添加清楚的文件
- ✅ 測試後再合併

祝整合順利！🚀
