import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'vue-moment'

// Global components
import Notification from './components/Notification'

// Plugins
import vuetify from './plugins/vuetify.js'
import './plugins/element/element.js'
import './plugins/datetime.js'
import './plugins/loading.js'
import './plugins/utils.js'
import './plugins/fuse.js'

import { Loading } from 'element-ui'
Vue.prototype.$loading = Loading.service

// Register global components
Vue.component('Notification', Notification)
Vue.use(moment)

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
