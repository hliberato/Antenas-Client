import http from '../helpers/Http'
import store from '../store/index'

export default {

    getProjects() {
        return http
            .get('/project')
            .then(res => {
                return this.formatProject(res.data)
            }).catch(() => {
                alert("Ocorreu um erro ao carregar os dados da pagina.")
            });
    },


    getProjectById(id) {
        return http
            .get(`/project/${id}`)
            .then(res => {
                return this.formatProject(res.data);
            }).catch(() => {
                alert("Ocorreu um erro ao carregar os dados da pagina.")
            });
    },

    formatProject(projects) {
        let defaulProject = {
            meeting: {
                address: {
                    place: '',
                    number: '',
                    street: '',
                    neighborhood: '',
                    city: '',
                    zipCode: ''
                },
                chosenDate: null,
                possibleDate: [],
            },
        }

        if (Array.isArray(projects)) {
            projects.forEach(project => {
                if (project.meeting == null) {
                    project.meeting = defaulProject.meeting;
                }

                if (project.students == null) {
                    project.students = [];
                }
            });
        } else {
            if (projects.meeting == null) {
                projects.meeting = defaulProject.meeting;
            }

            if (projects.students == null) {
                projects.students = defaulProject.students;
            }
        }

        return projects;
    },

    addProject(project) {
        return http.post('/project', project)
            .then(res => {
                return res.data;
            });
    },

    updateProject(project, approved) {
        return new Promise(resolve => {
            if (store.getters.isCadi && [2, 4].includes(project.progress)) {
                project.refused = !approved;

                if (approved) {
                    project.progress = project.progress + 1;
                }
            }

            if (store.getters.isRepresentative && project.progress === 3) {
                project.progress = 4;
            }
            
            http.post("/project/update", project)
                .then(() => {
                    alert("Projeto atualizado com sucesso")
                }).catch(() => {
                    alert("Ocorreu um erro ao atualizar o projeto")
                });
            resolve(project);
        });
    },

    deleteProject(id) {
        return http
            .delete(`/project/${id}`)
            .then(() => {
                alert("Projeto excluído com sucesso")
            }).err(() => {
                alert("O projeto não pôde ser excluido.")
            })
    },

};