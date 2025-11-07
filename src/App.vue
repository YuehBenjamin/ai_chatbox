<script setup>
import AIChatbox from './components/AIChatbox.vue'
</script>

<template>
  <div class="app-container">
    <h1>AI 聊天助手</h1>
    <p class="subtitle">體驗智能對話的魅力</p>
    <AIChatbox />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%);
}

h1 {
  text-align: center;
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  text-align: center;
  color: #34495e;
  font-size: 1.1em;
  margin-bottom: 30px;
}
</style>
