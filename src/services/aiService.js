/**
 * AI 服務抽象層
 * 支援多種 AI 提供商的統一介面
 */

import { SYSTEM_PROMPT, isInScope, OUT_OF_SCOPE_MESSAGE } from '../config/system.config.js'
import { queryUbikeStations, formatUbikeStations } from './databaseService.js'

// AI 提供商類型
export const AI_PROVIDERS = {
  MOCK: 'mock',           // 模擬回應（用於測試）
  OPENAI: 'openai',       // OpenAI GPT
  ANTHROPIC: 'anthropic', // Claude
  GEMINI: 'gemini',       // Google Gemini
  CUSTOM: 'custom'        // 自定義 API
}

// 當前使用的提供商（之後可以從配置文件讀取）
let currentProvider = AI_PROVIDERS.MOCK

// API 配置
const apiConfig = {
  openai: {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  },
  anthropic: {
    apiKey: '',
    model: 'claude-3-haiku-20240307',
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  gemini: {
    apiKey: '',
    model: 'gemini-pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  custom: {
    apiKey: '',
    endpoint: ''
  }
}

/**
 * 設定 AI 提供商
 * @param {string} provider - 提供商類型
 * @param {object} config - API 配置（apiKey, model 等）
 */
export function setAIProvider(provider, config = {}) {
  if (!AI_PROVIDERS[provider.toUpperCase()]) {
    console.warn(`未知的提供商: ${provider}，使用 MOCK 模式`)
    currentProvider = AI_PROVIDERS.MOCK
    return
  }

  currentProvider = provider

  // 更新配置
  if (config.apiKey) {
    apiConfig[provider].apiKey = config.apiKey
  }
  if (config.model) {
    apiConfig[provider].model = config.model
  }
  if (config.endpoint) {
    apiConfig[provider].endpoint = config.endpoint
  }
}

/**
 * 發送訊息給 AI
 * @param {string} message - 使用者訊息
 * @param {Array} history - 歷史對話記錄
 * @returns {Promise<string>} AI 回應
 */
export async function sendMessage(message, history = []) {
  // 1. 檢查問題範圍
  if (!isInScope(message)) {
    console.log('❌ 問題超出台中範圍')
    return OUT_OF_SCOPE_MESSAGE
  }

  // 2. 檢查是否需要查詢資料庫
  let databaseContext = ''
  if (needsUbikeData(message)) {
    console.log('🔍 偵測到 Ubike 查詢需求')
    databaseContext = await getUbikeData(message)
  }

  // 3. 組合完整訊息（包含系統提示詞和資料庫資料）
  const enhancedMessage = buildEnhancedMessage(message, databaseContext)

  // 4. 發送給 AI
  switch (currentProvider) {
    case AI_PROVIDERS.OPENAI:
      return await sendToOpenAI(enhancedMessage, history)

    case AI_PROVIDERS.ANTHROPIC:
      return await sendToAnthropic(enhancedMessage, history)

    case AI_PROVIDERS.GEMINI:
      return await sendToGemini(enhancedMessage, history)

    case AI_PROVIDERS.CUSTOM:
      return await sendToCustomAPI(enhancedMessage, history)

    case AI_PROVIDERS.MOCK:
    default:
      return await sendToMock(enhancedMessage, history)
  }
}

/**
 * OpenAI API 實作
 */
async function sendToOpenAI(message, history) {
  const { apiKey, model, endpoint } = apiConfig.openai

  if (!apiKey) {
    throw new Error('請先設定 OpenAI API Key')
  }

  const messages = [
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })),
    { role: 'user', content: message }
  ]

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API 調用失敗:', error)
    throw error
  }
}

/**
 * Anthropic Claude API 實作
 */
async function sendToAnthropic(message, history) {
  const { apiKey, model, endpoint } = apiConfig.anthropic

  if (!apiKey) {
    throw new Error('請先設定 Anthropic API Key')
  }

  const messages = [
    ...history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })),
    { role: 'user', content: message }
  ]

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('Anthropic API 調用失敗:', error)
    throw error
  }
}

/**
 * Google Gemini API 實作
 */
async function sendToGemini(message, history) {
  const { apiKey, model } = apiConfig.gemini

  if (!apiKey) {
    throw new Error('請先設定 Gemini API Key')
  }

  try {
    // 構建對話歷史
    const contents = []

    // 添加歷史對話
    history.forEach(msg => {
      if (msg.role === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        })
      } else if (msg.role === 'assistant') {
        contents.push({
          role: 'model',
          parts: [{ text: msg.content }]
        })
      }
    })

    // 添加當前訊息
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    // 使用 v1beta API 來支援 Google Search grounding
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents,
        // 啟用 Google Search grounding（即時網路搜尋）
        tools: [
          {
            google_search: {}
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Gemini API 錯誤: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini API 沒有返回結果')
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API 調用失敗:', error)
    throw error
  }
}

