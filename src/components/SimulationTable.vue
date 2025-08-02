<template>
  <div class="bg-gray-100 relative min-h-screen w-full h-full">
    <div class="absolute top-4 right-4 z-10">
      <button 
        id="chinese-btn" 
        class="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
        @click="setLanguage('zh')">
        中文
      </button>
      <button 
        id="english-btn" 
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        @click="setLanguage('en')">
        EN
      </button>
    </div>

    <h1 class="text-xl font-bold text-center mb-6" data-lang-key="title">{{ currentLang.title }}</h1>

    <div class="scroll-container relative overflow-hidden">
      <div class="scroll-arrow left" @click="moveLeft">
        <i class="fa-solid fa-chevron-left text-xl"></i>
      </div>

      <div class="scroll-content flex gap-4 transition-transform duration-300 ease-out">
        <div 
          v-for="(mapData, mapIndex) in simulationData" 
          :key="mapIndex"
          class="scroll-item bg-white p-4 rounded-lg shadow-md min-w-[90%] max-w-[90%] md:min-w-[45%] md:max-w-[45%]"
          :data-map-index="mapIndex">

          <h2 class="text-xl font-bold mb-4 text-center map-header">{{ currentLang[`map_${mapIndex + 1}`] }}</h2>

          <!-- 标签页容器 -->
          <div class="tabs mb-4">
            <!-- 第二级标签页 - 地图难度 -->
            <div class="tab-level-2 flex border-b border-gray-300">
              <button 
                v-for="tier in ['T0', 'T1', 'T2']"
                :key="tier"
                :class="{ 'tab-button': true, 'active': selectedTier[mapIndex] === tier }"
                :data-difficulty="tier"
                @click="selectTier(mapIndex, tier)">
                {{ currentLang[tier] || tier }}
              </button>
            </div>
          </div>

          
          <div class="table-container overflow-x-auto">
            <table class="w-full my-4 tab-content" style="table-layout: fixed;">
              <thead>
                <tr>
                  <th class="occupation-column  py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['职业'] }}
                  </th>
                  <th class="average-time-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['平均时间'] }}
                  </th>
                  <th class="simulator-data-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['数据'] }}
                  </th>
                  <th class="player-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['玩家'] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in getFilteredData(mapIndex)" :key="item.id || item.name + item.player" class="hover:bg-gray-50">
                  <td class="occupation-column py-2 px-2 text-center profession-cell" :data-profession-key="getProfessionKey(item.name)">
                    {{ currentLang[getProfessionKey(item.name)] || item.name }}
                  </td>
                  <td class="average-time-column py-2 px-2 text-center">{{ item.avg_time }}</td>
                  <td class="simulator-data-column py-2 px-2 text-center">
                    <button 
                      class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 copy-button"
                      @click="copyToClipboard(item.data)">
                      <i class="fa-solid fa-copy"></i> {{ copyStatus === item.data ? currentLang['已复制'] : currentLang['复制'] }}
                    </button></td>
                  <td class="player-column py-2 px-2 text-center">{{ item.player }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="scroll-arrow right" @click="moveRight">
        <i class="fa-solid fa-chevron-right text-xl"></i>
      </div>
    </div>

    <div class="mt-4 text-gray-700 text-left px-8">
      <p data-lang-key="data_source" class="text-left">{{ currentLang['data_source'] }}<a href="https://shykai.github.io/MWICombatSimulatorTest/dist/" target="_blank" class="text-blue-500 hover:underline">MWISimulator</a></p>
      <p data-lang-key="role_limit" class="text-left">{{ currentLang['role_limit'] }}</p>
      <p data-lang-key="gear_limit" class="text-left">{{ currentLang['gear_limit'] }}</p>
      <div class="flex justify-center mt-4 mb-4 mb-2">
        <a href="/sim.html" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 upload-button" data-lang-key="upload_button">{{ currentLang['upload_button'] }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import simulationData from '../data/simulationData.js';
import lang from '../data/lang.js';

// 状态管理
const currentLangCode = ref('zh');
const copyStatus = ref('');
const currentIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

// 为每个地图创建独立的选择状态
const selectedTier = ref(simulationData.map(() => 'T0'));

// 计算当前语言
const currentLang = computed(() => lang[currentLangCode.value]);

// 获取指定地图的过滤数据
const getFilteredData = (mapIndex) => {
  const mapData = simulationData[mapIndex];
  if (!mapData) return [];
  const data = mapData.sim_result[selectedTier.value[mapIndex]] || [];
  // 按avg_time降序排序
  return [...data].sort((a, b) => a.avg_time - b.avg_time);
};

// 获取职业对应的键
const getProfessionKey = (name) => {
  switch (name) {
    case '锤': return 'mace';
    case '剑': return 'sword';
    case '矛': return 'spear';
    case '火法': return 'fire_mage';
    case '自然': return 'nature_mage';
    case '水法': return 'water_mage';
    case '远程': return 'ranged';
    case '盾': return 'bulwark';
    default: return name;
  }
};

// 切换语言
const setLanguage = (langCode) => {
  currentLangCode.value = langCode;
  // 更新所有标签按钮文本
  updateTabTexts();
};

// 更新标签按钮文本
const updateTabTexts = () => {
  // 这里不需要手动更新，Vue的响应式会自动处理
};

// 选择等级
const selectTier = (mapIndex, tier) => {
  selectedTier.value[mapIndex] = tier;
};

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    copyStatus.value = text;
    setTimeout(() => {
      copyStatus.value = '';
    }, 2000);
  }).catch(err => {
    alert(currentLang.value['copy_failed'] + ': ' + err);
  });
};

