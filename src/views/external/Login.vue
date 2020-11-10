<template>
  <div class="external-login">
    <el-container>
      <el-header>
        <el-row justify="space-between">
          <el-col :span="12">
            <Logo variant="blue" />
          </el-col>
          <el-col :span="12" class="flex justify-end">
            <el-button type="primary">
              Cadastro
            </el-button>
            <el-button>
              Entrar
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="external-login__content">
        <el-row type="flex" justify="space-around" class="w100">
          <el-col :span="9">
            <h1 class="external-login__title">
              <div>Conectando</div>
              <div>
                os <strong class="highlight">melhores alunos</strong>
              </div>
              <div>
                às <strong class="highlight">melhores empresas</strong>
              </div>
            </h1>
            <img
              src="@/assets/images/business_deal.svg"
              alt="Pessoas fazendo negócio"
              class="external-login__image"
            >
          </el-col>
          <el-col :span="9">
            <LoginForm :sign-up="signUp" />
          </el-col>
        </el-row>

        <!-- <el-row
          :gutter="40"
          type="flex"
          class="h100"
          justify="space-between"
        >
          <el-col :span="12" class="flex justify-center align-center flex-column">
            <h1 class="external-login__title">
              <div>Conectando</div>
              <div>
                os <strong class="highlight">melhores alunos</strong>
              </div>
              <div>
                às <strong class="highlight">melhores empresas</strong>
              </div>
            </h1>
            <img
              src="@/assets/images/business_deal.svg"
              alt="Pessoas fazendo negócio"
              class="external-login__image"
            >
          </el-col>
          <el-col :span="12" class="flex justify-center align-center">
            <LoginForm :sign-up="signUp" />
          </el-col>
        </el-row> -->
      </el-main>
    </el-container>
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/element/_colors.scss';
.external-login {
  &__content {
    display: flex !important;
    justify-content: center;
    margin-bottom: 60px;
  }
  &__title {
    font-size: 2rem;
    font-weight: 300;
    .highlight {
      color: $--color-primary;
    }
  }
  &__image {
    width: 350px;
    max-width: 100%;
    margin-right: 1rem;
    margin-top: 2rem;
  }
}
</style>
