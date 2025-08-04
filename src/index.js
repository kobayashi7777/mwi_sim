// export default {
//   async fetch(request, env, ctx) {
//     const url = new URL(request.url);
//     const pathname = url.pathname;
//     const method = request.method;

//     const corsHeaders = {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     };

//     if (method === 'OPTIONS') {
//       return new Response(null, { headers: corsHeaders });
//     }

//     // 根路由
//     if (pathname === '/' && method === 'GET') {
//       return new Response('MWI Simulation API is running', {
//         headers: { 'Content-Type': 'text/plain' },
//       });
//     }

//     // API测试路由
//     if (pathname === '/api/test' && method === 'GET') {
//       return new Response(JSON.stringify({
//         success: true,
//         message: 'Native routing working',
//         timestamp: new Date().toISOString()
//       }), {
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }


//     if (pathname === '/api/simulation' && method === 'POST') {
//         try {
//           const data = await request.json();
          
//           // 数据验证
//           if (!data.map || !data.difficulty || !data.avg_time || !data.simulator_data || !data.character_name) {
//             return new Response(JSON.stringify({
//               success: false,
//               error: 'Missing required fields'
//             }), {
//               status: 400,
//               headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//             });
//           }

//           const startTime = Date.now();
          
//           // 职业判断逻辑
//           const isMace = data.simulator_data.includes('chaotic_flail');
//           const isSword = data.simulator_data.includes('regal_sword');
//           const isSpear = data.simulator_data.includes('furious_spear');
//           const isBulwark = data.simulator_data.includes('griffin_bulwark');
//           const isFireMage = data.simulator_data.includes('blazing_trident');
//           const isNatureMage = data.simulator_data.includes('blooming_trident');
//           const isWaterMage = data.simulator_data.includes('rippling_trident');
//           const isRanged = data.simulator_data.includes('cursed_bow') || data.simulator_data.includes('sundering_crossbow');

//           const result = await env.DB.prepare(
//             `INSERT INTO simulation_results (
//               map_name, tier_name, avg_time, checked_avg_time, simulator_data, character_name,
//               is_mace, is_sword, is_spear, is_bulwark,
//               is_fire_mage, is_nature_mage, is_water_mage, is_ranged
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
//           ).bind(
//             data.map, data.difficulty, String(data.avg_time), null, data.simulator_data, data.character_name,
//             isMace ? 1 : 0, isSword ? 1 : 0, isSpear ? 1 : 0, isBulwark ? 1 : 0,
//             isFireMage ? 1 : 0, isNatureMage ? 1 : 0, isWaterMage ? 1 : 0, isRanged ? 1 : 0
//           ).run();

//           const endTime = Date.now();

//           return new Response(JSON.stringify({
//             success: true,
//             result: result,
//             executionTime: `${endTime - startTime}ms`
//           }), {
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });

//         } catch (error) {
//           return new Response(JSON.stringify({
//             success: false,
//             error: error.message,
//             type: 'insert_error'
//           }), {
//             status: 500,
//             headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//           });
//         }
//       }
    

//     // 404处理
//     return new Response('API endpoint not found', {
//       status: 404,
//       headers: { 'Content-Type': 'text/plain' },
//     });
//   }
// };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // 处理预检请求
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 根路由
      if (pathname === '/' && method === 'GET') {
        return new Response('MWI Simulation API is running (native routing)', {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        });
      }

      // API测试路由
      if (pathname === '/api/test' && method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          message: 'Native routing is working perfectly',
          timestamp: new Date().toISOString(),
          method: method,
          url: request.url
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 数据库连接测试
      if (pathname === '/api/test-db' && method === 'GET') {
        try {
          const startTime = Date.now();
          const result = await env.DB.prepare('SELECT 1 as test').first();
          const endTime = Date.now();
          
          return new Response(JSON.stringify({
            success: true,
            database: 'connected',
            result: result,
            executionTime: `${endTime - startTime}ms`,
            timestamp: new Date().toISOString()
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Database connection failed',
            message: error.message,
            type: 'database_error'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // 插入模拟数据
      if (pathname === '/api/simulation' && method === 'POST') {
        try {
          const data = await request.json();
          
          // 数据验证
          if (!data.map || !data.difficulty || !data.avg_time || !data.simulator_data || !data.character_name) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Missing required fields'
            }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          const startTime = Date.now();
          
          // 职业判断逻辑
          const isMace = data.simulator_data.includes('chaotic_flail');
          const isSword = data.simulator_data.includes('regal_sword');
          const isSpear = data.simulator_data.includes('furious_spear');
          const isBulwark = data.simulator_data.includes('griffin_bulwark');
          const isFireMage = data.simulator_data.includes('blazing_trident');
          const isNatureMage = data.simulator_data.includes('blooming_trident');
          const isWaterMage = data.simulator_data.includes('rippling_trident');
          const isRanged = data.simulator_data.includes('cursed_bow') || data.simulator_data.includes('sundering_crossbow');

          const result = await env.DB.prepare(
            `INSERT INTO simulation_results (
              map_name, tier_name, avg_time, checked_avg_time, simulator_data, character_name,
              is_mace, is_sword, is_spear, is_bulwark,
              is_fire_mage, is_nature_mage, is_water_mage, is_ranged
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            data.map, data.difficulty, String(data.avg_time), null, data.simulator_data, data.character_name,
            isMace ? 1 : 0, isSword ? 1 : 0, isSpear ? 1 : 0, isBulwark ? 1 : 0,
            isFireMage ? 1 : 0, isNatureMage ? 1 : 0, isWaterMage ? 1 : 0, isRanged ? 1 : 0
          ).run();

          const endTime = Date.now();

          return new Response(JSON.stringify({
            success: true,
            result: result,
            executionTime: `${endTime - startTime}ms`
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });

        } catch (error) {
          return new Response(JSON.stringify({
            success: false,
            error: error.message,
            type: 'insert_error'
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // 404处理
      return new Response(JSON.stringify({
        success: false,
        error: 'API endpoint not found',
        path: pathname,
        method: method
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      // 全局错误处理
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};