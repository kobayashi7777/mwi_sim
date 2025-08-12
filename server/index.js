
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

		// 获取模拟数据API
		if (pathname === '/api/simulation-data' && method === 'GET') {
			return handleGetSimulationData(request, env, ctx, corsHeaders);
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

async function handleGetSimulationData(request, env, ctx, corsHeaders) {
	try {
		// 检查KV绑定是否存在
		if (!env.MWI_SIM_CACHE) {
			console.warn('KV binding is not available, proceeding without cache');
		} else {
			// 尝试从缓存获取数据
			const cachedData = await env.MWI_SIM_CACHE.get('simulation_data');
			const cacheTimestamp = await env.MWI_SIM_CACHE.get('cache_timestamp');
			const now = Date.now();
			const tenMinutes = 10 * 60 * 1000;

			// 如果缓存存在且未过期
			if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < tenMinutes)) {
				console.log('Returning cached simulation data');
				return new Response(JSON.stringify({
					success: true,
					data: JSON.parse(cachedData),
					fromCache: true
				}), {
					headers: { ...corsHeaders, 'Content-Type': 'application/json' }
				});
			}
		}

		// 缓存不存在或已过期，从数据库获取数据
		// 检查DB绑定是否存在
		if (!env.DB) {
			throw new Error('DB binding is not available in request.env');
		}
		
		// 定义所有职业类型
		const maps = ['D1', 'D2', 'D3', 'D4'];
        const tiers = ['T0', 'T1', 'T2'];
		const classes = [
			{ name: 'mace', field: 'is_mace' },
			{ name: 'sword', field: 'is_sword' },
			{ name: 'spear', field: 'is_spear' },
			{ name: 'bulwark', field: 'is_bulwark' },
			{ name: 'fire_mage', field: 'is_fire_mage' },
			{ name: 'nature_mage', field: 'is_nature_mage' },
			{ name: 'water_mage', field: 'is_water_mage' },
			{ name: 'ranged', field: 'is_ranged' }
		];

		const allResults = [];
        for (const map of maps) {
            for (const tier of tiers) {
                for (const cls of classes) {
                    const sql = `
                        SELECT
                            map_name,
                            tier_name,
                            '${cls.name}' AS class,
                            avg_time,
                            checked_avg_time,
                            simulator_data,
                            character_name,
                            created_at,
							id
                        FROM simulation_results
                        WHERE checked_avg_time IS NOT NULL
                            AND ${cls.field} = 1
                            AND map_name = '${map}'
                            AND tier_name = '${tier}'
                        ORDER BY CAST(REPLACE(checked_avg_time, ' ', '') AS REAL) ASC, created_at ASC
                        LIMIT 1
                    `;
                    const result = await env.DB.prepare(sql).first();
                    if (result) {
                        allResults.push(result);
                    }
                }
            }
        }
		
		// 格式化结果为前端需要的结构
		const formattedData = formatSimulationData(allResults);

		// 更新缓存
		if (env.MWI_SIM_CACHE) {
			await env.MWI_SIM_CACHE.put('simulation_data', JSON.stringify(formattedData));
			await env.MWI_SIM_CACHE.put('cache_timestamp', Date.now().toString());
			console.log('Simulation data cached successfully');
		}

		return new Response(JSON.stringify({
			success: true,
			data: formattedData
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
		});
	}
}

// 格式化数据为前端组件需要的结构
function formatSimulationData(results) {
	// 定义所有可能的地图和难度
	const allMaps = ['D1', 'D2', 'D3', 'D4'];
	const allTiers = ['T0', 'T1', 'T2'];
	const allClasses = ['mace', 'sword', 'spear', 'bulwark', 'fire_mage', 'nature_mage', 'water_mage', 'ranged'];

	const maps = {};

	// 初始化所有地图和难度
	allMaps.forEach(map => {
		maps[map] = {
			map: map,
			sim_result: {}
		};

		allTiers.forEach(tier => {
			maps[map].sim_result[tier] = [];

			// 为每个职业添加默认记录
			allClasses.forEach(className => {
				let record = { class: className, avg_time: '-', simulator_data: '', character_name: '', id: '' };
				// 查找是否有匹配的记录
				const found = results.find(r => 
					r.map_name === map && 
					r.tier_name === tier && 
					r.class === className
				);
				if (found) {
					record = {
						class: found.class,
						avg_time: found.checked_avg_time || '-',
						simulator_data: found.simulator_data || '',
						character_name: found.character_name || '',
						id: found.id
					};
				}
				maps[map].sim_result[tier].push(record);
			});
		});
	});

	// 填充实际数据
	results.forEach(row => {
		const { map_name, tier_name, class: className, checked_avg_time, simulator_data, character_name,id } = row;

		if (maps[map_name] && maps[map_name].sim_result[tier_name]) {
			const tierData = maps[map_name].sim_result[tier_name];
			const index = tierData.findIndex(item => item.class === className);

			if (index !== -1) {
				tierData[index] = {
					class: className,
					avg_time: checked_avg_time || '-',
					simulator_data: simulator_data || '',
					character_name: character_name || '',
					id: id || '1e6'
				};
			}
		}
	});

	// 转换为数组形式并按地图排序
	return Object.values(maps).sort((a, b) => a.map.localeCompare(b.map));
}
