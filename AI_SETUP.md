# AI 設定指南

這個聊天框支援多種 AI 服務，你可以根據需求選擇合適的服務。

## 🚀 快速開始

目前使用**模擬模式**，可以正常運行但回應是假的。要接入真實 AI，請按照下面的步驟操作。

## 📋 支援的 AI 服務

| 服務 | 特點 | 價格 | 推薦程度 |
|------|------|------|---------|
| **OpenAI GPT** | 最流行，回應品質高 | 中等 | ⭐⭐⭐⭐⭐ |
| **Anthropic Claude** | 安全性高，長文本處理好 | 中等 | ⭐⭐⭐⭐⭐ |
| **Google Gemini** | 免費額度大，速度快 | 免費/低 | ⭐⭐⭐⭐ |
| **自定義 API** | 自己架設或第三方 | 自定義 | ⭐⭐⭐ |

## 🔧 設定方式

### 方式一：修改配置文件（推薦用於開發）

1. 開啟 `src/config/ai.config.js`
2. 找到你想使用的 AI 服務，取消註解並填入 API Key：

```javascript
// 例如使用 OpenAI
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: 'sk-your-api-key-here',
  model: 'gpt-3.5-turbo'
})
```

3. 儲存檔案，重新啟動開發伺服器

### 方式二：使用環境變數（推薦用於生產環境）

1. 複製 `.env.example` 為 `.env`：
```bash
cp .env.example .env
```

2. 編輯 `.env` 檔案：
```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-your-api-key-here
VITE_AI_MODEL=gpt-3.5-turbo
```

3. 修改 `src/main.js`，使用環境變數初始化：
```javascript
import { initAIConfigFromEnv } from './config/ai.config'
initAIConfigFromEnv() // 改用這個
```

## 🔑 如何獲取 API Key

### OpenAI
1. 前往 https://platform.openai.com/api-keys
2. 註冊/登入帳號
3. 點擊 "Create new secret key"
4. 複製 key（格式：sk-...）

**費用**：按使用量計費，$0.0015/1K tokens（GPT-3.5）

### Anthropic Claude
1. 前往 https://console.anthropic.com/
2. 註冊/登入帳號
3. 到 "API Keys" 頁面建立 key
4. 複製 key

**費用**：按使用量計費，$0.25/1M tokens（Haiku）

### Google Gemini
1. 前往 https://makersuite.google.com/app/apikey
2. 登入 Google 帳號
3. 點擊 "Create API Key"
4. 複製 key

**費用**：每月 60 次/分鐘免費額度

## 📝 配置範例

### OpenAI (GPT-3.5)
```javascript
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: 'sk-proj-...',
  model: 'gpt-3.5-turbo'
})
```

### OpenAI (GPT-4)
```javascript
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: 'sk-proj-...',
  model: 'gpt-4-turbo'
})
```

### Anthropic Claude (便宜快速)
```javascript
setAIProvider(AI_PROVIDERS.ANTHROPIC, {
  apiKey: 'sk-ant-...',
  model: 'claude-3-haiku-20240307'
})
```

### Anthropic Claude (高品質)
```javascript
setAIProvider(AI_PROVIDERS.ANTHROPIC, {
  apiKey: 'sk-ant-...',
  model: 'claude-3-opus-20240229'
})
```

### Google Gemini
```javascript
setAIProvider(AI_PROVIDERS.GEMINI, {
  apiKey: 'AIza...',
  model: 'gemini-pro'
})
```

### 自定義 API
```javascript
setAIProvider(AI_PROVIDERS.CUSTOM, {
  endpoint: 'https://your-api.com/chat',
  apiKey: 'your-key'  // 可選
})
```

## 🛠️ 進階設定

### 動態切換 AI 服務

可以在應用中動態切換：

```javascript
import { setAIProvider, AI_PROVIDERS } from './services/aiService'

// 切換到 Claude
setAIProvider(AI_PROVIDERS.ANTHROPIC, {
  apiKey: 'your-key',
  model: 'claude-3-sonnet-20240229'
})
```

### 檢查配置狀態

```javascript
import { getCurrentProvider, isConfigured } from './services/aiService'

console.log(getCurrentProvider())
console.log(isConfigured())
```

## ⚠️ 注意事項

1. **不要把 API Key 提交到 Git**
   - `.env` 和 `ai.config.local.js` 已加入 `.gitignore`
   - 如果要分享程式碼，記得移除 key

2. **API 費用**
   - OpenAI 和 Claude 按使用量計費
   - Gemini 有免費額度但有速率限制
   - 建議在 API 控制台設定使用上限

3. **跨域問題（CORS）**
   - 直接從瀏覽器呼叫 AI API 可能遇到 CORS 問題
   - 生產環境建議透過後端代理
   - 或使用 Vite 的 proxy 功能（開發環境）

4. **安全性**
   - API Key 應該儲存在伺服器端
   - 前端使用 API Key 會暴露給使用者
   - 考慮建立後端 API 來中轉請求

## 🔍 測試

設定完成後：

1. 啟動開發伺服器：`npm run dev`
2. 開啟瀏覽器控制台查看：
   ```
   ✅ AI 配置已載入
   當前 AI 服務: { provider: 'openai', config: {...} }
   ```
3. 在聊天框輸入訊息測試

## 🐛 常見問題

### 錯誤：請先設定 API Key
- 檢查是否正確設定 API Key
- 確認 key 格式正確（OpenAI: sk-..., Claude: sk-ant-...）

### 錯誤：API 錯誤 401
- API Key 無效或過期
- 重新生成新的 key

### 錯誤：API 錯誤 429
- 超過速率限制
- 等待一段時間或升級方案

### 沒有回應
- 檢查瀏覽器控制台的錯誤訊息
- 確認網路連線正常
- 檢查 API 餘額是否充足

## 📚 延伸閱讀

- [OpenAI API 文件](https://platform.openai.com/docs)
- [Anthropic API 文件](https://docs.anthropic.com/)
- [Google Gemini API 文件](https://ai.google.dev/docs)

---

有問題嗎？查看 `src/services/aiService.js` 的程式碼註解了解更多細節。
