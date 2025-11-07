<!--
  AI 聊天框組件

  功能：
  - 支援多種 AI 服務（OpenAI, Claude, Gemini, Ollama 等）
  - 顯示對話歷史
  - 打字動畫效果
  - 自動滾動到最新訊息
  - 清除對話功能

  使用方式：
  <AIChatbox />

  配置：
  在 src/config/ai.config.js 設定 AI 服務

  整合注意：
  - 需要先引入 aiService.js
  - 可自訂樣式（scoped style 不會影響其他組件）
  - 支援手機和桌面
-->
<template>
  <div class="chatbox-container">
    <div class="chatbox-header">
      <h3>AI 助手</h3>
      <button @click="clearChat" class="clear-btn">清除對話</button>
    </div>

    <div class="chatbox-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-avatar">
          {{ message.role === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="message-content">
          <div
            class="message-text"
            v-html="message.role === 'assistant' ? renderMarkdown(message.content) : message.content"
          ></div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>

      <div v-if="isTyping" class="message assistant">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chatbox-input">
      <textarea
        ref="textareaRef"
        v-model="userInput"
        @keydown="handleKeyDown"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        placeholder="輸入訊息... (Enter 發送，Shift + Enter 換行)"
        :disabled="isTyping"
        rows="1"
      />
      <button @click="sendMessage" :disabled="!userInput.trim() || isTyping">
        發送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { sendMessage as sendToAI, getCurrentProvider, isConfigured } from '../services/aiService'
import { marked } from 'marked'

// 配置 marked
marked.setOptions({
  breaks: false,  // 不要將單行換行視為 <br>
  gfm: true       // 支援 GitHub Flavored Markdown
})

const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是台中旅遊助手，有什麼可以幫助你的嗎？',
    time: getCurrentTime()
  }
])
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref(null)
const errorMessage = ref('')
const textareaRef = ref(null)
const isComposing = ref(false)

function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function renderMarkdown(content) {
  return marked.parse(content)
}

function handleCompositionStart() {
  isComposing.value = true
}

function handleCompositionEnd() {
  isComposing.value = false
}

function handleKeyDown(event) {
  // Shift+Enter 換行（預設行為）
  if (event.key === 'Enter' && event.shiftKey) {
    return // 允許換行
  }

  // 純 Enter：只有在沒有組字狀態時才發送
  if (event.key === 'Enter' && !event.shiftKey && !isComposing.value) {
    event.preventDefault()
    sendMessage()
  }
  // 如果正在組字（有底線），Enter 用於確認選字，不發送訊息
}

async function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return

  // 清除錯誤訊息
  errorMessage.value = ''

  // 添加用戶訊息
  messages.value.push({
    role: 'user',
    content: userInput.value,
    time: getCurrentTime()
  })

  const userMessage = userInput.value
  userInput.value = ''

  // 重新聚焦到輸入框
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.focus()
  }

  // 滾動到底部
  scrollToBottom()

  // 顯示打字指示器
  isTyping.value = true

  try {
    // 呼叫 AI 服務
    const response = await sendToAI(userMessage, messages.value)

    messages.value.push({
      role: 'assistant',
      content: response,
      time: getCurrentTime()
    })
  } catch (error) {
    console.error('AI 回應失敗:', error)

    // 顯示錯誤訊息
    messages.value.push({
      role: 'assistant',
      content: `抱歉，發生了一些錯誤：${error.message}。請檢查你的 API 設定。`,
      time: getCurrentTime()
    })
    errorMessage.value = error.message
  } finally {
    isTyping.value = false
    await nextTick()
    scrollToBottom()

    // AI 回應完成後，重新聚焦到輸入框
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  }
}

function clearChat() {
  messages.value = [
    {
      role: 'assistant',
      content: '對話已清除。有什麼新的問題嗎？',
      time: getCurrentTime()
    }
  ]
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 顯示當前 AI 服務狀態
function logAIStatus() {
  const provider = getCurrentProvider()
  console.log('當前 AI 服務:', provider)
  console.log('配置狀態:', isConfigured() ? '已配置' : '未配置（使用模擬模式）')
}

// 組件載入時顯示狀態
logAIStatus()
</script>

<style scoped>
.chatbox-container {
  max-width: 800px;
  margin: 0 auto;
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chatbox-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chatbox-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.clear-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chatbox-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message.user .message-avatar {
  margin-left: 12px;
}

.message.assistant .message-avatar {
  margin-right: 12px;
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 14px 18px;
  border-radius: 12px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.message.user .message-text {
  background: #2c3e50;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-text {
  background: white;
  color: #2c3e50;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 400;
}

/* Markdown 樣式 */
.message.assistant .message-text :deep(p) {
  margin: 0.3em 0;
}

.message.assistant .message-text :deep(p:first-child) {
  margin-top: 0;
}

.message.assistant .message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message.assistant .message-text :deep(strong) {
  font-weight: 600;
  color: #1a252f;
}

.message.assistant .message-text :deep(em) {
  font-style: italic;
}

.message.assistant .message-text :deep(code) {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e74c3c;
}

.message.assistant .message-text :deep(pre) {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.8em 0;
}

.message.assistant .message-text :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 13px;
}

.message.assistant .message-text :deep(ul),
.message.assistant .message-text :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message.assistant .message-text :deep(li) {
  margin: 0.2em 0;
}

.message.assistant .message-text :deep(h1),
.message.assistant .message-text :deep(h2),
.message.assistant .message-text :deep(h3),
.message.assistant .message-text :deep(h4) {
  margin: 0.6em 0 0.3em 0;
  font-weight: 600;
  color: #1a252f;
}

.message.assistant .message-text :deep(h1) { font-size: 1.4em; }
.message.assistant .message-text :deep(h2) { font-size: 1.3em; }
.message.assistant .message-text :deep(h3) { font-size: 1.2em; }
.message.assistant .message-text :deep(h4) { font-size: 1.1em; }

.message.assistant .message-text :deep(blockquote) {
  border-left: 4px solid #3498db;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #555;
  font-style: italic;
}

.message.assistant .message-text :deep(a) {
  color: #3498db;
  text-decoration: none;
}

.message.assistant .message-text :deep(a:hover) {
  text-decoration: underline;
}

.message.assistant .message-text :deep(hr) {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 1em 0;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chatbox-input {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}

.chatbox-input textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
}

.chatbox-input textarea:focus {
  border-color: #3498db;
}

.chatbox-input textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.chatbox-input button {
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s, opacity 0.3s, background 0.3s;
}

.chatbox-input button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #2980b9;
}

.chatbox-input button:active:not(:disabled) {
  transform: translateY(0);
}

.chatbox-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
