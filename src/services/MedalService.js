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

  saveMedal () {
    return http
      .set('/medal')
      .then(res => res.data)
  }
}
