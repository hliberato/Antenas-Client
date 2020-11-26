<template>
  <div v-if="$store.getters.isTeacher" class="project-step-3">
    <el-alert
      :closable="false"
      title="É necessário iniciar o projeto para que fique visível para os alunos."
      type="info"
    >
      <el-button
        plain
        :type="project.open ? 'danger' : 'primary'"
        class="ml-16"
        :icon="project.open ? 'el-icon-close' : 'el-icon-check'"
        @click="update()"
      >
        {{ project.open ? 'Encerrar projeto' : 'Iniciar projeto' }}
      </el-button>
    </el-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  methods: {
    update () {
      const confirmMessage = this.project.open ? 'Tem certeza de que deseja encerrar o projeto? Ele ficará invisível para os alunos.' : 'Deseja iniciar o projeto?'
      this.$confirm(confirmMessage, 'Entrega', {
        confirmButtonText: this.project.open ? 'Sim, encerrar' : 'Sim, iniciar',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: this.project.open ? 'el-button--danger' : 'el-button--success'
      }).then(() => {
        this.$store.commit('SHOW_LOADING')
        const project = JSON.parse(JSON.stringify(this.project))
        project.open = !this.project.open
        this.$store.dispatch('updateProject', project)
          .catch(err => this.$throwError(err))
          .finally(() => this.$store.commit('HIDE_LOADING'))
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.project-step-3 {
  .el-alert__title {
    font-size: 1.17rem;
    color: $--color-text-regular;
  }
  .el-alert__description {
    margin-top: 24px;
    text-align: center;
  }
  .el-alert__content {
    padding: 20px;
    margin: auto;
  }
}
</style>
