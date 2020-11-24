<template>
  <div v-if="$store.getters.isCadi && !project.refused" class="project-step-2">
    <el-alert
      :closable="false"
      title="Leia as especificações do projeto e decida-se se ele está apto a continuar:"
      type="info"
    >
      <el-button
        plain
        type="danger"
        icon="el-icon-close"
        @click="update(true)"
      >
        Rejeitar
      </el-button>
      <el-button
        plain
        type="success"
        class="ml-16"
        icon="el-icon-check"
        @click="update(false)"
      >
        Aprovar
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
      this.$confirm('Tem certeza que deseja continuar?', 'Avaliação Inicial', {
        confirmButtonText: refused ? 'Rejeitar' : 'Aprovar',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: refused ? 'el-button--danger' : 'el-button--success'
      }).then(() => {
        this.$store.commit('SHOW_LOADING')
        this.project.refused = refused
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

.project-step-2 {
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
