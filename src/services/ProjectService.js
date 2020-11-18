import http from '../helpers/Http'

export default {

  getProjects () {
    return http.get('/project')
      .then(res => res.data)
  },

  addProject (project) {
    return http.post('/project', project)
      .then(res => res.data)
  },

  updateProject (project, approved) {
    return http.post('/project/update', project)
      .then(res => res.data)
  },

  deleteProject (id) {
    return http.delete(`/project/${id}`)
  }
}
