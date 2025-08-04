
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const method = request.method
		const pathname = url.pathname

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    	}

		if (request.method === 'OPTIONS') {
      		return new Response(null, { headers: corsHeaders })
   		}

		if (pathname === '/api/test' && method === 'GET') {
			return new Response(JSON.stringify({
				success: true,
				message: 'API is working',
				timestamp: new Date().toISOString()
			}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			})
  		}

		// 新增数据库测试API端点
		if (pathname === '/api/db-test' && method === 'GET') {
			return handleDatabaseTest(request, env, ctx, corsHeaders);
		}


		return new Response(null, { status: 404 });
	},
};

async function handleDatabaseTest(request,env,ctx,corsHeaders) {
	try {

		// 检查request.env是否存在
		if (!env) {
			throw new Error('request.env is undefined');
		}

		// 检查DB绑定是否存在
		if (!env.DB) {
			throw new Error('DB binding is not available in request.env');
		}

		// 尝试查询数据库表结构
		const result = await env.DB.prepare(
			'SELECT 1 as test'
		).first()

		return new Response(JSON.stringify({
			success: true,
			database: 'connected',
			result
		}), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message
    	}), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      	})
	}
}