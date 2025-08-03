import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 测试路由
// 删除或注释掉这个根路由
// router.get('/', () => {
//   return new Response('Hello from Cloudflare Workers!');
// });

// 获取所有数据的路由
router.get('/api/data', async (request) => {
  try {
    // 从请求上下文中获取数据库绑定
    const { DB } = request.env;
    // 查询数据库
    const results = await DB.prepare('SELECT * FROM users').all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});


// 插入模拟数据的路程
router.post('/api/simulation', async (request) => {
  try {
    const { DB } = request.env;
    const data = await request.json();

    console.log('Received simulation data:', data);

    // Add 5-second timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 5000);
    });

    //职业判断逻辑保持不变
    const isMace = data.simulator_data.includes('chaotic_flail');
    const isSword = data.simulator_data.includes('regal_sword');
    const isSpear = data.simulator_data.includes('furious_spear');
    const isBulwark = data.simulator_data.includes('griffin_bulwark');
    const isFireMage = data.simulator_data.includes('blazing_trident');
    const isNatureMage = data.simulator_data.includes('blooming_trident');
    const isWaterMage = data.simulator_data.includes('rippling_trident');
    const isRanged = data.simulator_data.includes('cursed_bow')||data.simulator_data.includes('sundering_crossbow');

    // 使用Promise.race添加超时处理
    const result = await Promise.race([
      DB.prepare(
        `INSERT INTO simulation_results (
          map_name, tier_name, avg_time, checked_avg_time, simulator_data, character_name,
          is_mace, is_sword, is_spear, is_bulwark,
          is_fire_mage, is_nature_mage, is_water_mage, is_ranged
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        // 使用String()函数确保avg_time为字符串类型
        .bind(
          data.map, data.difficulty, String(data.avg_time), null, data.simulator_data, data.character_name,
          isMace ? 1 : 0, isSword ? 1 : 0, isSpear ? 1 : 0, isBulwark ? 1 : 0,
          isFireMage ? 1 : 0, isNatureMage ? 1 : 0, isWaterMage ? 1 : 0, isRanged ? 1 : 0
        )
        .run(),
      timeoutPromise
    ]);

    console.log('Insert result:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Simulation error:', error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 测试数据库连接的路由
router.get('/api/test-db', async (request) => {
  try {
    const { DB } = request.env;
    console.log('Attempting to connect to database...');
    const startTime = Date.now();
    const result = await DB.prepare('SELECT 1').all();
    const endTime = Date.now();
    console.log(`Database query completed in ${endTime - startTime}ms`);
    return new Response(JSON.stringify({
      success: true,
      result: result,
      executionTime: `${endTime - startTime}ms`
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 404 路由 - 仅处理 API 请求
// router.all('*', async (request) => {
//   try {
//     const url = new URL(request.url);
//     const path = url.pathname;

//     // 只处理 API 路由的 404，让 Wrangler 处理静态文件
//     if (path.startsWith('/api/')) {
//       return new Response('API endpoint not found', { status: 404 });
//     }

//     // 对于非 API 请求，返回 404 让 Wrangler 尝试提供静态文件
//     // 注意：这只是临时解决方案，实际应该让 Wrangler 优先处理静态文件
//     return new Response('Not Found', { status: 404 });
//   } catch (error) {
//     return new Response('Error handling request: ' + error.message, { status: 500 });
//   }
// });

// 导出worker处理函数
export default { fetch: router.handle };

// 定义环境类型
/**
 * @typedef {Object} Env
 * @property {D1Database} DB - D1数据库绑定
 */