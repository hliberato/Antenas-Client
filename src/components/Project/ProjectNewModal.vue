<template>
  <el-dialog
    title="Criar novo projeto"
    :visible.sync="dialogVisible"
    width="50%"
  >
    CONTEÚDO
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Cancelar</el-button>
      <el-button type="primary" @click="dialogVisible = false">Criar</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.$store.getters.projectModal
      },
      set (bol) {
        this.$store.commit('SET_PROJECT_MODAL', bol)
      }
    }
  }
}
</script>
