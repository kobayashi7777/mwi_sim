<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const name = ref('Unknown')

const test_api = async () => {
  try {
    const res = await fetch('/api/test')
    const data = await res.json()
    console.log(data);
  } catch (error) {
    console.error('API call failed:', error)
  }
}
const test_db = async () => {
  try {
    const res = await fetch('/api/db-test')
    const data = await res.json()
    console.log(data);
  } catch (error) {
    console.error('DB test failed:', error)
  }
}
const test_get_sim = async () => {
  try {
    const res = await fetch('/api/simulation-data')
    const data = await res.json()
    console.log(data);
  } catch (error) {
    console.error('get data failed:', error)
  }
}

</script>

<template>

  <div>
    <h1>API Test 在app.vue里记得删</h1>
    <button @click="test_api">Test API</button>
    <button @click="test_db">Test DB</button>
    <button @click="test_get_sim">Test get data</button>
  </div>


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
