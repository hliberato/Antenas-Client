import Vue from 'vue'
import './plugins/vuetify.js'
import './plugins/datetime.js'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

Vue.config.productionTip = false

if (store.getters.isLoggedIn) {
  store.dispatch('loadCurrentUserInfo')
  .then(() => store.dispatch('loadProjects'));
}

new Vue({
  vuetify,
  router,
	store,
  render: h => h(App)
}).$mount('#app')
