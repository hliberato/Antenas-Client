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
    role: authFromStorage.role || null
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
        UserService.authenticateUser(credentials)
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
    registerUser ({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        UserService.registUser(credentials)
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
            if (!auth) {
              reject(new Error())
            }
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
    userName: (state) => state.name,
    userId: (state) => state.id,
    userRole: (state) => state.role ? state.role.replace('ROLE_', '').toLowerCase() : undefined,
    userRoleDisplay: (state) => {
      switch (state.role) {
        case 'ROLE_CADI': return 'CADI'
        case 'ROLE_REPRESENTATIVE': return 'Representante'
        case 'ROLE_TEACHER': return 'Professor'
        case 'ROLE_STUDENT': return 'Aluno'
      } return ''
    },
    userPhoto: (state) => state.photo,
    userToken: (state) => state.token,
    isLoggedIn: (state) => !!state.token,
    isCadi: (state) => state.role === 'ROLE_CADI',
    isStudent: (state) => state.role === 'ROLE_STUDENT',
    isRepresentative: (state) => state.role === 'ROLE_REPRESENTATIVE',
    isTeacher: (state) => state.role === 'ROLE_TEACHER'
  }
}
