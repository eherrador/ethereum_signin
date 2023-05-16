import { createWebHashHistory, createRouter } from 'vue-router';

import Login from './components/Login.vue';
import Logout from './components/Logout.vue';

const history = createWebHashHistory();

const routes = [
  {
    path: '/logout',
    component: Logout,
  },
  {
    path: '/login',
    component: Login,
  },
];
const router = createRouter({
    history,
    routes,
});
export default router;