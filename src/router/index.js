import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Landing from '../views/external/Login.vue'
import Container from '../views/app/Container.vue'
import Home from '../views/app/Home.vue'
import RegistrationInfo from '../views/external/RegistrationInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Landing',
    component: Landing,
    meta: {
      public: true
    }
  },
  {
    path: '/',
    component: Container,
    meta: {
      public: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          public: false
        }
      }
    ]
  },
  {
    path: '/dados-cadastrais',
    name: 'Dados cadastrais',
    component: RegistrationInfo,
    meta: {
      public: false
    }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.public && !store.getters.isLoggedIn) {
    return next({ path: '/auth' })
  } else if (to.meta.public && store.getters.isLoggedIn) {
    return next({ path: '/' })
  }

  next()
})

export default router
