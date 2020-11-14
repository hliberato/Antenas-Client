<template>
  <el-form ref="form" :model="form" :rules="rules" class="register-form">
    <div v-if="step === 1 && !finished">
      <el-form-item label="Cargo" prop="role">
        <el-select v-model="form.role" class="w100">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="form.role !== ''">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="form.name" @keyup.enter.native="submitForm" />
        </el-form-item>
        <el-form-item label="CPF" prop="cpf">
          <el-input v-model="form.cpf" v-mask="'###.###.###-##'" @keyup.enter.native="submitForm" />
        </el-form-item>
        <el-form-item v-if="isStudent" label="RA" prop="ra">
          <el-input v-model="form.ra" v-mask="'#############'" @keyup.enter.native="submitForm" />
        </el-form-item>
        <el-form-item v-if="isStudent || isRepresentative" label="Cidade" prop="city">
          <el-input v-model="form.city" @keyup.enter.native="submitForm" />
        </el-form-item>
        <el-form-item v-if="isRepresentative" label="Telefone" prop="telephone">
          <el-input v-model="form.telephone" v-mask="['(##) ####-####', '(##) #####-####']" @keyup.enter.native="submitForm" />
        </el-form-item>
      </div>
    </div>
    <div v-else-if="step === 2 && !finished">
      <el-form-item label="E-mail" prop="email">
        <el-input v-model="form.email" @keyup.enter.native="submitForm" />
      </el-form-item>
      <el-form-item label="Senha" prop="password">
        <el-input v-model="form.password" type="password" @keyup.enter.native="submitForm" />
      </el-form-item>
      <el-form-item label="Confirme a senha" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" @keyup.enter.native="submitForm" />
      </el-form-item>
    </div>
    <div v-else>
      <h2>
        BOA MERMÃO! <br>
        ENVIAMO E-MAIL PROCÊ LÁ <br>
        QUE EMAIL? ESSE, JUMENTO: <i>{{ form.email }}</i><br>
        VAI MANO!
      </h2>
      <el-button type="primary" class="w100" @click="$emit('back-to-login')">
        Ir para Login
      </el-button>
    </div>
    <div v-if="!finished" class="d-flex">
      <el-button v-if="step === 2" type="text" @click="step = 1">
        Voltar
      </el-button>
      <el-button type="primary" class="w100" @click="submitForm">
        {{ step === 1 ? 'Avançar' : 'Cadastrar' }}
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: { mask },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value !== this.form.password) callback(new Error('Confirmação diferente de senha'))
      else callback()
    }
    return {
      step: 1,
      finished: false,
      roles: [
        { value: 'STUDENT', label: 'Aluno' },
        { value: 'TEACHER', label: 'Professor' },
        { value: 'REPRESENTATIVE', label: 'Representante' },
        { value: 'CADI', label: 'CADI' }
      ],
      form: {
        role: 'STUDENT',
        name: '',
        email: '',
        cpf: '',
        ra: '',
        city: '',
        telephone: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        role: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submmit' },
          { type: 'email', message: 'Insira um e-mail válido', trigger: 'submmit' }
        ],
        cpf: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        ra: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        city: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        telephone: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        password: [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }],
        confirmPassword: [
          { required: true, message: 'Campo obrigatório', trigger: 'submmit' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isStudent () {
      return this.form.role === 'STUDENT'
    },
    isRepresentative () {
      return this.form.role === 'REPRESENTATIVE'
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.step === 1) {
            this.step = 2
          } else {
            this.$store.commit('SHOW_LOADING')
            this.$store.dispatch('registerUser', this.form)
              .then(() => this.$router.push('/home'))
              .catch(err => this.$throwError(err))
              .finally(() => this.$store.commit('HIDE_LOADING'))
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-form {
  overflow-wrap: break-word;
  .el-button {
    margin: 1.5rem 0 .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    & + .el-button {
      margin-left: 1rem;
    }
  }
}
</style>
