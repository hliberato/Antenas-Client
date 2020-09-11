<template>
    <v-container class="login-form">
        <v-select
            :items="roles"
            label="Tipo de perfil"
            :rules="rules">
        </v-select>
    </v-container>
</template>

<script>
export default {
    name: 'Login',
    props: {
        signUp: Boolean
    },
    components: {
    },
    data() {
        return {
            justSignedUp: false,
            email: '',
            name: '',
            password: '',
            cpf: '',
            ra: '',
            city: '',
            company: '',
            telephone: '',
            role: '',
            roles: [ 'Aluno', 'Professor', 'Representante', 'CADI' ],
            rules: [
                value => !!value || 'Selecione uma opção.',
                // value => (value && value.length >= 3) || 'Min 3 characters',
            ],
        };
    },
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
        box-shadow: shadow-depth(2);
    }
</style>