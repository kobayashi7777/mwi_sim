import { Router } from 'itty-router';

// 创建路由器
const router = Router();

// 测试路由
router.get('/', () => {
  return new Response('Hello from Cloudflare Workers!');
});

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

// 插入数据的路由
router.post('/api/data', async (request) => {
  try {
    const { DB } = request.env;
    const data = await request.json();
    const result = await DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    )
      .bind(data.name, data.email)
      .run();
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 404 路由
router.all('*', () => new Response('Not Found', { status: 404 }));

// 导出worker处理函数
export default { fetch: router.handle };

// 定义环境类型
/**
 * @typedef {Object} Env
 * @property {D1Database} DB - D1数据库绑定
 */