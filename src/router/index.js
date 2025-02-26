import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView,
    },
  ],
})

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  // Allow access to login page
  if (to.path === '/login') {
    next()
    document.title = 'MapScout Login'
    return
  }
  
  // Check if team and event are in localStorage
  const team = localStorage.getItem('team')
  const event = localStorage.getItem('event')
  
  // If either is missing, redirect to login
  if (!team || !event) {
    next('/login')
    return
  }
  
  // Otherwise proceed normally
  next()
  document.title = 'MapScout'
})

export default router
