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
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  methods: {
    update (refused) {
      const project = JSON.parse(JSON.stringify(this.project))
      if (refused) {
        this.$prompt('* Informe o motivo da recusa', 'Avaliação Inicial', {
          confirmButtonText: 'Rejeitar',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: 'el-button--danger',
          inputPattern: /([^\s])/,
          inputErrorMessage: 'Campo obrigatório'
        }).then(({ value }) => {
          project.refused = true
          project.reason = value
          this.dispatchUpdate(project)
        })
      } else {
        this.$confirm('Tem certeza que deseja continuar?', 'Avaliação Inicial', {
          confirmButtonText: 'Aprovar',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: 'el-button--success'
        }).then(() => {
          project.refused = false
          this.dispatchUpdate(project)
        })
      }
    },
    dispatchUpdate (project) {
      this.$store.commit('SHOW_LOADING')
      this.$store.dispatch('updateProject', project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
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
