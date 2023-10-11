// Composables
import { createRouter, createWebHistory } from 'vue-router'

function isAuthenticated() {
  return localStorage.getItem('username') !== null;
}

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
  },
  {
    path: '/signup',
    component: () => import('@/layouts/blank/Blank.vue'),
    children: [
      {
        path: '',
        name: 'Signup',
        component: () => import(/* webpackChunkName: "home" */ '@/views/SignUpView.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/blank/Blank.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LoginView.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/DashboardView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/' && !isAuthenticated()) {
    next('/signup');
  } else if (to.path === '/' && isAuthenticated()) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router
