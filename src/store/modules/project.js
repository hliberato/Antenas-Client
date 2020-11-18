import Vue from 'vue'
import ProjectService from '@/services/ProjectService.js'

export default {
  state: {
    projects: [],
    selectedProjectId: 0
  },
  mutations: {
    SET_PROJECTS (state, projects) {
      state.projects = state.projects.concat(projects)
    },
    SET_SELECTED_PROJECT_ID (state, selectedProjectId) {
      state.selectedProjectId = selectedProjectId
    },
    CLEAR_PROJECTS (state) {
      state.projects = []
      state.selectedProjectId = 0
    },
    UPDATE_PROJECT (state, project) {
      const index = state.projects.findIndex(item => item.id === project.id)
      Vue.set(state.projects, index, project)
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
      })
    },
    updateProject ({ commit }, project) {
      console.log('updating project')
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
    }
  },
  getters: {
    projects: state => state.projects,
    selectedProject: state => state.projects.find(p => p.id === state.selectedProjectId)
  }
}
