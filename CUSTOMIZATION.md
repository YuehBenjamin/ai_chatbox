# 自訂與修改指南

本文件說明專案中可以手動修改的設定檔案，以及如何根據需求進行自訂。

---

## 📝 可修改的設定檔案

### 1. 系統配置 - `src/config/system.config.js`

**用途：** 定義 AI 助手的行為、範圍和回應風格

**可修改的內容：**

#### 1.1 系統提示詞 (SYSTEM_PROMPT)
```javascript
export const SYSTEM_PROMPT = `你是台中市打卡景點與美食推薦助手...`
```

**可以修改：**
- AI 的角色定位（例如：改成其他城市的旅遊助手）
- 職責範圍（增加或減少服務項目）
- 回應格式要求
- 語氣風格（友善、專業、活潑等）
- 範例對話

**修改範例：**
```javascript
// 改成台北旅遊助手
export const SYSTEM_PROMPT = `你是台北市旅遊助手，專門協助使用者探索台北的熱門景點和美食。

【你的職責】
1. 推薦台北市的熱門景點
2. 推薦台北市的特色美食
3. 提供 YouBike 站點資訊
...`
```

#### 1.2 關鍵字列表
```javascript
export const TAICHUNG_KEYWORDS = [
  '台中', '臺中',
  '逢甲', '一中', '高美', '彩虹眷村', ...
]

export const OUT_OF_SCOPE_KEYWORDS = [
  '台北', '臺北', '高雄', '台南', ...
]
```

**可以修改：**
- 新增或移除地點關鍵字
- 調整範圍檢查的敏感度

**修改時機：**
- 新增熱門景點時
- 改變服務範圍時
- 需要更精確的範圍判斷時

#### 1.3 範圍外訊息 (OUT_OF_SCOPE_MESSAGE)
```javascript
export const OUT_OF_SCOPE_MESSAGE = `抱歉，我是台中市旅遊助手...`
```

**可以修改：**
- 客製化拒絕訊息
- 調整語氣
- 提供替代建議

---

### 2. AI 配置 - `src/config/ai.config.js`

**用途：** 設定使用的 AI 服務提供商

**可修改的內容：**

```javascript
export function initAIConfig() {
  // 選擇要使用的 AI 服務
  setAIProvider(AI_PROVIDERS.GEMINI, {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro'
  })
}
```

**可以修改：**
- 切換 AI 提供商（GEMINI, OPENAI, ANTHROPIC, CUSTOM）
- 調整模型（例如：gemini-pro → gemini-pro-vision）
- 設定額外參數

**修改範例：**
```javascript
// 改用 OpenAI
setAIProvider(AI_PROVIDERS.OPENAI, {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4'
})

// 改用自訂 API
setAIProvider(AI_PROVIDERS.CUSTOM, {
  endpoint: 'https://your-api.com/chat',
  apiKey: 'your-api-key'
})
```

---

### 3. 資料庫服務 - `src/services/databaseService.js`

**用途：** 查詢旅遊相關資料（目前使用模擬資料）

**可修改的內容：**

#### 3.1 資料庫連接設定
```javascript
const DB_CONFIG = {
  // 資料庫連接資訊（待填入）
  // host: 'localhost',
  // port: 3306,
  // database: 'taichung_tourism',
  // user: 'your-username',
  // password: 'your-password'
}
```

#### 3.2 模擬資料
```javascript
function getMockUbikeData() {
  return [
    {
      id: 1,
      name: '台中火車站',
      address: '台中市中區建國路172號',
      available_bikes: 15,
      available_spaces: 25,
      // ...
    }
  ]
}
```

**可以修改：**
- 新增或修改模擬站點
- 調整站點資料
- 新增其他資料表（景點、餐廳等）

**何時修改：**
- 測試特定站點時
- 增加更多測試資料時
- 準備連接真實資料庫前

---

### 4. 環境變數 - `.env`

**用途：** 儲存敏感資訊和配置

**可修改的內容：**

```env
# Google AI Studio (Gemini) 設定
VITE_GEMINI_API_KEY=your-api-key
VITE_GEMINI_MODEL=gemini-2.5-flash

# 其他 AI 服務（可選）
# VITE_OPENAI_API_KEY=your-openai-key
# VITE_ANTHROPIC_API_KEY=your-claude-key
```

