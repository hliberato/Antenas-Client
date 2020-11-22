<template>
  <div v-if="$store.getters.isTeacher" class="project-step-3">
    <el-alert
      :closable="false"
      title="É necessário iniciar o projeto para que fique visível para os alunos."
      type="info"
    >
      <el-button
        plain
        type="primary"
        class="ml-16"
        icon="el-icon-check"
        @click="update(false)"
      >
        {{ project.open ? 'Encerrar projeto' : 'Iniciar projeto'}}
      </el-button>
    </el-alert>
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
  methods: {
    update (refused) {
      const confirmMessage = !this.project.open ? 'Deseja iniciar o projeto?' : 'Tem certeza de que deseja encerrar o projeto? Ele ficará invisível para os alunos.'
      this.$confirm(confirmMessage, 'Entrega', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        confirmButtonClass: 'el-button--success'
      }).then(() => {
        this.$store.commit('SHOW_LOADING')
        this.project.open = !this.project.open
        this.$store.dispatch('updateProject', this.project)
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
