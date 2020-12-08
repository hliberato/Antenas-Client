import Vue from 'vue'
import ProjectService from '@/services/ProjectService.js'

export default {
  state: {
    projects: [],
    selectedProjectId: 0
  },
  mutations: {
    SET_PROJECTS (state, projects) {
      state.projects = projects.map(project => {
        const status = Vue.prototype.$getProjectStatus(project)
        const labelPhase = Vue.prototype.$getProjectLabelPhase(status, project)
        return { ...project, status, labelPhase }
      })
    },
    SET_SELECTED_PROJECT_ID (state, selectedProjectId) {
      state.selectedProjectId = selectedProjectId
    },
    CLEAR_PROJECTS (state) {
      state.projects = []
      state.selectedProjectId = 0
    },
    UPDATE_PROJECT (state, project) {
      const status = Vue.prototype.$getProjectStatus(project)
      const labelPhase = Vue.prototype.$getProjectLabelPhase(status, project)
      const index = state.projects.findIndex(item => item.id === project.id)
      Vue.set(state.projects, index, { ...project, status, labelPhase })
    },
    ADD_PROJECT (state, project) {
      const status = Vue.prototype.$getProjectStatus(project)
      const labelPhase = Vue.prototype.$getProjectLabelPhase(status, project)
      state.projects.unshift({ ...project, status, labelPhase })
    }
  },
  actions: {
    loadProjects ({ commit }) {
      commit('SHOW_LOADING')
      return new Promise((resolve, reject) => {
        ProjectService
          .getProjects()
          .then(projects => {
            commit('HIDE_LOADING')
            commit('SET_PROJECTS', projects)
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
          .finally(() => commit('HIDE_LOADING'))
      })
    },
    updateProject ({ commit }, project) {
      return new Promise((resolve, reject) => {
        ProjectService
          .updateProject(project)
          .then(res => {
            commit('UPDATE_PROJECT', res)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    closeProject ({ commit }, project) {
      return new Promise((resolve, reject) => {
        ProjectService
          .closeProject(project)
          .then(res => {
            commit('UPDATE_PROJECT', res)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    saveProject ({ commit }, project) {
      return new Promise((resolve, reject) => {
        ProjectService
          .addProject(project)
          .then(res => {
            commit('ADD_PROJECT', res)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    projects: state => state.projects,
    selectedProject: state => state.projects.find(p => p.id === state.selectedProjectId),
    availableFilters: state => [...new Set(state.projects.map(p => p.labelPhase))]
  }
}
