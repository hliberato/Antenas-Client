<template>
  <div v-if="$store.getters.isRepresentative">
    <div>
      <h3>
        Adicione mais informações ao projeto
      </h3>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        class="login-form"
        label-position="top"
      >
        <el-form-item label="Descrição completa" prop="completeDescription">
          <el-input
            v-model="form.completeDescription"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Descrição da tecnologia" prop="technologyDescription">
          <el-input
            v-model="form.technologyDescription"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <div class="justify-end d-flex mt-28">
          <el-button type="primary" @click="update()">
            Adicionar informações
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        completeDescription: '',
        technologyDescription: ''
      },
      rules: {
        completeDescription: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        technologyDescription: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  methods: {
    update () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          const completeDescription = this.form.completeDescription
          const technologyDescription = this.form.technologyDescription
          this.$store.dispatch('updateProject', { ...this.project, completeDescription, technologyDescription })
            .catch(err => this.$throwError(err))
            .finally(() => this.$store.commit('HIDE_LOADING'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
