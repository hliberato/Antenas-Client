import http from '../helpers/Http'
import store from '../store/index'

const routeMap = {
    'STUDENT': '/student',
    'CADI': '/cadi',
    'REPRESENTATIVE': '/representative',
    'TEACHER': '/teacher'
};

export default {

    authenticateUser({ email, password }) {
        return http
            .post('/login', { email, password })
            .then(res => {
                localStorage.setItem('USER_ROLE', res.data.authorizations[0].name);
                localStorage.setItem('USER_ID', res.data.authorizations[0].id);
                store.commit('SET_CURRENT_USER', {
                    token: res.data.token,
                    user: {
                        name: res.data.name,
                        role: res.data.authorizations[0].name,
                        photo: res.data.photo,
                        id: res.data.id
                    }
                });
            }).catch(() => {
                alert("Login ou senha incorretos")
            });
    },

    registUser({ name, email, password, role, cpf, ra, city, company, telephone }) {
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
        };
        
        return http
            .post(routeMap[role], user)
            .then(() => {
                alert('Usuario criado')
            })
            .catch((error) => {
                if(error.response != null && error.response.status == 409) {
                    alert("Email duplicado")
                } else {
                    console.log(error)
                }
            })
    },

    getUserInfo() {
        const userRole = localStorage.getItem('USER_ROLE');
        const token = localStorage.getItem('token');

        return http
            .get(`user`)
            .then(res => {
                const user = res.data;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: token,
                    role: userRole
                };
            }).catch(() => {
                alert("Erro ao carregar informações do usuario")
            });
    },

    getTeacherUsers() {
        return http
            .get('/teacher')
            .then(res => {

                const teachers = res.data;

                return teachers.map(teacher => ({
                    id: teacher.id,
                    email: teacher.email,
                    name: teacher.name,
                    authorizations: teacher.authorizations[0].name
                }));
            }).catch(() => {
                this.$emit('errorEvent', 'Erro ao carregar informações do professor')
                alert("Erro ao carregar informações do professor")
            });
    },

    getStudentsUsers() {
        return http
            .get('/student')
            .then(res => {

                const students = res.data;

                return students.map(student => ({
                    id: student.id,
                    email: student.email,
                    name: student.name,
                    role: student.authorizations[0].name,
                    cpf: student.cpf,
                    city: student.city,
                    ra: student.ra,
                }));
            }).catch(() => {
                alert("Erro ao carregar informações do aluno")
            });
    },

    getUser() {
        return http
            .get(`user`)
            .then(res => {
                return res.data;
            }).catch(() => {
                alert("Erro ao carregar informações do usuario")
            });
    },
};