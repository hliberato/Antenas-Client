import Vue from 'vue'
import MedalService from '@/services/MedalService.js'

export default {
  state: {
    medals: [],
    categories: [
      'Análise e Desenvolvimento de Sistemas',
      'Banco de Dados',
      'Gestão da Produção Industrial',
      'Logística',
      'Manufatura Avançada',
      'Manutenção de Aeronaves',
      'Projetos de Estruturas Aeronáuticas',
      'Outro'
    ]
  },
  mutations: {
    SET_MEDALS (state, medals) {
      state.medals = medals
    },
    CLEAR_MEDALS (state) {
      state.medals = []
    },
    UPDATE_MEDAL (state, medal) {
      Vue.set(state.medals, state.medals.findIndex(m => m.id === medal.id), medal)
    },
    ADD_MEDAL (state, medal) {
      state.medals.push(medal)
    }
  },
  actions: {
    loadMedals ({ commit }) {
      return new Promise((resolve, reject) => {
        MedalService
          .getMedals()
          .then(medals => {
            commit('SET_MEDALS', medals)
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    updateMedals ({ commit }, medal) {
      return new Promise((resolve, reject) => {
        MedalService
          .updateMedal(medal)
          .then(medal => {
            commit('UPDATE_MEDAL', medal)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    saveMedal ({ commit }, medal) {
      return new Promise((resolve, reject) => {
        MedalService
          .saveMedal(medal)
          .then(medal => {
            commit('ADD_MEDAL', medal)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    removeMedal ({ commit }, medal) {
      return new Promise((resolve, reject) => {
        MedalService
          .removeMedal(medal)
          .then(medal => {
            commit('ADD_MEDAL', medal)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    medals: state => state.medals,
    medalsCategories: state => state.categories,
    getMedalById: state => id => state.medals.find(m => m.id.toString() === id)
  }
}
