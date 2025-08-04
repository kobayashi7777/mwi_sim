
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

		// 测试API
		if (pathname === '/api/test' && method === 'GET') {
			return new Response(JSON.stringify({
				success: true,
				message: 'API is working',
				timestamp: new Date().toISOString()
			}), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			})
  		}

		// 测试数据库API
		if (pathname === '/api/db-test' && method === 'GET') {
			return handleDatabaseTest(request, env, ctx, corsHeaders);
		}

		if (pathname === '/api/upload' && method === 'POST') {
			return handleUpload(request, env, ctx, corsHeaders);
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

async function handleUpload(request,env,ctx,corsHeaders) {
	try {
		
		const { DB } = env;
		const data = await request.json();
		console.log('Received simulation data:', data);

		const isMace = data.simulator_data.includes('chaotic_flail');
		const isSword = data.simulator_data.includes('regal_sword');
		const isSpear = data.simulator_data.includes('furious_spear');
		const isBulwark = data.simulator_data.includes('griffin_bulwark');
		const isFireMage = data.simulator_data.includes('blazing_trident');
		const isNatureMage = data.simulator_data.includes('blooming_trident');
		const isWaterMage = data.simulator_data.includes('rippling_trident');
		const isRanged = data.simulator_data.includes('cursed_bow')||data.simulator_data.includes('sundering_crossbow');

		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error('Database operation timed out')), 5000);
		});
		const result = await Promise.race([
			DB.prepare(
				`INSERT INTO simulation_results (
				map_name, tier_name, avg_time, checked_avg_time, simulator_data, character_name,
				is_mace, is_sword, is_spear, is_bulwark,
				is_fire_mage, is_nature_mage, is_water_mage, is_ranged
				) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			).bind(
				data.map, data.difficulty, String(data.avg_time), null, data.simulator_data, data.character_name,
				isMace ? 1 : 0, isSword ? 1 : 0, isSpear ? 1 : 0, isBulwark ? 1 : 0,
				isFireMage ? 1 : 0, isNatureMage ? 1 : 0, isWaterMage ? 1 : 0, isRanged ? 1 : 0
			).run(),
			timeoutPromise
    	]);

    	console.log('Insert result:', result);

    	return new Response(JSON.stringify({ success: true, result }), {
      		headers: { 'Content-Type': 'application/json' },
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