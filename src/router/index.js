import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/login',
      redirect: '/auth/login'
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue')
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue')
    },
    {
      path: '/questions',
      name: 'questions',
      component: () => import('../views/Questions/Questions.vue')
    },
    {
      path: '/scenarios',
      name: 'scenarios',
      component: () => import('../views/Scenarios/Scenarios.vue')
    },
    {
      path: '/defense',
      name: 'defense',
      component: () => import('../views/Defense/Defense.vue')
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/Products/Products.vue')
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('../views/My/My.vue')
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('../views/Share/Share.vue')
    }
  ]
})

export default router
