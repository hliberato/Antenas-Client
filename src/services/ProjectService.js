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

  updateProject (project) {
    console.log('update')
    return http.put('/project', project)
      .then(res => res.data)
  },

  closeProject (project) {
    console.log('close')
    return http.put('/project/close', project)
      .then(res => res.data)
  },

  deleteProject (id) {
    return http.delete(`/project/${id}`)
  }
}
