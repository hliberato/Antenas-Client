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
    return http.post(role, user)
    // TODO mudar toda essa estrutura para quem o chama
    // .then(() => {
    //   alert('Usuario criado')
    // })
    // .catch((error) => {
    //   if (error.response !== null && error.response.status === 409) {
    //     alert('Email duplicado')
    //   } else {
    //     console.log(error)
    //   }
    // })
  },

  getUserInfo () {
    return http
      .get('user')
      .then(res => {
        return res.data
      }).catch(() => {
        alert('Erro ao carregar informações do usuario')
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
      }).catch(() => {
        this.$emit('errorEvent', 'Erro ao carregar informações do professor')
        alert('Erro ao carregar informações do professor')
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
      }).catch(() => {
        alert('Erro ao carregar informações do aluno')
      })
  },

  getUser () {
    return http
      .get('user')
      .then(res => {
        return res.data
      }).catch(() => {
        alert('Erro ao carregar informações do usuario')
      })
  },

  updateUser (user) {
    return http
      .post(`${store.getters.userRole}/update`, user)
      .then(res => {
        return res.data
      }).catch(() => {
        alert('Erro ao atualizar as informações')
      })
  }
}
