import UserService from '@/services/UserService.js'

const authFromStorage = JSON.parse(localStorage.getItem('ANTENAS_AUTH')) || {}
const role = (authorizations) => {
  if (authorizations && authorizations.length) {
    return authorizations[0].name
  }
  return null
}

export default {
  state: {
    id: authFromStorage.id || null,
    email: authFromStorage.email || null,
    name: authFromStorage.name || null,
    photo: authFromStorage.photo || null,
    token: authFromStorage.token || null,
    role: role(authFromStorage.authorizations || null)
  },
  mutations: {
    SET_CURRENT_USER (state, auth) {
      auth = auth || {}
      state.id = auth.id || null
      state.email = auth.email || null
      state.name = auth.name || null
      state.photo = auth.photo || null
      if (auth.token && typeof auth.token === 'string') state.token = auth.token
      state.role = role(auth.authorizations || null)
      localStorage.setItem('ANTENAS_AUTH', JSON.stringify(state))
    },
    LOGOUT_CURRENT_USER (state) {
      state.id = null
      state.email = null
      state.name = null
      state.photo = null
      state.token = null
      state.role = null
      localStorage.removeItem('ANTENAS_AUTH')
    }
  },
  actions: {
    authenticateUser ({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        UserService.authenticateUser({
          email: credentials.email,
          password: credentials.password
        })
          .then(response => {
            commit('SET_CURRENT_USER', response.data)
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    loadCurrentUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        UserService.getUserInfo()
          .then(auth => {
            commit('SET_CURRENT_USER', auth)
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    }
  },
  getters: {
    userToken: (state) => state.token,
    isLoggedIn: (state) => !!state.token,
    isCadi: (state) => state.role === 'CADI',
    isStudent: (state) => state.role === 'STUDENT',
    isRepresentative: (state) => state.role === 'REPRESENTATIVE',
    isTeacher: (state) => state.role === 'TEACHER'
  }
}
