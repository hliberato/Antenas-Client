<template>
    <form class="login-form" @submit="proceed($event)">
        

        <h5 class="login-form__title">{{ getTitleMessage() }}</h5>
        
        <div  v-if="signUp">
            <v-select
                :items="roles1"
                label="Cargo"
                :item-text="'label'"
                :item-value="'value'"
                :rules="rules"
                v-model="role"
                id="rule1">
            </v-select>
        </div>
 
        <div class="login-form__field" v-if="role != '' && signUp">
            <v-text-field 
                v-model="name" 
                label="Nome completo" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role != '' || !signUp">
            <v-text-field 
                v-model="email" 
                label="E-mail" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role != '' || !signUp">
            <v-text-field 
                v-model="password" 
                label="Senha" 
                :rules="rules" 
                type="password"
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role != '' && signUp">
            <v-text-field 
                v-model="passwordConfirm" 
                label="Confirmação da senha" 
                :rules="rules" 
                type="password"
                hide-details="auto">
            </v-text-field>
        </div>
        
        <div class="login-form__field" v-if="role != '' && signUp">
            <v-text-field 
                v-model="cpf" 
                label="Cpf" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role == 'STUDENT' && signUp">
            <v-text-field 
                v-model="ra" 
                label="R.A" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role == 'STUDENT' && signUp">
            <v-text-field 
                v-model="city" 
                label="Cidade" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        <div class="login-form__field" v-if="role == 'REPRESENTATIVE' && signUp">
            <v-text-field 
                v-model="city" 
                label="Cidade" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>

        </div>
        <div class="login-form__field" v-if="role == 'REPRESENTATIVE' && signUp">
            <v-text-field 
                v-model="telephone" 
                label="Telefone" 
                :rules="rules" 
                hide-details="auto">
            </v-text-field>
        </div>
        
                
        <div class="login-form__field">
            <v-btn small color="#4472E9" type="submit" :disabled="!canProceed()" class="white--text">
                {{ button_text }}
            </v-btn>
        </div>
    </form>
</template>

<script>
import UserService from '@/services/UserService.js';


export default {
    name: 'LoginForm',
    props: {
        signUp: Boolean
    },
    components: {
    },
    computed: {
        button_text() {
            return this.signUp ? "Se cadastrar" : "Entrar";
        }
    },
    data() {
        return {
            justSignedUp: false,
            email: '',
            name: '',
            password: '',
            passwordConfirm: '',
            cpf: '',
            ra: '',
            city: '',
            company: '',
            telephone: '',
            role: '',
            roles: [ 'Aluno', 'Professor', 'Representante', 'CADI' ],
            roles1: [
                { value: 'STUDENT', label: 'Aluno'},
                { value: 'TEACHER', label: 'Professor'},
                { value: 'REPRESENTATIVE', label: 'Representante'},
                { value: 'CADI', label: 'CADI'},
            ],
            rules: [
                value => !!value || 'Campo obrigatório',
            ],
        };
    },
    methods: {
        getTitleMessage() {
            if (this.signUp) {
                return 'Faça seu cadastro na plataforma';
            }
            else if (this.justSignedUp) {
                return 'Cadastro realizado com sucesso! Entre na sua conta';
            }
            else {
                return 'Entre na sua conta';
            }
        },
        canProceed() {
            if (this.signUp) {
                return this.email && this.name && this.password && this.role;
            } else {
                return this.email && this.password;
            }
        },
        setSelected(value) {
            this.role = value  
        },
        proceed(event) {
            event.preventDefault();
            
            if (this.signUp) {
                if (this.passwordConfirm !== this.password) {
                    console.log(this.passwordConfirm)
                    console.log(this.password)
                    alert("As senhas não coincidem.");
                    return;
                }

                UserService
                    .registUser({
                        name: this.name,
                        password: this.password,
                        role: this.role,
                        email: this.email,
                        cpf: this.cpf,
                        ra: this.ra,
                        city: this.city,
                        company: this.company,
                        telephone: this.telephone
                    })
                    .then(() => this.justSignedUp = true)
                    .catch(() => {
                        this.$emit('errorEvent', 'Erro ao realizar o cadastro.')
                    });
            }
            else {
                UserService
                    .authenticateUser({
                        email: this.email,
                        password: this.password
                    })
                    .then(() => this.$router.push('/home'))
                    .catch(() => {
                        this.$emit('errorEvent', 'Erro ao realizar o cadastro.')
                    });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .login-form {
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);

        &__title {
            margin-bottom: 25px;
            font-size: 16px;
            font-weight: 400;
        }

        &__field {
            display: flex;
            justify-content: center;
            align-self: center;
            margin-bottom: 20px;
            width: 100%;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>