import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'
import medals from './modules/medals'
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(Vuex)

const state = {
  loading: false,
  teams: [],
  projectModal: false,
  phases: {
    1: 'Cadastro Inicial',
    2: 'Avaliação Inicial',
    3: 'Cadastro Detalhado',
    4: 'Avaliação Detalhada',
    5: 'Reunião',
    6: 'Designar professor',
    7: 'Entrega',
    8: 'Avaliação dos alunos',
    9: 'Finalizado'
  }
}

const mutations = {
  SHOW_LOADING (state) {
    state.loading = true
  },
  HIDE_LOADING (state) {
    state.loading = false
  },
  SET_PROJECT_MODAL (state, bol) {
    state.projectModal = bol
  }
}

const getters = {
  loading: (state) => state.loading,
  defaultPhases: (state) => state.phases,
  projectModal: (state) => state.projectModal
}

const modules = {
  user,
  project,
  medals
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules
})
