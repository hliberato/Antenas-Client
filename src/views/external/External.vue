<template>
  <div class="external-view">
    <el-container>
      <el-header height="40px">
        <el-row justify="space-between">
          <el-col :span="12">
            <Logo variant="blue" />
          </el-col>
          <el-col :span="12" class="justify-end d-flex">
            <el-button type="primary" @click="signUp = true">
              Cadastro
            </el-button>
            <el-button @click="signUp = false">
              Entrar
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="justify-center content d-flex">
        <el-row type="flex" justify="space-around" class="w100">
          <el-col :span="8" class="justify-center d-flex flex-column">
            <h1 class="title">
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
              class="image"
            >
          </el-col>
          <el-col :span="8">
            <el-card v-loading="$store.getters.loading" class="box-card">
              <transition name="fade">
                <div v-if="signUp" key="1">
                  <h2>{{ title }}</h2>
                  <RegisterForm @back-to-login="signUp = false" />
                </div>
                <div v-else key="2">
                  <h2>{{ title }}</h2>
                  <LoginForm />
                </div>
              </transition>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Logo from '@/components/Logo/Logo.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import RegisterForm from '@/components/Auth/RegisterForm.vue'

export default {
  components: {
    Logo,
    LoginForm,
    RegisterForm
  },
  data () {
    return {
      signUp: false
    }
  },
  computed: {
    title () {
      return this.signUp ? 'Novo cadastro' : 'Acesso ao sistema'
    }
  },
  mounted () {
    this.$store.commit('LOGOUT_CURRENT_USER')
    this.$store.commit('CLEAR_PROJECTS')
  }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/element/_colors.scss';

.external-view {
  .content {
    margin-bottom: 60px;
    align-items: center;
  }
  .title {
    font-size: 2rem;
    font-weight: 300;
    .highlight {
      color: $--color-primary;
    }
  }
  .image {
    width: 350px;
    max-width: 100%;
    margin-right: 1rem;
    margin-top: 2rem;
  }
  .el-card {
    margin-top: .5rem;
    text-align: center;
    max-width: 400px;
  }
  h2 {
    margin: .5rem 0 1rem;
  }
}
</style>
