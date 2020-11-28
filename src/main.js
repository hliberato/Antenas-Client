import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'vue-moment'
import HighchartsVue from 'highcharts-vue'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'

// Plugins
import './plugins/element.js'
import './plugins/datetime.js'
import './plugins/loading.js'
import './plugins/utils.js'
import './plugins/fuse.js'

import 'reset-css'
import './styles/index.scss'

import { Loading } from 'element-ui'
Vue.prototype.$loading = Loading.service

// Register global components
Vue.component('Notification', Notification)
Vue.use(moment, HighchartsVue, VueHighcharts, { Highcharts })
highchartsMore(Highcharts)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