// 移动到指定索引
const moveToIndex = (index) => {
  const itemCount = simulationData.length;
  const maxIndex = itemCount - (window.innerWidth >= 768 ? 2 : 1);
  const newIndex = Math.max(0, Math.min(index, maxIndex));
  currentIndex.value = newIndex;
  updateScrollPosition();
  updateArrows();
};

// 更新滚动位置
const updateScrollPosition = () => {
  const scrollContent = document.querySelector('.scroll-content');
  if (!scrollContent) return;

  const itemWidth = document.querySelector('.scroll-item')?.offsetWidth || 0;
  const itemGap = 24; // 对应CSS中的gap-6
  const scrollPosition = currentIndex.value * (itemWidth + itemGap);

  scrollContent.style.transform = `translateX(-${scrollPosition}px)`;
};

// 更新箭头显示状态
const updateArrows = () => {
  const leftArrow = document.querySelector('.scroll-arrow.left');
  const rightArrow = document.querySelector('.scroll-arrow.right');
  if (!leftArrow || !rightArrow) return;

  const itemCount = simulationData.length;
  const maxIndex = itemCount - (window.innerWidth >= 768 ? 2 : 1);

  leftArrow.classList.toggle('hidden', currentIndex.value <= 0);
  rightArrow.classList.toggle('hidden', currentIndex.value >= maxIndex);
};

// 移动到上一个/下一个
const moveLeft = () => moveToIndex(currentIndex.value - 1);
const moveRight = () => moveToIndex(currentIndex.value + 1);

// 拖动事件处理
const handleMouseDown = (e) => {
  isDragging.value = true;
  startX.value = e.pageX;
  scrollLeft.value = currentIndex.value;
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.style.cursor = 'grabbing';
  }
};

const handleMouseLeave = () => {
  isDragging.value = false;
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.style.cursor = 'grab';
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.style.cursor = 'grab';
  }
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  e.preventDefault();

  const x = e.pageX;
  const walk = (startX.value - x) / 200; // 灵敏度调整
  const newIndex = Math.round(scrollLeft.value + walk);

  moveToIndex(newIndex);
};

// 触摸事件处理
const handleTouchStart = (e) => {
  isDragging.value = true;
  startX.value = e.touches[0].pageX;
  scrollLeft.value = currentIndex.value;
};

