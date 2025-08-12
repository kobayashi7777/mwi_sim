-- -- -- 这段sql有问题，如果不小心在checked_avg_time 上添加了空格，会导致排序错误
PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE simulation_results (
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
INSERT INTO simulation_results VALUES(14,'D3','T1','60','59.4','','FurryCharmue','2025-08-12 09:20:49',0,1,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(16,'D2','T2','30','29.9','','slowhandfa','2025-08-12 09:49:24',1,0,0,1,0,1,0,0);
INSERT INTO simulation_results VALUES(17,'D1','T1','18','18.0','','bbbb87','2025-08-12 12:00:19',1,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(19,'D1','T1','24.0','23.9','','MarketDestroyer','2025-08-12 12:01:50',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(20,'D1','T1','26.7','26.7','','FurryCharmue','2025-08-12 12:03:28',0,1,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(21,'D4','T1','58.3','58.8','','MarketDestroyer','2025-08-12 12:04:40',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(22,'D1','T1','28.8','28.8','','superxx','2025-08-12 12:09:00',0,0,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(26,'D2','T2','26.9','26.9','','dundunvv','2025-08-12 12:13:16',1,1,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(27,'D4','T1','55.6','55.6','','ValerioGiovanni','2025-08-12 12:13:59',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(28,'D1','T1','33.7','33.5','','Vicky718','2025-08-12 12:16:25',0,0,0,1,0,1,1,0);
INSERT INTO simulation_results VALUES(29,'D1','T1','23.2','23.3','','Deepblue','2025-08-12 12:18:11',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(30,'D1','T1','23.2','23.3','','Deepblue','2025-08-12 12:18:15',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(31,'D3','T1','55.6','56.6','','NoJobKiwiBird','2025-08-12 12:19:05',0,1,0,0,1,1,0,0);
INSERT INTO simulation_results VALUES(32,'D3','T2','57.6','56.1','','Blitze','2025-08-12 12:20:01',0,0,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(33,'D4','T1','56.6','57.1','','ValerioGiovanni','2025-08-12 12:21:25',0,1,1,1,0,1,0,1);
INSERT INTO simulation_results VALUES(34,'D4','T2','49.2','49.6','','ckbb','2025-08-12 12:22:42',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(35,'D3','T1','54.1','54.5','','MarketDestroyer','2025-08-12 12:23:48',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(36,'D3','T1','57.7','57.7','','yjmnb','2025-08-12 12:25:18',0,1,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(37,'D1','T1','21.7','21.7','','DonQuixote','2025-08-12 12:25:24',0,0,0,1,1,0,0,1);
INSERT INTO simulation_results VALUES(38,'D1','T1','17.5-17.6','17.5','','PME','2025-08-12 12:26:21',0,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(39,'D4','T1','46.2','49.6','','BattleFeed','2025-08-12 12:26:58',1,0,1,1,0,1,0,1);
INSERT INTO simulation_results VALUES(40,'D1','T1','15.6','15.7','','jerryhxc','2025-08-12 12:27:00',0,0,1,0,0,0,0,1);
INSERT INTO simulation_results VALUES(41,'D1','T1','16.6','16.7','','bbbb87','2025-08-12 12:27:04',0,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(42,'D1','T1','22.7','22.7','','BlezRuby','2025-08-12 12:28:44',0,0,0,1,0,0,0,1);
INSERT INTO simulation_results VALUES(43,'D2','T1','35.1','37.5','','TaupeMorose','2025-08-12 12:29:45',0,0,0,0,1,1,1,1);
INSERT INTO simulation_results VALUES(44,'D4','T2','46.5','46.2','','XDDS','2025-08-12 12:30:27',1,0,1,1,0,1,0,1);
INSERT INTO simulation_results VALUES(45,'D4','T2','57.1','57.7','','gragatrim','2025-08-12 12:30:41',1,1,0,1,0,1,1,0);
INSERT INTO simulation_results VALUES(46,'D1','T2','16.8','16.7','','dundunvv','2025-08-12 12:33:09',0,1,1,0,0,1,0,0);
INSERT INTO simulation_results VALUES(47,'D1','T1','17.5','17.5','','Leuchten','2025-08-12 12:33:28',1,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(48,'D2','T2','26.8','26.8','','tszcy','2025-08-12 12:34:45',1,1,1,0,0,1,0,0);
INSERT INTO simulation_results VALUES(49,'D3','T2','49.7','53.1','','hories','2025-08-12 12:37:18',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(50,'D1','T1','16.1','16.0','','lumsi','2025-08-12 12:38:00',1,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(51,'D1','T1','16.4',' 16.2','','dundunvv','2025-08-12 12:39:27',0,1,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(52,'D3','T1','55.4','54.5','','Deepblue','2025-08-12 12:40:36',0,0,0,1,0,1,1,1);
INSERT INTO simulation_results VALUES(53,'D2','T1','32','31.6','','FurryCharmue','2025-08-12 12:42:06',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(54,'D2','T1','32','31.6','','FurryCharmue','2025-08-12 12:42:09',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(55,'D1','T1','Average Time 16.1','16.1','','ironmitzie','2025-08-12 12:42:22',0,1,1,0,0,0,0,1);
INSERT INTO simulation_results VALUES(56,'D1','T1','18.5','18.4','','hellgodsc','2025-08-12 12:42:55',1,0,1,0,1,1,0,1);
INSERT INTO simulation_results VALUES(57,'D1','T1','19.4','19.4','','alkef','2025-08-12 12:44:02',1,0,0,0,0,1,1,1);
INSERT INTO simulation_results VALUES(58,'D3','T2','75','66.7','','milkkrro','2025-08-12 12:45:01',0,0,0,1,1,1,1,1);
INSERT INTO simulation_results VALUES(61,'D4','T1','240H 53.7','52.6','','FFA89','2025-08-12 12:45:11',1,1,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(62,'D3','T1','51.4','51.7','','yjmnb','2025-08-12 12:47:57',0,0,0,1,1,1,0,1);
INSERT INTO simulation_results VALUES(63,'D1','T2','17.6','17.6','','hellgodsc','2025-08-12 12:48:19',0,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(64,'D4','T1','55.6','55.6','','ValerioGiovanni','2025-08-12 12:48:20',1,0,1,1,0,1,0,1);
INSERT INTO simulation_results VALUES(65,'D1','T1','16.2','16.3','','bbbb87','2025-08-12 12:48:30',0,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(66,'D2','T1','30.5','31.3','','cy1zu','2025-08-12 12:49:49',1,1,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(67,'D1','T1','15.4','15.4','','ywsyzhx','2025-08-12 12:51:47',0,0,1,0,0,1,0,1);
INSERT INTO simulation_results VALUES(68,'D3','T1','52.2','51.3','','shuisheng','2025-08-12 12:52:06',0,0,0,1,1,1,0,0);
INSERT INTO simulation_results VALUES(69,'D1','T1','Average Time 15.8','15.8','','ironmitzie','2025-08-12 12:52:59',0,1,1,0,0,0,0,1);
INSERT INTO simulation_results VALUES(70,'D4','T1','51.4',NULL,'','8099','2025-08-12 12:54:16',0,0,0,1,1,1,1,1);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('simulation_results',128);
