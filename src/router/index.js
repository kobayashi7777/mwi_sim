import { createRouter, createWebHistory } from 'vue-router'
import SimulationTable from '../views/SimulationTable.vue'
import Upload from '../views/Upload.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SimulationTable,
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
    },
  ],
})

export default router
