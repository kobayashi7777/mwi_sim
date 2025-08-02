import { createRouter, createWebHistory } from 'vue-router';
import SimulationTable from '../components/SimulationTable.vue';
import Upload from '../components/Upload.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SimulationTable
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;