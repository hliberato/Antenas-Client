import axios from 'axios'
import store from '../store/index'

// const isProduction = process.env.NODE_ENV === 'production';
// const baseUrl = 'http://localhost:8080'
const baseUrl = 'http://10.0.0.105:8080'
const http = axios.create({
  baseURL: `${baseUrl}/dev`,
  headers: {
    Accept: 'application/json',
    Content: 'application/json'
  }
})

http.interceptors.request.use(config => {
  const token = store.getters.userToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, Promise.reject)

export default http
