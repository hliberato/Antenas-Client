import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'
import 'vue-datetime/dist/vue-datetime.css'

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
  teams: []
}

const mutations = {
  SHOW_LOADING (state) {
    state.loading = true
  },
  HIDE_LOADING (state) {
    state.loading = false
  }
}

const getters = {
  loading: (state) => state.loading,
  defaultPhases: (state) => state.phases
}

const modules = {
  user,
  project
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules
})
