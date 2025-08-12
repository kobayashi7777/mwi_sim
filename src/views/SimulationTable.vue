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

    <h1 class="text-xl font-bold text-center mb-6" data-lang-key="title" style="color: #213547 !important;">{{ currentLang.title }}</h1>

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

          <h2 class="text-xl font-bold mb-4 text-center map-header" style="color: #213547 !important;">{{ currentLang[`map_${mapIndex + 1}`] }}</h2>

          <!-- 标签页容器 -->
          <div class="tabs mb-4">
            <!-- 第二级标签页 - 地图难度 -->
            <div class="tab-level-2 flex border-b border-gray-300">
              <button 
                v-for="tier in ['T1', 'T2']"
                :key="tier"
                :class="{ 'tab-button': true, 'active': selectedTier[mapIndex] === tier }"
                :data-difficulty="tier"
                @click="selectTier(mapIndex, tier)">
                {{ currentLang[tier] || tier }}
              </button>
            </div>
          </div>
          <div class="table-container overflow-x-auto" >
            <table class="w-full my-4 tab-content" style="table-layout: fixed;color: #213547 !important;" >
              <thead>
                <tr>
                  <th class="occupation-column  py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['class'] }}
                  </th>
                  <th class="average-time-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['avgTime'] }}
                  </th>
                  <th class="simulator-data-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['simulationData'] }}
                  </th>
                  <th class="player-column py-2 px-2 text-center font-bold border-b">
                    {{ currentLang['contributor'] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in getFilteredData(mapIndex)" :key="mapIndex + item.class" class="hover:bg-gray-50">
                  <td class="occupation-column py-2 px-2 text-center profession-cell" :data-profession-key="mapIndex+item.class">
                    {{ currentLang[item.class] || item.class }}
                  </td>
                  <td class="average-time-column py-2 px-2 text-center">{{ item.avg_time }}</td>
                  <td class="simulator-data-column py-2 px-2 text-center">
                    <button 
                      class="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 copy-button"
                      @click="copyToClipboard(item.simulator_data)">
                      <i class="fa-solid fa-copy"></i> {{ (copyStatus === item.simulator_data && item.simulator_data !== '') || copyStatus === 'EMPTY_TEXT_COPIED' ? currentLang['copied'] : currentLang['copy'] }}
                    </button>
                  </td>
                  <td class="player-column py-2 px-2 text-center">{{ item.character_name }}</td>
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

      <div class="mt-4 text-gray-700 px-8 flex-col items-center justify-center space-y-4">
        <p data-lang-key="note_1" class="text-center w-full">{{ currentLang['note_1'] }}<a href="https://shykai.github.io/MWICombatSimulatorTest/Test/" target="_blank" class="text-blue-500 hover:underline">Simulator</a></p>
        <p data-lang-key="note_2" class="text-center w-full">{{ currentLang['note_2'] }} <span v-html="currentLang['note_2_2']"></span></p>
        <p data-lang-key="note_3" class="text-center w-full">{{ currentLang['note_3'] }}</p>
      </div>

      <!--左右布局-->
      <div class="two-column-container text-gray-700">
        <div class="left-column">
          <p data-lang-key="note_left_1" class="text-center">{{ currentLang['note_left_1'] }}</p>
          <p data-lang-key="note_left_2" class="text-center">{{ currentLang['note_left_2'] }}
            <button 
              @click="copyTemplateToClipboard('t1_sword')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_left_3" class="text-center">{{ currentLang['note_left_3'] }}
            <button 
              @click="copyTemplateToClipboard('t1_flail')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>          
          <p data-lang-key="note_left_4" class="text-center">{{ currentLang['note_left_4'] }}
            <button 
              @click="copyTemplateToClipboard('t1_spear')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_left_5" class="text-center">{{ currentLang['note_left_5'] }}
            <button 
              @click="copyTemplateToClipboard('t1_bulwark')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_left_6" class="text-center">{{ currentLang['note_left_6'] }}
            <button 
              @click="copyTemplateToClipboard('t1_ranged_bow')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_bow_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t1_ranged_crossbow')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_crossbow_copy']}}</button>
          </p>
          <p data-lang-key="note_left_7" class="text-center">{{ currentLang['note_left_7'] }}
            <button 
              @click="copyTemplateToClipboard('t1_magic_nature')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_nature_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t1_magic_fire')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_fire_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t1_magic_water')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_water_copy']}}</button>
          </p>
          <p data-lang-key="note_left_8" class="text-center">{{ currentLang['note_left_8'] }}</p>
          <p data-lang-key="note_left_9" class="text-center">{{ currentLang['note_left_9'] }}</p>        </div>
        <div class="right-column">
          <p data-lang-key="note_right_1" class="text-center">{{ currentLang['note_right_1'] }}</p>
          <p data-lang-key="note_right_2" class="text-center">{{ currentLang['note_right_2'] }}
            <button 
              @click="copyTemplateToClipboard('t2_sword')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_right_3" class="text-center">{{ currentLang['note_right_3'] }}
            <button 
              @click="copyTemplateToClipboard('t2_flail')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_right_4" class="text-center">{{ currentLang['note_right_4'] }}
            <button 
              @click="copyTemplateToClipboard('t2_spear')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_right_5" class="text-center">{{ currentLang['note_right_5'] }}
            <button 
              @click="copyTemplateToClipboard('t2_bulwark')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_quick_copy']}}</button>
          </p>
          <p data-lang-key="note_right_6" class="text-center">{{ currentLang['note_right_6'] }}
            <button 
              @click="copyTemplateToClipboard('t2_ranged_bow')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_bow_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t2_ranged_crossbow')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_crossbow_copy']}}</button>
          </p>
          <p data-lang-key="note_right_7" class="text-center">{{ currentLang['note_right_7'] }}
            <button 
              @click="copyTemplateToClipboard('t2_magic_nature')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_nature_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t2_magic_fire')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_fire_copy']}}</button>
            <button 
              @click="copyTemplateToClipboard('t2_magic_water')"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              style="padding: 4px 8px; font-size: 15px;"
              title="复制内容"
            >{{ currentLang['template_water_copy']}}</button>
          </p>
          <p data-lang-key="note_right_8" class="text-center">{{ currentLang['note_right_8'] }}</p>
          <p data-lang-key="note_right_9" class="text-center">{{ currentLang['note_right_9'] }}</p>
        </div>
      </div>

      <div class="mt-4 text-gray-700 px-8 flex-col items-center justify-center space-y-4">
        <p data-lang-key="note_down_1" class="text-center w-full">{{ currentLang['note_down_1'] }}</p>
        <br>
      </div>
      <div class="flex justify-center mt-2 mb-4 mb-2">
        <a href="/upload" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 upload-button" data-lang-key="upload_button">{{ currentLang['upload_button'] }}</a>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { mockSimulationData, fetchSimulationData } from '../data/simulationData.js';
import lang from '../data/lang.js';
import template_list from '../data/template.js';
// 创建响应式数据变量，初始值为模拟数据
const simulationData = ref(mockSimulationData);

// 状态管理
const currentLangCode = ref('zh');
const copyStatus = ref('');
const currentIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

// 为每个地图创建独立的选择状态
const selectedTier = ref(simulationData.value.map(() => 'T1'));

// 计算当前语言
const currentLang = computed(() => lang[currentLangCode.value]);

// 获取指定地图的过滤数据
const getFilteredData = computed(() => (mapIndex) => {
  const mapData = simulationData.value[mapIndex];
  if (!mapData) return [];
  const tier = selectedTier.value[mapIndex];
  
  const data = mapData.sim_result[tier] || [];
  // 按avg_time降序排序，处理"-"的情况
  return [...data].sort((a, b) => {
    const aTime = a.avg_time === "-" ? 1e5 : parseFloat(a.avg_time);
    const bTime = b.avg_time === "-" ? 1e5 : parseFloat(b.avg_time);
    return aTime - bTime;
  });
});

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
    // 为非空文本设置复制状态
    if (text.trim() !== '') {
      copyStatus.value = text;
      setTimeout(() => {
        copyStatus.value = '';
      }, 2000);
    } else {
      // 为空文本显示一个临时的特殊状态
      copyStatus.value = 'EMPTY_TEXT_COPIED';
      setTimeout(() => {
        copyStatus.value = '';
      }, 2000);
    }
  }).catch(err => {
    alert(currentLang.value['copy_failed'] + ': ' + err);
  });
};

