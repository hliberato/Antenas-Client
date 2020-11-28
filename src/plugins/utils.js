import Vue from 'vue'
import store from '@/store'
import { Notification } from 'element-ui'

const Utils = {}

Utils.install = function (Vue, options) {
  Vue.prototype.$throwError = (err) => {
    let message = 'Houve uma falha de comunicação com o servidor.'
    if (err && err.response && err.response.data) {
      switch (err.response.data.status) {
        case 401:
          message = err.response.data.path.includes('/login') ? 'E-mail ou senha incorretos.' : message
          break
        case 403:
          message = 'Conta inativa. Ative-a clicando no link em seu e-mail.'
          break
        case 409:
          message = 'E-mail já cadastrado.'
          break
      }
    }
    Notification({
      message,
      title: 'Ops!',
      position: 'bottom-right',
      type: 'error'
    })
  }

  Vue.prototype.$getProjectLabelPhase = (status, project) => {
    if (!status || !Object.keys(project).length) return ''
    if (['waiting', 'pending'].includes(status)) {
      if (project.progress === 5 && store.getters.isRepresentative && project.meeting.possibleDate.length === 0) {
        return `${store.getters.defaultPhases[project.progress]} - Aguardando CADI`
      } else if (project.progress === 5 && store.getters.isCadi && project.meeting.possibleDate.length > 0) {
        return `${store.getters.defaultPhases[project.progress]} - Aguardando representante`
      }
      return store.getters.defaultPhases[project.progress]
    } else if (project.refused) {
      return 'Recusado'
    } else {
      return 'Concluído'
    }
  }

  Vue.prototype.$getProjectStatus = (project) => {
    if (!Object.keys(project).length) return ''
    const isMeetingPhase = project.progress === 5
    const isRefused = project.refused
    const isConcluded = project.finished
    let isPending

    if (store.getters.isRepresentative) {
      isPending = project.progress === 3 || (isMeetingPhase && project.meeting.possibleDate.length > 0)
    } else if (store.getters.isCadi) {
      isPending = [2, 4, 6].includes(project.progress) || (isMeetingPhase && !project.meeting.address.zipCode)
    } else if (store.getters.isTeacher) {
      isPending = (project.progress === 7 && !project.open) || (project.open === false && project.progress === 8)
    } else if (store.getters.isStudent) {
      isPending = project.progress === 7 && project.open
    }

    if (isRefused) {
      return 'refused'
    } else if (isConcluded) {
      return 'concluded'
    } else if (isPending) {
      return 'pending'
    } else {
      return 'waiting'
    }
  }
}

Vue.use(Utils)
