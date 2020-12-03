import http from '../helpers/Http'

export default {

  getTeam (projectId) {
    return http.get(`/team/${projectId}`)
      .then(res => res.data)
  },

  evaluate (teams) {
    return http.put('/team/evaluate', teams)
      .then(res => res.data)
  },

  addTeam (team) {
    return http.post('/team', team)
      .then(res => res.data)
  },

  updateTeam (team) {
    return http.put('/team', team)
      .then(res => res.data)
  },

  removeStudent (studentId) {
    return http.delete(`/team/${studentId}`)
  },

  getRoles () {
    return http.get('/team/roles')
      .then(res => res.data)
  },

  updateStudentTeam (team) {
    return http.put('/team/studentTeam', team)
      .then(res => res.data)
  }
}
