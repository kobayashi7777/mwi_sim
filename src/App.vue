mwi.svg<script setup>
// 移除直接引入的SimulationTable组件
// import SimulationTable from './components/SimulationTable.vue'
</script>

<template>
  <div class="app-container">
    <!-- 添加router-view组件，让Vue Router处理路由渲染 -->
    <router-view/>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
