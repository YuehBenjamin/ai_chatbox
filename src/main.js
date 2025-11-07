import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { initAIConfig } from './config/ai.config'

// 初始化 AI 配置
initAIConfig()

createApp(App).mount('#app')
