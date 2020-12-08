import http from '../helpers/Http'

export default {
  getMedals () {
    return http
      .get('/medal')
      .then(res => res.data)
  },

  updateMedal () {
    return http
      .put('/medal')
      .then(res => res.data)
  },

  saveMedal (medal) {
    return http
      .post('/medal', medal)
      .then(res => res.data)
  },

  removeMedal (medal) {
    return http
      .delete('/medal', medal)
      .then(res => res.data)
  }
}
