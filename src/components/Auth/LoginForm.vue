<template>
  <el-form ref="form" :model="form" :rules="rules" class="login-form">
    <el-form-item label="E-mail" prop="email">
      <el-input v-model="form.email" @keyup.enter.native="submitForm" />
    </el-form-item>
    <el-form-item label="Senha" prop="password">
      <el-input v-model="form.password" type="password" @keyup.enter.native="submitForm" />
    </el-form-item>
    <el-button type="primary" class="w100" @click="submitForm">
      Entrar
    </el-button>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submmit' },
          { type: 'email', message: 'Insira um e-mail válido', trigger: 'submmit' }
        ],
        password: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          this.$store.dispatch('authenticateUser', this.form)
            .then(() => this.$router.push('/home'))
            .catch(err => this.$throwError(err))
            .finally(() => this.$store.commit('HIDE_LOADING'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-form {
  .el-button {
    margin: 1.5rem 0 .5rem;
  }
}
</style>
