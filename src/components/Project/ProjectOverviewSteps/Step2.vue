<template>
  <div v-if="$store.getters.isCadi">
    <h2>
      Leia as especificações do projeto e decida-se se ele está apto a continuar:
    </h2>
    <div class="d-flex justify-end">
      <el-button
        type="primary"
        icon="el-icon-close"
        @click="update (false)"
      >
        Aprovar
      </el-button>

      <el-button
        type="danger"
        icon="el-icon-check"
        @click="update (true)"
      >
        Rejeitar
      </el-button>
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
  methods: {
    update (refused) {
      this.$store.commit('SHOW_LOADING')
      this.project.refused = refused
      this.$store.dispatch('updateProject', this.project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/element/_colors.scss';
 h2 {
    color: $--color-primary;
    margin: 38px 0px 8px 0px;
  }
</style>
