<template>
  <el-dialog
    title="Criar novo projeto"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form
      ref="form"
      v-loading="$store.getters.loading"
      class="login-form"
      label-position="top"
      label-width="130px"
    >
      <el-form-item label="Título" prop="title">
        <el-input v-model="project.title" maxlength="30" show-word-limit />
      </el-form-item>
      <el-form-item label="Resumo" prop="shortDescription">
        <el-input
          v-model="project.shortDescription"
          type="textarea"
          :rows="4"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="Notas adicionais (materiais de apoio)" prop="notes">
        <el-input
          v-model="project.notes"
          type="textarea"
          :rows="4"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
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
  data () {
    return {
      project: {
        title: '',
        shortDescription: '',
        notes: ''
      }
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
