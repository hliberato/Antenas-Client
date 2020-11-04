import Vue from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.use(Loading, {
  color: '#4472e9',
  blur: '0px',
  backgroundColor: '#000000',
  lockScroll: true
})
