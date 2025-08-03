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

    <h1 class="text-xl font-bold text-center mb-6">{{ currentLang.upload_title }}</h1>

    <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md my-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="character_name" class="block mb-2 font-bold">{{ currentLang.character_name }}</label>
          <input type="text" id="character_name" v-model="formData.character_name" required :placeholder="currentLang.character_name_placeholder"
                 class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label for="map" class="block mb-2 font-bold">{{ currentLang.map }}</label>
          <select id="map" v-model="formData.map" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="D1">D1</option>
            <option value="D2">D2</option>
            <option value="D3">D3</option>
            <option value="D4">D4</option>
          </select>
        </div>

        <div>
          <label for="difficulty" class="block mb-2 font-bold">{{ currentLang.difficulty }}</label>
          <select id="difficulty" v-model="formData.difficulty" required
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="T0">T0</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
          </select>
        </div>

        <div>
          <label for="avgTime" class="block mb-2 font-bold">{{ currentLang.avgTime }}</label>
          <input type="number" id="avgTime"  v-model="formData.avgTime" required :placeholder="currentLang.avgTime_placeholder"
                 class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label for="simulationData" class="block mb-2 font-bold">{{ currentLang.simulationData }}</label>
          <textarea id="simulationData" v-model="formData.simulationData" rows="10" required :placeholder="currentLang.simulationData_placeholder"
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"></textarea>
        </div>

        <div class="flex justify-center mt-6">
          <button type="submit" class="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300">
            {{ currentLang.submit_button }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import lang from '../data/lang.js';

// 状态管理
const currentLangCode = ref('zh');

// 表单数据
const formData = ref({
  gameId: '',
  map: '',
  difficulty: '',
  avgTime: '',
  simulationData: ''
});

// 计算当前语言
const currentLang = computed(() => lang[currentLangCode.value]);

// 切换语言
const setLanguage = (langCode) => {
  currentLangCode.value = langCode;
};



// 处理表单提交
const handleSubmit = () => {
  // 这里添加表单验证和提交逻辑
  console.log('表单数据：', formData.value);
  // 可以添加axios请求等逻辑
  alert(currentLang.value.submit_success);
};
</script>

<style scoped>
/* 基础样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 容器样式 */
.bg-gray-100 {
  background-color: #f3f4f6;
}

/* 标题样式 */
.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

/* 卡片样式 */
.max-w-3xl {
  max-width: 48rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.bg-white {
  background-color: #ffffff;
}

.p-6 {
  padding: 1.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.my-8 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* 表单样式 */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.block {
  display: block;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

/* 确保标签左对齐 */
label {
  text-align: left !important;
  display: block;
  margin-bottom: 0.5rem;
}

/* 输入框样式 */
.w-full {
  width: 100%;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.rounded-md {
  border-radius: 0.375rem;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  ring-width: 2px;
}

.focus\:ring-blue-500:focus {
  ring-color: #3b82f6;
}

/* 按钮样式 */
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.mt-6 {
  margin-top: 1.5rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.text-white {
  color: #ffffff;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}

.focus\:ring-2:focus {
  ring-width: 2px;
}

.focus\:ring-blue-400:focus {
  ring-color: #60a5fa;
}

.focus\:ring-opacity-75:focus {
  ring-opacity: 0.75;
}

.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* 底部链接样式 */
.mt-4 {
  margin-top: 1rem;
}

.text-gray-700 {
  color: #374151;
}

.text-left {
  text-align: left;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.text-blue-500 {
  color: #3b82f6;
}

.hover\:underline:hover {
  text-decoration: underline;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

/* 绝对定位元素样式 */
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
</style>