**可以修改：**
- API Keys
- 模型版本
- 其他環境變數

**注意事項：**
- ⚠️ **絕對不要** 將 `.env` 提交到 Git
- 使用 `.env.example` 作為範本
- 團隊成員各自使用自己的 API Key

---

### 5. 聊天框組件 - `src/components/AIChatbox.vue`

**用途：** 聊天框的 UI 和互動邏輯

**可修改的內容：**

#### 5.1 初始訊息
```javascript
const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是台中旅遊助手，有什麼可以幫助你的嗎？',
    time: getCurrentTime()
  }
])
```

#### 5.2 樣式設定
```css
.chatbox-container {
  max-width: 800px;
  height: 600px;
  /* 可調整寬度和高度 */
}

.message-text {
  line-height: 1.6;
  font-size: 15px;
  /* 可調整行高和字體大小 */
}
```

**可以修改：**
- 歡迎訊息
- 聊天框大小
- 顏色主題
- 字體樣式
- 動畫效果
- 按鈕文字

---

## 🗄️ 資料庫連接說明

### 目前狀態

專案目前使用 **模擬資料** 進行開發，所有資料庫相關的程式碼都在 `src/services/databaseService.js` 中。

### 連接真實資料庫的步驟

#### 方式一：使用 MySQL/PostgreSQL

1. **安裝資料庫驅動**
```bash
npm install mysql2
# 或
npm install pg
```

2. **修改 `databaseService.js`**
```javascript
import mysql from 'mysql2/promise'

// 建立連接池
const pool = mysql.createPool({
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: import.meta.env.VITE_DB_PORT || 3306,
  database: import.meta.env.VITE_DB_NAME || 'taichung_tourism',
  user: import.meta.env.VITE_DB_USER,
  password: import.meta.env.VITE_DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10
})

// 修改查詢函數
export async function queryUbikeStations(stationName = null, limit = 10) {
  try {
    let query = 'SELECT * FROM ubike_stations WHERE status = "active"'
    const params = []

    if (stationName) {
      query += ' AND name LIKE ?'
      params.push(`%${stationName}%`)
    }

    query += ' LIMIT ?'
    params.push(limit)

    const [rows] = await pool.query(query, params)
    return rows
  } catch (error) {
    console.error('查詢失敗:', error)
    throw error
  }
}
```

3. **設定環境變數**
```env
# .env
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=taichung_tourism
VITE_DB_USER=your-username
VITE_DB_PASSWORD=your-password
```

4. **建立資料表**
```sql
CREATE TABLE ubike_stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  available_bikes INT DEFAULT 0,
  available_spaces INT DEFAULT 0,
  total_spaces INT,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_status (status)
);
```

#### 方式二：使用政府開放資料 API

如果台中市政府有提供 Ubike API（推薦方式）：

```javascript
export async function queryUbikeStations(stationName = null, limit = 10) {
  try {
    // 呼叫政府開放資料 API
    const response = await fetch('https://api-url/ubike/stations')
    const data = await response.json()

    // 格式化資料
    let stations = data.map(item => ({
      name: item.StationName,
      address: item.Address,
      available_bikes: item.AvailableBikes,
      available_spaces: item.AvailableSpaces,
      latitude: item.Latitude,
      longitude: item.Longitude,
      status: item.Status === '1' ? 'active' : 'inactive',
      updated_at: new Date().toISOString()
    }))

    // 篩選站點
    if (stationName) {
      stations = stations.filter(s => s.name.includes(stationName))
    }

    return stations.slice(0, limit)
  } catch (error) {
    console.error('API 查詢失敗:', error)
    throw error
  }
}
```

#### 方式三：使用後端 API

如果你有自己的後端服務：

```javascript
export async function queryUbikeStations(stationName = null, limit = 10) {
  try {
    const params = new URLSearchParams({
      ...(stationName && { name: stationName }),
      limit: limit.toString()
    })

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ubike/stations?${params}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('後端 API 查詢失敗:', error)
    throw error
  }
}
```

### 資料庫架構建議

