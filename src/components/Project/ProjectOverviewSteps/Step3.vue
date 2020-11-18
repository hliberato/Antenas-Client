<template>
  <div v-if="$store.getters.isRepresentative">
    <div>
      <h3>
        Adicione mais informações ao projeto
      </h3>
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        class="login-form"
        label-position="top"
        label-width="130px"
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
        <div class="justify-end d-flex">
          <el-button
            plain
            type="success"
            @click="update(false)"
          >
            Salvar
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
      }
    }
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')
      this.project.completeDescription = this.form.completeDescription
      this.project.technologyDescription = this.form.technologyDescription
      this.$store.dispatch('updateProject', this.project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
