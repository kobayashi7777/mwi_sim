-- 创建新的模拟结果表
CREATE TABLE IF NOT EXISTS simulation_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  map_name TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  avg_time TEXT,
  checked_avg_time TEXT,
  simulator_data TEXT NOT NULL,
  character_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_mace BOOLEAN DEFAULT 0,
  is_sword BOOLEAN DEFAULT 0,
  is_spear BOOLEAN DEFAULT 0,
  is_bulwark BOOLEAN DEFAULT 0,
  is_fire_mage BOOLEAN DEFAULT 0,
  is_nature_mage BOOLEAN DEFAULT 0,
  is_water_mage BOOLEAN DEFAULT 0,
  is_ranged BOOLEAN DEFAULT 0
);

-- 插入示例数据
INSERT INTO simulation_results (
  map_name, tier_name, avg_time, checked_avg_time, simulator_data, character_name,
  is_mace, is_sword, is_spear
) VALUES
  ('D1', 'T0', '-', NULL, 'D1T0锤数据', '玩家A', 1, 0, 0),
  ('D1', 'T0', '110', NULL, 'D1T0剑数据', '玩家B', 0, 1, 0),
  ('D1', 'T0', '115', NULL, 'D1T0矛数据', '玩家C', 0, 0, 1);