詳細的資料表結構和說明請參考 `DATABASE_SETUP.md`。

基本資料表包括：
- `ubike_stations` - Ubike 站點（已實作查詢功能）
- `attractions` - 景點資訊（待擴充）
- `restaurants` - 餐廳資訊（待擴充）

---

## 🔧 常見自訂需求

### 1. 改變 AI 的回應風格

**修改檔案：** `src/config/system.config.js`

```javascript
// 改成更活潑的語氣
export const SYSTEM_PROMPT = `你是台中旅遊達人小助手！😊 超級熱愛台中美食和景點！

【你的超能力】
1. 推薦超讚的打卡景點 📸
2. 介紹必吃美食 🍜
3. 即時 Ubike 資訊 🚲

【說話風格】
- 活潑熱情，多用表情符號
- 像朋友一樣親切
- 分享時要有熱情！
...`
```

### 2. 限制特定類型的問題

**修改檔案：** `src/config/system.config.js`

```javascript
// 只回答素食相關問題
export const SYSTEM_PROMPT = `你是台中素食旅遊助手...

【重要限制】
1. 只推薦素食餐廳和適合素食者的景點
2. 不推薦葷食餐廳
...`
```

### 3. 新增其他資料查詢

**修改檔案：** `src/services/databaseService.js`

```javascript
// 新增景點查詢
export async function queryAttractions(category = null, limit = 10) {
  // TODO: 實作景點查詢
  const mockData = [
    {
      id: 1,
      name: '彩虹眷村',
      category: '文化景點',
      description: '色彩繽紛的彩繪眷村',
      address: '台中市南屯區春安路56巷',
      rating: 4.5
    }
  ]
  return mockData
}
```

**同時修改：** `src/services/aiService.js`

```javascript
// 在 sendMessage 函數中新增偵測
if (needsAttractionData(message)) {
  console.log('🔍 偵測到景點查詢需求')
  databaseContext += await getAttractionData(message)
}
```

### 4. 調整 UI 樣式

**修改檔案：** `src/components/AIChatbox.vue`

```css
/* 改成深色主題 */
.chatbox-container {
  background: #1a1a1a;
  color: #ffffff;
}

.chatbox-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message.assistant .message-text {
  background: #2a2a2a;
  color: #ffffff;
}
```

---

## 📋 修改檢查清單

在修改設定後，建議檢查：

- [ ] 修改後的程式碼沒有語法錯誤
- [ ] 環境變數已正確設定
- [ ] 重新啟動開發伺服器
- [ ] 測試基本功能是否正常
- [ ] AI 回應是否符合預期
- [ ] 資料庫查詢是否正常（如果有修改）
- [ ] UI 顯示是否正確（如果有修改樣式）

---

## 🆘 疑難排解

### 修改後 AI 沒有按照新的 prompt 回應

**可能原因：**
- 瀏覽器快取了舊版本
- 需要清除對話重新開始

**解決方式：**
1. 重新整理頁面
2. 點擊「清除對話」按鈕
3. 重新提問

### 資料庫連接失敗

**檢查項目：**
1. 環境變數是否正確設定
2. 資料庫服務是否正在運行
3. 連接資訊（host, port, user, password）是否正確
4. 防火牆設定

### 修改樣式沒有生效

**可能原因：**
- CSS 選擇器優先權問題
- Scoped CSS 限制

**解決方式：**
1. 檢查 CSS 選擇器是否正確
2. 使用 `:deep()` 穿透 scoped CSS
3. 清除瀏覽器快取

---

## 📚 相關文件

- [資料庫設定指南](DATABASE_SETUP.md) - 詳細的資料庫整合說明
- [AI 服務設定](AI_SETUP.md) - 各種 AI 服務的配置方式
- [整合指南](INTEGRATION_GUIDE.md) - 如何整合到其他專案

---

## 💡 最佳實踐

1. **版本控制**
   - 修改前先建立新分支
   - 提交時寫清楚的 commit message

2. **測試**
   - 修改後務必測試
   - 保留舊的模擬資料以便測試

3. **文件**
   - 重大修改記得更新文件
   - 註解說明修改原因

4. **安全**
   - 敏感資訊使用環境變數
   - 不要將 API Key 提交到 Git