const handleTouchEnd = () => {
  isDragging.value = false;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;

  const x = e.touches[0].pageX;
  const walk = (startX.value - x) / 200; // 灵敏度调整
  const newIndex = Math.round(scrollLeft.value + walk);

  moveToIndex(newIndex);
};

// 窗口大小变化处理
const handleResize = () => {
  moveToIndex(0);
};

// 初始化
onMounted(() => {
  // 设置初始语言
  setLanguage('zh');

  // 更新箭头状态
  updateArrows();

  // 添加事件监听器
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
  }

  window.addEventListener('resize', handleResize);
});

// 清理
onUnmounted(() => {
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) {
    scrollContainer.removeEventListener('mousedown', handleMouseDown);
    scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    scrollContainer.removeEventListener('mouseup', handleMouseUp);
    scrollContainer.removeEventListener('mousemove', handleMouseMove);
    scrollContainer.removeEventListener('touchstart', handleTouchStart);
    scrollContainer.removeEventListener('touchend', handleTouchEnd);
    scrollContainer.removeEventListener('touchmove', handleTouchMove);
  }

  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* 滚动容器样式 */
.scroll-container {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
  margin-bottom: 2rem;
}

.scroll-content {
  display: flex;
  gap: 2rem;
  padding: 0 20px;
  transition: transform 0.3s ease-out;
  will-change: transform;
}

.scroll-item {
  min-width: 85%;
  max-width: 85%;
}

@media (min-width: 768px) {
  .scroll-item {
    min-width: 40%;
    max-width: 40%;
  }
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  opacity: 0.5;
  transition: opacity 0.3s, transform 0.3s;
}

.scroll-arrow:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

.scroll-arrow.left {
  left: 10px;
}

.scroll-arrow.right {
  right: 10px;
}

.scroll-arrow.hidden {
  display: none;
}

.scroll-hint {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* 标签页样式 */
.tabs {
  margin-bottom: 1rem;
}

.tab-level-2 {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab-level-2 .tab-button {
  flex: 1; /* 平分宽度 */
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: none;
  font-weight: 500;
  text-align: center; /* 文本居中 */
  color: #6B7280;
  font-size: 0.9rem;
}

.tab-button.active {
  color: #3B82F6;
  border-bottom: 2px solid #3B82F6;
}

.tab-button:hover:not(.active) {
  color: #1E40AF;
  background-color: #EFF6FF;
}


.tab-content {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 表格列宽调整 */
.player-column {
  width: 40%; /* 减小上传人列宽 */
}

.occupation-column {
  width: 20%;
}

.average-time-column {
  width: 20%;
}

.simulator-data-column {
  width: 20%;
}

/* 表格样式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: center;
}

.data-table th {
  background-color: #f2f2f2;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* 按钮样式 */
button {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e0e0e0;
}

button.active {
  background-color: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

/* 其他样式 */
body {
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.fas {
  margin-right: 5px;
}

.text-gray-700 {
  color: #4B5563;
}

.text-center {
  text-align: center;
}

.mt-8 {
  margin-top: 2rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2em;
}


.rounded {
  border-radius: 0.375rem;
}

.hover\:bg-blue-600:hover {
  background-color: #2563EB;
}

.bg-blue-500 {
  background-color: #3B82F6;
}

.text-white {
  color: white;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.absolute {
  position: absolute;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.z-10 {
  z-index: 10;
}

.mr-2 {
  margin-right: 0.5rem;
}

.bg-gray-100 {
  background-color: #F3F4F6;
}

.p-5 {
  padding: 1.25rem;
}

.relative {
  position: relative;
}

.min-h-screen {
  min-height: 100vh;
}
.text-left {
  text-align: left;
}
.overflow-x-auto {
  overflow-x: auto;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.border-b {
  border-bottom: 1px solid #E5E7EB;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.profession-cell {
  text-align: center;
}
</style>