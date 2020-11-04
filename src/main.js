import Vue from 'vue'
import vuetify from './plugins/vuetify.js'
import './plugins/datetime.js'
import './plugins/loading.js'
import App from './App.vue'
import Notification from './components/Notification'

import router from './router'
import store from './store'

// import './scss/_reset.scss'
// import './scss/variables.scss'
// import './scss/_functions.scss'
// import './scss/_fonts.scss'
// import './scss/_global.scss'
// import './scss/_icons.scss'
// import './scss/_box.scss'

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
