import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Global components
import Notification from './components/Notification'

// Plugins
import vuetify from './plugins/vuetify.js'
import './plugins/element/element.js'
import './plugins/datetime.js'
import './plugins/loading.js'

// Register global components
Vue.component('Notification', Notification)

Vue.config.productionTip = false

if (store.getters.isLoggedIn) {
  store.dispatch('loadCurrentUserInfo')
    .then(() => store.dispatch('loadProjects'))
}

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
