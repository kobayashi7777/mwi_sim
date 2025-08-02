<template>
  <div class="upload-container">
    <h1>上传模拟数据</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="gameId">上传人游戏id</label>
        <input type="text" id="gameId" v-model="formData.gameId" required placeholder="请输入游戏ID">
      </div>

      <div class="form-group">
        <label for="map">地图</label>
        <select id="map" v-model="formData.map" required>
          <option value="">请选择地图</option>
          <option value="D1">D1</option>
          <option value="D2">D2</option>
          <option value="D3">D3</option>
          <option value="D4">D4</option>
        </select>
      </div>

      <div class="form-group">
        <label for="difficulty">难度</label>
        <select id="difficulty" v-model="formData.difficulty" required>
          <option value="">请选择难度</option>
          <option value="T0">T0</option>
          <option value="T1">T1</option>
          <option value="T2">T2</option>
        </select>
      </div>

      <div class="form-group">
        <label for="avgTime">平均耗时</label>
        <input type="number" id="avgTime" v-model="formData.avgTime" step="0.01" min="0" required placeholder="请输入平均耗时（最多2位小数）"
               @input="formatAvgTime">
      </div>

      <div class="form-group">
        <label for="simulationData">模拟数据</label>
        <textarea id="simulationData" v-model="formData.simulationData" rows="10" required placeholder="请输入模拟数据（2000+字符）"></textarea>
      </div>

      <button type="submit" class="submit-btn">上传</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 表单数据
const formData = ref({
  gameId: '',
  map: '',
  difficulty: '',
  avgTime: '',
  simulationData: ''
});

// 格式化平均耗时，保留2位小数
const formatAvgTime = () => {
  if (formData.value.avgTime) {
    formData.value.avgTime = parseFloat(formData.value.avgTime).toFixed(2);
  }
};

// 处理表单提交
const handleSubmit = () => {
  // 这里添加表单验证和提交逻辑
  console.log('表单数据：', formData.value);
  // 可以添加axios请求等逻辑
  alert('上传成功！');
};
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>