/**
 * 自定義 API 實作
 */
async function sendToCustomAPI(message, history) {
  const { apiKey, endpoint } = apiConfig.custom

  if (!endpoint) {
    throw new Error('請先設定自定義 API endpoint')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        message,
        history
      })
    })

    if (!response.ok) {
      throw new Error(`自定義 API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    // 假設 API 回應格式為 { response: "..." }
    // 你可以根據實際 API 格式調整
    return data.response || data.message || data.content || JSON.stringify(data)
  } catch (error) {
    console.error('自定義 API 調用失敗:', error)
    throw error
  }
}

/**
 * 模擬 API（用於測試）
 */
async function sendToMock(message, history) {
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  const responses = [
    `我收到你的訊息了：「${message}」。這是一個模擬回應，等你設定好真實的 AI API 後，我就能真正理解並回應你的問題了！`,
    `關於「${message}」，這個問題很有趣！目前我在模擬模式下運行，要獲得真正的 AI 回應，請設定 API Key。`,
    `你說的「${message}」我明白了。提示：目前是測試模式，可以在 aiService.js 中設定 OpenAI、Claude 或 Gemini 的 API。`,
    `收到訊息：${message}。想要更智能的回應嗎？試試設定真實的 AI 服務吧！支援 OpenAI、Anthropic Claude 和 Google Gemini。`
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

/**
 * 獲取當前提供商資訊
 */
export function getCurrentProvider() {
  return {
    provider: currentProvider,
    config: apiConfig[currentProvider]
  }
}

/**
 * 檢查 API 配置是否完整
 */
export function isConfigured() {
  if (currentProvider === AI_PROVIDERS.MOCK) {
    return true
  }

  const config = apiConfig[currentProvider]
  return !!(config && config.apiKey)
}

/**
 * ========================================
 * 輔助函數：資料庫查詢和訊息處理
 * ========================================
 */

/**
 * 檢查是否需要查詢 Ubike 資料
 * @param {string} message - 使用者訊息
 * @returns {boolean}
 */
function needsUbikeData(message) {
  const ubikeKeywords = [
    'ubike', 'youbike', 'u-bike', 'you-bike',
    '自行車', '腳踏車', '單車',
    '借車', '還車', '站點', '停靠站'
  ]

  const lowerMessage = message.toLowerCase()
  return ubikeKeywords.some(keyword =>
    message.includes(keyword) || lowerMessage.includes(keyword)
  )
}

/**
 * 查詢 Ubike 資料
 * @param {string} message - 使用者訊息
 * @returns {Promise<string>} 格式化的 Ubike 資料
 */
async function getUbikeData(message) {
  try {
    // 嘗試從訊息中提取站點名稱
    const stationName = extractStationName(message)

    // 查詢資料庫
    const stations = await queryUbikeStations(stationName, stationName ? 5 : 10)

    if (stations.length === 0) {
      return '\n\n【資料庫查詢結果】\n找不到相關的 Ubike 站點資料。\n'
    }

    // 格式化資料
    const formattedData = formatUbikeStations(stations)
    return `\n\n【資料庫查詢結果 - 即時 Ubike 資料】\n${formattedData}\n請根據以上即時資料回答使用者的問題。\n`
  } catch (error) {
    console.error('查詢 Ubike 資料失敗:', error)
    return '\n\n【資料庫查詢失敗】\n抱歉，目前無法查詢 Ubike 資料，請稍後再試。\n'
  }
}

/**
 * 從訊息中提取站點名稱
 * @param {string} message - 使用者訊息
 * @returns {string|null} 站點名稱
 */
function extractStationName(message) {
  // 常見站點關鍵字
  const stations = [
    '火車站', '台中火車站', '台中車站',
    '逢甲', '逢甲大學',
    '一中', '一中街', '一中商圈',
    '歌劇院', '國家歌劇院',
    '科博館', '自然科學博物館',
    '美術館', '國美館',
    '高美濕地', '審計新村', '彩虹眷村'
  ]

  for (const station of stations) {
    if (message.includes(station)) {
      return station
    }
  }

  // 如果訊息中有「站」字，嘗試提取站名
  const stationMatch = message.match(/([^\s，。！？]{2,8})[站點]/);
  if (stationMatch) {
    return stationMatch[1]
  }

  return null
}

/**
 * 組合增強訊息（系統提示詞 + 資料庫資料 + 使用者問題）
 * @param {string} message - 使用者訊息
 * @param {string} databaseContext - 資料庫查詢結果
 * @returns {string} 增強後的訊息
 */
function buildEnhancedMessage(message, databaseContext = '') {
  let enhancedMessage = SYSTEM_PROMPT + '\n\n'

  if (databaseContext) {
    enhancedMessage += databaseContext
  }

  enhancedMessage += `\n【使用者問題】\n${message}`

  return enhancedMessage
}
