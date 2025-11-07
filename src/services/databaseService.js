/**
 * 資料庫服務
 * 負責從資料庫查詢資料（目前為前置作業，實際資料庫連接待實作）
 */

/**
 * 資料庫配置
 * 之後連接真實資料庫時在這裡設定
 */
const DB_CONFIG = {
  // 資料庫連接資訊（待填入）
  // host: 'localhost',
  // port: 3306,
  // database: 'taichung_tourism',
  // user: 'your-username',
  // password: 'your-password'
}

/**
 * 查詢 Ubike 站點資訊
 * @param {string} stationName - 站點名稱（可選）
 * @param {number} limit - 返回數量限制
 * @returns {Promise<Array>} 站點資料陣列
 */
export async function queryUbikeStations(stationName = null, limit = 10) {
  try {
    // TODO: 實作真實資料庫查詢
    // const results = await db.query('SELECT * FROM ubike_stations WHERE ...')

    // 目前返回模擬資料作為示範
    console.log(`🔍 查詢 Ubike 站點: ${stationName || '全部'}`)

    const mockData = getMockUbikeData()

    // 如果指定站點名稱，進行篩選
    if (stationName) {
      const filtered = mockData.filter(station =>
        station.name.includes(stationName)
      )
      return filtered.slice(0, limit)
    }

    return mockData.slice(0, limit)
  } catch (error) {
    console.error('查詢 Ubike 站點失敗:', error)
    throw new Error('無法查詢 Ubike 資料，請稍後再試')
  }
}

/**
 * 根據位置查詢附近的 Ubike 站點
 * @param {number} lat - 緯度
 * @param {number} lng - 經度
 * @param {number} radius - 搜尋半徑（公尺）
 * @returns {Promise<Array>} 附近的站點
 */
export async function queryNearbyUbikeStations(lat, lng, radius = 500) {
  try {
    // TODO: 實作地理位置查詢
    // const results = await db.query(`
    //   SELECT *,
    //     ST_Distance_Sphere(
    //       point(longitude, latitude),
    //       point(?, ?)
    //     ) as distance
    //   FROM ubike_stations
    //   HAVING distance < ?
    //   ORDER BY distance
    // `, [lng, lat, radius])

    console.log(`🔍 查詢附近 Ubike 站點: (${lat}, ${lng}), 半徑 ${radius}m`)

    // 返回模擬資料
    return getMockUbikeData().slice(0, 5)
  } catch (error) {
    console.error('查詢附近 Ubike 站點失敗:', error)
    throw new Error('無法查詢附近 Ubike 站點')
  }
}

/**
 * 檢查資料庫連接狀態
 * @returns {Promise<boolean>} 是否連接成功
 */
export async function checkDatabaseConnection() {
  try {
    // TODO: 實作資料庫連接檢查
    // await db.ping()

    console.log('✅ 資料庫連接檢查（目前使用模擬資料）')
    return true
  } catch (error) {
    console.error('❌ 資料庫連接失敗:', error)
    return false
  }
}

/**
 * 格式化 Ubike 站點資料為文字
 * @param {Array} stations - 站點資料陣列
 * @returns {string} 格式化後的文字
 */
export function formatUbikeStations(stations) {
  if (!stations || stations.length === 0) {
    return '目前沒有找到相關的 Ubike 站點資料。'
  }

  let result = `找到 ${stations.length} 個 Ubike 站點：\n\n`

  stations.forEach((station, index) => {
    result += `**${index + 1}. ${station.name}**\n`
    result += `   📍 地址：${station.address}\n`
    result += `   🚲 可借：${station.available_bikes} 輛\n`
    result += `   🅿️  可還：${station.available_spaces} 位\n`
    result += `   ℹ️  狀態：${station.status === 'active' ? '營運中' : '暫停服務'}\n`

    if (station.distance) {
      result += `   📏 距離：${Math.round(station.distance)}m\n`
    }

    result += '\n'
  })

  return result
}

/**
 * 模擬的 Ubike 資料（供開發測試使用）
 * 實際資料會從資料庫查詢
 */
function getMockUbikeData() {
  return [
    {
      id: 1,
      name: '台中火車站',
      address: '台中市中區建國路172號',
      latitude: 24.137,
      longitude: 120.685,
      available_bikes: 15,
      available_spaces: 25,
      total_spaces: 40,
      status: 'active',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: '逢甲大學',
      address: '台中市西屯區文華路100號',
      latitude: 24.179,
      longitude: 120.648,
      available_bikes: 8,
      available_spaces: 12,
      total_spaces: 20,
      status: 'active',
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: '一中商圈',
      address: '台中市北區一中街',
      latitude: 24.148,
      longitude: 120.685,
      available_bikes: 20,
      available_spaces: 10,
      total_spaces: 30,
      status: 'active',
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      name: '國家歌劇院',
      address: '台中市西屯區惠來路二段101號',
      latitude: 24.162,
      longitude: 120.640,
      available_bikes: 5,
      available_spaces: 15,
      total_spaces: 20,
      status: 'active',
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      name: '科博館',
      address: '台中市北區館前路1號',
      latitude: 24.157,
      longitude: 120.666,
      available_bikes: 12,
      available_spaces: 8,
      total_spaces: 20,
      status: 'active',
      updated_at: new Date().toISOString()
    }
  ]
}

/**
 * ========================================
 * 待實作功能（之後連接真實資料庫時）
 * ========================================
 */

/**
 * TODO: 初始化資料庫連接
 * export async function initDatabase() {
 *   // 建立資料庫連接池
 *   // 執行必要的初始化查詢
 * }
 */

/**
 * TODO: 查詢其他旅遊資料
 * export async function queryAttractions(category, limit) {
 *   // 查詢景點資料
 * }
 *
 * export async function queryRestaurants(area, category) {
 *   // 查詢餐廳資料
 * }
 *
 * export async function queryEvents(startDate, endDate) {
 *   // 查詢活動資料
 * }
 */