//快速复制模板
const copyTemplateToClipboard = (text) => {
  const content = template_list[text];
  if (content) {
    copyToClipboard(content);
  }
};


// 移动到指定索引
const moveToIndex = (index) => {
  const itemCount = simulationData.value.length;
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

  const itemCount = simulationData.value.length;
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
onMounted(async() => {
  // 设置初始语言
  setLanguage('zh');
  // 更新箭头状态
  updateArrows();

  // 异步获取真实数据
  try {
    const realData = await fetchSimulationData();
    // 只有当获取到有效数据时才替换模拟数据
    if (Array.isArray(realData) && realData.length > 0) {
      simulationData.value = realData;
      // 更新选择状态以匹配新数据
      selectedTier.value = realData.map(() => 'T1');
      // 重置当前索引并更新滚动位置
      moveToIndex(0);
    }
  } catch (error) {
    console.error('加载真实数据时出错:', error);
    // 出错时继续使用模拟数据
  }

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
  background-color: rgba(133, 133, 133, 0.957);
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
  color: #666 !important;
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
  color: #6B7280 !important;
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
/* 全宽文本样式 */
.full-width-text {
  width: 100%;
  margin-bottom: 16px;
}

/* 两栏布局样式 */
.two-column-container {
  width: 100%;
  display: flex;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.left-column {
  width: 50%;
  padding-right: 16px;
  border-right: 1px solid #e5e7eb;
}

.right-column {
  width: 50%;
  padding-left: 16px;
}

/* 按钮容器样式 */
.button-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

/* 按钮样式 */
.upload-button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.upload-button:hover {
  background-color: #2563eb;
}
</style>