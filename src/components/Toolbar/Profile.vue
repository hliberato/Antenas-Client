<template>
    <a class="profile">
        <div class="profile__info">
            <v-row>
                <div>
                    <div class="profile__name">{{ user.name }}</div>
                    <div class="role-info">{{ getUserRole() }}</div>
                </div>
                <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

                <v-menu origin="center center" transition="scale-transition" bottom offset-y >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn class="white--text" icon v-bind="attrs" v-on="on">
                        <v-app-bar-nav-icon></v-app-bar-nav-icon>
                    </v-btn>
                    </template>

                    <v-list>
                        <v-list-item v-for="option in options_menu" :key="option" @click="click(option)" >
                            <v-list-item-title>{{ option }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-row>
        </div>
    </a>
</template>

<script>
export default {
    name: 'Profile',
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    data() {
        return {
            options_menu: ["Medalhas", "Dados Cadastrais", "Sair"]
        }
    },
    methods: {
        click(option) {
            if (option == "Sair") {
                this.$store.commit('LOGOUT_CURRENT_USER');
            this.$router.push('/');
            }
        },

        getUserRole() {
            if (this.$store.getters.isCadi) {
                return "CADI"
            } else if (this.$store.getters.isRepresentative) {
                return "Representante"
            } else if (this.$store.getters.isTeacher) {
                return "Professor"
            } else if (this.$store.getters.isStudent){
                return "Aluno"
            }
        }
    }
}
</script>

<style lang="scss">
    .v-btn__content  {
        text-transform: none;
        font-size: 100%;
        font-weight: 600;
    }

    .v-application {
        font-family: "Open Sans", "Work Sans", sans-serif !important;
    }

    .role-info {
        color: #848484;
        font-weight: 400;
        font-size: 12px;
    }

    .profile {
        text-decoration: none;
        display: flex;
        align-items: center;

        &__info {
            display: flex;
            flex-direction: column;
            text-align: right;
            color: #424242;
        }

        &__name {
            font-weight: 600;
            font-size: 16px;
            align-self: center;
        }

        &__logout {
            align-self: flex-end;
            margin-top: 4px;
            font-weight: 600;
        }
    }
</style>