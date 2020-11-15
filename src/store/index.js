import Vue from 'vue'
import Vuex from 'vuex'
import ProjectService from '@/services/ProjectService.js'
import 'vue-datetime/dist/vue-datetime.css'
import user from './modules/user'

Vue.use(Vuex)

const state = {
  loading: false,
  phases: {
    1: 'Cadastro Inicial',
    2: 'Avaliação Inicial',
    3: 'Cadastro Detalhado',
    4: 'Avaliação Detalhada',
    5: 'Reunião',
    6: 'Designar responsável',
    7: 'Entrega',
    8: 'Finalizado'
  },
  projects: [],
  selectedProject: null,
  teams: []
}

const mutations = {
  ADD_PROJECTS (state, projects) {
    state.projects = state.projects.concat(projects)
  },
  SELECT_PROJECT (state, projectId) {
    state.selectedProject = state.projects.filter(project => project.id === projectId)[0]
  },
  DESELECT_PROJECT (state) {
    state.selectedProject = null
  },
  SHOW_LOADING (state) {
    state.loading = true
  },
  HIDE_LOADING (state) {
    state.loading = false
  }
}

const actions = {
  loadProjects ({ commit }) {
    return new Promise((resolve, reject) => {
      ProjectService
        .getProjects()
        .then(projects => {
          commit('ADD_PROJECTS', projects)
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}

const getters = {
  loading: (state) => state.loading,
  defaultPhases: (state) => state.phases,
  projects: (state) => state.projects
}

const modules = {
  user
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules
})
