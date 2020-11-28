import http from '../helpers/Http'
import store from '@/store'

export default {
  authenticateUser (credentials) {
    return http.post('/login', {
      email: credentials.email,
      password: credentials.password
    })
  },

  registUser ({ name, email, password, role, cpf, ra, city, company, telephone }) {
    const user = {
      name,
      email,
      password,
      role,
      cpf,
      ra,
      city,
      company,
      telephone
    }
    return http.post(role.toLowerCase(), user).then(res => {
      return res.data
    })
  },

  getUserInfo () {
    return http
      .get('user')
      .then(res => {
        return res.data
      })
  },

  getTeacherUsers () {
    return http
      .get('/teacher')
      .then(res => {
        const teachers = res.data
        return teachers.map(teacher => ({
          id: teacher.id,
          email: teacher.email,
          name: teacher.name,
          authorizations: teacher.authorizations[0].name
        }))
      })
  },

  getStudentsUsers () {
    return http
      .get('/student')
      .then(res => {
        const students = res.data
        return students.map(student => ({
          id: student.id,
          email: student.email,
          name: student.name,
          role: student.authorizations[0].name,
          cpf: student.cpf,
          city: student.city,
          ra: student.ra
        }))
      })
  },

  getUser () {
    return http
      .get('user').then(res => {
        return res.data
      })
  },

  updateUser (user) {
    return http
      .put(`${store.getters.userRole}/update`, user).then(res => res.data)
  }
}
