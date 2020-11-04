import http from '../helpers/Http'
import store from '../store/index'

export default {

  getTeam (projectId) {
    return http.get(`/team/${projectId}`)
      .then(res => {
        return res.data
      }).catch(() => {
        alert('Ocorreu um erro ao carregar as equipes')
      })
  },

  addTeam (team, role) {
    return http.post(`/team/${role} `, team)
      .then(res => {
        alert('Equipe criada')
        return res.data
      })
      .catch(() => {
        console.log(team)
        alert('Ocorreu um erro ao criar a equipe')
      })
  },

  updateTeam (team) {
    if (store.getters.isStudent || store.getters.isTeacher) {
      http.put('/team', team)
        .then(() => {
          alert('Equipe atualizada')
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert('Este aluno já pertence a uma equpe.')
          } else {
            alert('Ocorreu um erro ao atualizar a equipe')
          }
        })
    } else {
      alert('Você não possui autorização para executar esta ação.')
    }
    return null
  },

  removeStudent (studentId) {
    if (store.getters.isStudent) {
      http.delete(`/team/${studentId}`)
        .then(() => {
          alert('Aluno excluido com sucesso')
        })
        .catch(() => {
          alert('Ocorreu um erro ao excluir')
        })
    } else {
      alert('Você não possui autorização para executar esta ação.')
    }
  }
}
