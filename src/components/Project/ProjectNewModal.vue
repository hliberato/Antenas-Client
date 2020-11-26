<template>
  <el-dialog
    title="Criar novo projeto"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="project"
      :rules="rules"
      label-position="top"
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
      <el-button :disabled="loading" @click="dialogVisible = false">Cancelar</el-button>
      <el-button :loading="loading" type="primary" @click="saveProject()">Criar projeto</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

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
      },
      rules: {
        title: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        shortDescription: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        notes: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'projectModal',
      'loading'
    ]),
    dialogVisible: {
      get () {
        return this.projectModal
      },
      set (bol) {
        this.$store.commit('SET_PROJECT_MODAL', bol)
      }
    }
  },
  methods: {
    saveProject () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          this.$store.dispatch('saveProject', this.project)
            .then(() => {
              this.$notify({
                title: 'Pronto!',
                message: 'Projeto salvo com sucesso',
                type: 'success',
                position: 'bottom-right'
              })
              this.project = {
                title: '',
                shortDescription: '',
                notes: ''
              }
              this.dialogVisible = false
            })
            .catch(err => this.$throwError(err))
            .finally(() => this.$store.commit('HIDE_LOADING'))
        }
      })
    }
  }
}
</script>
