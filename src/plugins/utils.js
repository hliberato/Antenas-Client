import Vue from 'vue'
import store from '@/store'
import { Notification } from 'element-ui'

const Utils = {}

Utils.install = function (Vue, options) {
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

  Vue.prototype.$getProjectLabelPhase = (status, project) => {
    console.log('.')
    if (!status || !Object.keys(project).length) return ''
    if (['waiting', 'pendinggit'].includes(status)) {
      if (project.progress === 5 && store.getters.isRepresentative && this.project.meeting.possibleDate.length === 0) {
        return `${store.getters.defaultPhases[project.progress]} - Aguardando informações.`
      } else if (project.progress === 5 && store.getters.isCadi && this.project.meeting.possibleDate.length > 0) {
        return `${store.getters.defaultPhases[project.progress]} (Aguardando representante)`
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
    let hasMeeting = false
    if (project.meeting != null) {
      hasMeeting = project.meeting.chosenDate !== null
    }
    const isMeetingPhase = project.progress === 5
    const isRefused = project.refused
    const isDeliveryPhase = project.progress === 6
    const isConcluded = project.finished
    let isWaiting
    if (store.getters.isRepresentative) {
      isWaiting = project.progress === 3 || (isMeetingPhase && !hasMeeting && project.meeting.possibleDate.length)
    } else if (store.getters.isCadi) {
      isWaiting = [2, 4].includes(project.progress) || (isMeetingPhase && !project.meeting.chosenDate) || (isDeliveryPhase && !project.teacher)
    } else if (store.getters.isTeacher) {
      isWaiting = !!isDeliveryPhase
    } else if (store.getters.isStudent) {
      isWaiting = isDeliveryPhase && !project.deliver.some(entrega => entrega.students.includes(store.state.user.id))
    }
    if (isRefused) {
      return 'refused'
    } else if (isConcluded) {
      return 'concluded'
    } else if (isWaiting) {
      return 'waiting'
    } else {
      return 'pending'
    }
  }
}

Vue.use(Utils)
