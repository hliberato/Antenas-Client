import http from '../helpers/Http'

export default {
  getMedals () {
    return http
      .get('/medal').then(res => {
        return res.data
      })
  }
}
