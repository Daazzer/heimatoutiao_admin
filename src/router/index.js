import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Index',
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')
  },
  {
    name: 'Index1',
    path: '/index',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')
  },
  {
    name: 'Index2',
    path: '/index.html',
    component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    name: 'NotFound',
    path: '*',
    component: () => import(/* webpackChunkName: "notFound" */ '@/views/NotFound.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 除了登录页，去其他页面都要验证 token
  const toRouteName = to.name
  const token = JSON.parse(localStorage.getItem('heimatoutiao_admin_userInfo') || '{}').token

  if (toRouteName !== 'Login' && !token && toRouteName !== 'NotFound') {
    Message.warning('你没有权限查看，请登录')
    next('/login')
  }
  next()
})

export default router
