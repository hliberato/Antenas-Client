<template>
  <div v-if="$store.getters.isCadi">
    <el-alert
      :closable="false"
      type="info"
    >
      <h3>
        Leia as especificações do projeto e decida-se se ele está apto a continuar:
      </h3>
      <div class="justify-end d-flex">
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
          icon="el-icon-check"
          @click="update(false)"
        >
          Aprovar
        </el-button>
      </div>
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

<style lang="scss" scoped>
</style>
