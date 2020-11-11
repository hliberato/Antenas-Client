import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// Pages

const External = () => import(/* webpackChunkName: "external-view" */ '@/views/external/External.vue')
const RegistrationInfo = () => import(/* webpackChunkName: "registration-info-view" */ '@/views/external/RegistrationInfo.vue')
const Container = () => import(/* webpackChunkName: "container-view" */ '@/views/app/Container.vue')
const Home = () => import(/* webpackChunkName: "home-view" */ '@/views/app/Home.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Landing',
    component: External,
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
