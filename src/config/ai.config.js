/**
 * AI 配置文件
 *
 * 使用方式：
 * 1. 複製此檔案為 ai.config.local.js（已加入 .gitignore，不會上傳到 Git）
 * 2. 在 ai.config.local.js 中填入你的 API Key
 * 3. 取消註解你想使用的 AI 服務
 */

import { setAIProvider, AI_PROVIDERS } from '../services/aiService'

/**
 * 初始化 AI 配置
 * 在應用啟動時呼叫此函數
 */
export function initAIConfig() {
  // ==========================================
  // 選擇你要使用的 AI 服務（取消下面其中一行的註解）
  // ==========================================

  // 1. 模擬模式（預設，用於測試）
  // setAIProvider(AI_PROVIDERS.MOCK)

  // Google Gemini（使用 AI Studio API）
  setAIProvider(AI_PROVIDERS.GEMINI, {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro'
  })

  console.log('✅ AI 配置已載入')
}

/**
 * 從環境變數載入配置（適用於生產環境）
 */
export function initAIConfigFromEnv() {
  const provider = import.meta.env.VITE_AI_PROVIDER
  const apiKey = import.meta.env.VITE_AI_API_KEY
  const model = import.meta.env.VITE_AI_MODEL
  const endpoint = import.meta.env.VITE_AI_ENDPOINT

  if (provider && apiKey) {
    setAIProvider(provider, { apiKey, model, endpoint })
    console.log(`✅ AI 配置已從環境變數載入: ${provider}`)
  } else {
    console.log('⚠️ 未找到環境變數配置，使用預設設定')
    initAIConfig()
  }
}
