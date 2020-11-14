import Vue from 'vue'
import { Notification } from 'element-ui'

Notification.install = function (Vue, options) {
  Vue.prototype.$throwError = (err) => {
    let message
    switch (err.response.data.status) {
      case 401:
        message = 'E-mail ou senha incorretos.'
        break
      case 403:
        message = 'Conta inativa. Ative-a clicando no link em seu e-mail.'
        break
      case 409:
        message = 'E-mail já cadastrado.'
        break
      default:
        message = 'Houve uma falha de comunicação entre o servidor.'
    }
    Notification({
      message,
      title: 'Ops!',
      position: 'bottom-right',
      type: 'error'
    })
  }
}

Vue.use(Notification)
