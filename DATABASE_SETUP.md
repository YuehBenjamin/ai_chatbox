# 資料庫整合說明

本專案已完成資料庫整合的前置作業，目前使用模擬資料進行開發和測試。

## 📋 目前狀態

### ✅ 已完成
1. **系統範圍限制** - AI 只回答台中相關問題
2. **資料庫服務架構** - 完整的查詢介面和資料格式
3. **Ubike 資料整合** - 自動偵測並查詢 Ubike 相關問題
4. **模擬資料** - 5 個台中 Ubike 站點的示範資料

### ⏳ 待實作
1. 連接真實資料庫
2. 實作即時 Ubike API 查詢
3. 新增其他資料表（景點、餐廳、活動等）

---

## 🏗️ 架構說明

### 檔案結構

```
src/
├── config/
│   └── system.config.js       ← 系統配置（範圍限制、提示詞）
├── services/
│   ├── aiService.js          ← AI 服務（整合資料庫查詢）
│   └── databaseService.js    ← 資料庫服務（目前使用模擬資料）
```

### 運作流程

```
使用者提問
    ↓
1. 範圍檢查（isInScope）
   - 是否與台中相關？
   - 如果否 → 返回範圍外訊息
    ↓
2. 資料庫查詢（如需要）
   - 偵測 Ubike 關鍵字
   - 查詢資料庫
   - 格式化資料
    ↓
3. 組合訊息
   - 系統提示詞
   - 資料庫查詢結果
   - 使用者問題
    ↓
4. AI 回應
```

---

## 🎯 功能特色

### 1. 自動範圍限制

系統會自動檢查問題是否與台中相關：

**台中相關關鍵字：**
- 台中、臺中
- 景點：逢甲、一中、高美、彩虹眷村、國家歌劇院等
- 交通：Ubike、公車、台中車站

**非台中關鍵字：**
- 其他城市：台北、高雄、台南等
- 國外：日本、韓國、美國等

**範例對話：**

```
使用者：「台北101怎麼去？」
AI：「抱歉，我是台中市旅遊助手，專門提供台中相關的資訊...」

使用者：「台中有什麼好玩的？」
AI：「台中有很多值得一遊的景點！以下是幾個推薦：...」
```

### 2. Ubike 資料查詢

當使用者詢問 Ubike 相關問題時，系統會：

1. 自動偵測關鍵字（ubike、自行車、借車、還車等）
2. 提取站點名稱（如果有）
3. 查詢資料庫
4. 格式化即時資料
5. 結合 AI 回應

**支援的查詢：**
- 「火車站的 Ubike 還有車嗎？」
- 「逢甲大學附近哪裡可以借 Ubike？」
- 「一中街 Ubike 站點資訊」
- 「台中有哪些 Ubike 站？」

---

## 🔧 連接真實資料庫

### 方式一：MySQL/PostgreSQL

編輯 `src/services/databaseService.js`：

```javascript
// 1. 安裝資料庫驅動
// npm install mysql2
// 或
// npm install pg

// 2. 引入驅動
import mysql from 'mysql2/promise'

// 3. 建立連接池
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'taichung_tourism',
  user: 'your-username',
  password: 'your-password',
  waitForConnections: true,
  connectionLimit: 10
})

// 4. 修改查詢函數
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

### 方式二：API 查詢（推薦用於 Ubike）

台中市政府可能有提供即時 Ubike API：

```javascript
export async function queryUbikeStations(stationName = null, limit = 10) {
  try {
    // 呼叫政府開放資料 API
    const response = await fetch('https://api-url/ubike/stations')
    const data = await response.json()

    // 篩選和格式化資料
    let stations = data.map(item => ({
      name: item.StationName,
      address: item.Address,
      available_bikes: item.AvailableBikes,
      available_spaces: item.AvailableSpaces,
      // ...
    }))

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

---

## 📊 建議的資料庫結構

### Ubike 站點表 (ubike_stations)

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
  INDEX idx_status (status),
  INDEX idx_location (latitude, longitude)
);
```

### 未來可擴充的表

```sql
-- 景點表
CREATE TABLE attractions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  category VARCHAR(50),
  description TEXT,
  address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2),
  opening_hours JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 餐廳表
CREATE TABLE restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  category VARCHAR(50),
  cuisine_type VARCHAR(50),
  address VARCHAR(255),
  phone VARCHAR(20),
  price_range VARCHAR(20),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 活動表
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 測試

### 測試範圍限制

```javascript
// 在瀏覽器 console 測試
import { isInScope } from './config/system.config.js'

console.log(isInScope('台中有什麼好玩的？'))  // true
console.log(isInScope('台北101怎麼去？'))     // false
console.log(isInScope('逢甲夜市推薦'))        // true
```

### 測試資料庫查詢

```javascript
import { queryUbikeStations } from './services/databaseService.js'

// 查詢所有站點
const all = await queryUbikeStations()
console.log(all)

// 查詢特定站點
const station = await queryUbikeStations('火車站')
console.log(station)
```

---

## ⚙️ 環境變數設定

如果資料庫需要連接憑證，建議使用環境變數：

編輯 `.env`：

```env
# 資料庫設定
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_NAME=taichung_tourism
VITE_DB_USER=your-username
VITE_DB_PASSWORD=your-password

# Ubike API（如果使用 API）
VITE_UBIKE_API_URL=https://api-url/ubike
VITE_UBIKE_API_KEY=your-api-key
```

在 `databaseService.js` 中使用：

```javascript
const DB_CONFIG = {
  host: import.meta.env.VITE_DB_HOST,
  port: import.meta.env.VITE_DB_PORT,
  database: import.meta.env.VITE_DB_NAME,
  user: import.meta.env.VITE_DB_USER,
  password: import.meta.env.VITE_DB_PASSWORD
}
```

---

## 📝 待辦事項

- [ ] 決定使用資料庫還是 API
- [ ] 設定資料庫連接或 API 金鑰
- [ ] 實作真實查詢函數
- [ ] 移除模擬資料
- [ ] 新增錯誤處理和重試機制
- [ ] 新增快取機制（減少資料庫查詢）
- [ ] 擴充其他資料表查詢（景點、餐廳等）

---

## 🆘 需要幫助？

如果在整合資料庫時遇到問題：

1. 檢查資料庫連接設定是否正確
2. 確認資料表結構符合預期
3. 查看 console 的錯誤訊息
4. 參考 `databaseService.js` 中的 TODO 註解

目前系統使用模擬資料，所有功能都能正常運作。當準備好連接真實資料庫時，只需修改 `databaseService.js` 即可，不需要改動其他程式碼。
