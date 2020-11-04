<template>
  <div class="landing">
    <div class="landing__wrapper">
      <header class="landing__header">
        <Logo variant="blue" />
        <div class="actions">
          <v-btn
            small
            color="#4472E9"
            class="mr-5 white--text"
            @click="goSignUp()"
          >
            Cadastrar
          </v-btn>

          <v-btn
            small
            color="white"
            class="custom-blue--text"
            @click="goLogin()"
          >
            Entrar
          </v-btn>
        </div>
      </header>

      <div class="landing__body">
        <div class="landing__info">
          <h3 class="title">
            <span>Conectando</span>
            <span class="big">
              os <strong class="strong">melhores alunos</strong>
            </span>
            <span class="big">
              às <strong class="strong">melhores empresas</strong>
            </span>
          </h3>

          <img
            class="illustration"
            src="@/assets/images/business_deal.svg"
            alt="Pessoas fazendo negócio"
          >
        </div>
        <LoginForm
          :sign-up="signUp"
          class="landing__login"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo/Logo.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'

export default {
  name: 'Landing',
  components: {
    Logo,
    LoginForm
  },
  data () {
    return {
      signUp: true
    }
  },
  methods: {
    goLogin () {
      this.signUp = false
    },
    goSignUp () {
      this.signUp = true
    }
  }
}
</script>

<style lang="scss" scoped>
    .custom-blue--text {
        color: #4472E9
    }

    .strong {
        font-weight: 600 !important;
    }

  .landing {

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100px;

        .actions {
            display: flex;

            .button {
                margin-right: 16px;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    &__body {
        display: flex;
        justify-content: space-between;
        margin-top: 35px;
    }

    &__login {
        align-self: flex-start;
    }

    &__info {
        .title {
            display: flex;
            flex-direction: column;
            line-height: 2em;
            font-size: 24px;
            font-weight: 300;

            strong {
                font-weight: 300;
                color: #4472E9;
            }

            .big {
                font-size: 29px;
            }
        }

        .illustration {
            margin-top: spacing(6);
            max-width: 300px;
        }
    }

    &__wrapper {
      max-width: 1080px;
      width: 90%;
      margin: 0 auto;
    }
  }
</style>
