import Vue from 'vue'
import { Notification } from 'element-ui'

Notification.install = function (Vue, options) {
  Vue.prototype.$throwError = (err) => {
    const status = err.response.data.status
    const message = status === 401 ? 'E-mail ou senha incorretos.' : 'Houve uma falha de comunicação entre o servidor.'
    console.log()
    Notification({
      message,
      title: 'Ops!',
      position: 'bottom-right',
      type: 'error'
    })
  }
}

Vue.use(Notification)
