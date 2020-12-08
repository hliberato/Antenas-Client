<template>
  <el-dialog
    class="medal-new"
    :title="(isNew ? 'Criar nova' : 'Editar') + ' medalha'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    width="40%"
  >
    <el-form
      ref="medalForm"
      v-loading="loading"
      :model="medalForm"
      :rules="rules"
      label-position="top"
      label-width="130px"
    >
      <el-row :gutter="24">
        <el-col :span="15">
          <el-form-item label="Nome" prop="name">
            <el-input
              v-model="medalForm.name"
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Descrição" prop="description">
            <el-input
              v-model="medalForm.description"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="9" class="d-flex justify-center mt-12">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-change="changePhoto"
            :auto-upload="false"
          >
            <MedalTemplate :medal="medalForm" />
          </el-upload>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="15">
          <el-form-item label="Categoria" prop="category">
            <el-select v-model="medalForm.category" class="w100">
              <el-option
                v-for="category in medalsCategories"
                :key="category"
                :label="category"
                :value="category"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="Cor" prop="color">
            <el-color-picker v-model="medalForm.color" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-alert
        :closable="false"
        type="success"
      >
        Clique  na prévia da medalha para alterar a imagem de fundo.
      </el-alert>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="loading" @click="dialogVisible = false">Cancelar</el-button>
      <el-button :loading="loading" type="primary" @click="createMedal">
        {{ isNew ? 'Criar' : 'Editar' }} medalha
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import MedalTemplate from '@/components/Medal/MedalTemplate'

export default {
  components: { MedalTemplate },
  props: {
    medal: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    return {
      medalForm: {
        name: '',
        description: '',
        category: '',
        picture: '',
        color: ''
      },
      rules: {
        name: required,
        description: required,
        category: required
      }
    }
  },
  computed: {
    ...mapGetters([
      'medalsCategories',
      'loading'
    ]),
    isNew () {
      return !(this.medal && this.medal.id)
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set (visible) {
        this.$emit('update:visible', visible)
      }
    }
  },
  watch: {
    dialogVisible (visible) {
      if (visible) {
        if (this.medal && this.medal.id) {
          this.medalForm = { ...this.medal }
        } else {
          this.medalForm = {
            name: '',
            description: '',
            category: '',
            picture: '',
            color: ''
          }
        }
      }
    }
  },
  methods: {
    createMedal () {
      this.$refs.medalForm.validate(valid => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          this.$store.dispatch('saveMedal', this.medalForm)
            .then(() => {
              this.$notify({
                title: 'Pronto!',
                message: 'Medalha salva com sucesso',
                type: 'success',
                position: 'bottom-right'
              })
            })
            .catch(err => this.$throwError(err))
            .finally(() => {
              this.dialogVisible = false
              this.$store.commit('HIDE_LOADING')
            })
        }
      })
    },
    editMedal (medal) {
      this.medalForm = { ...medal }
      this.dialogVisible = true
    },
    changePhoto (file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) this.$message.error('Imagem deve estar no formato JPG ou PNG.')
      if (!isLt2M) this.$message.error('Imagem não pode exceder 2 MB.')
      if (isJPG && isLt2M) {
        const reader = new FileReader()
        reader.onload = e => { this.medalForm.picture = e.target.result }
        reader.readAsDataURL(file.raw)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss">
.medal-new {
  .el-color-picker__trigger {
    min-width: 173px;
  }
  .el-alert__content {
    text-align: center;
    width: 100%;
  }
  .el-alert__description {
    font-size: .9rem !important;
  }
  .el-upload {
    text-align: inherit;
  }
}
</style>

<style lang="scss">
  .el-color-dropdown__value, .el-color-dropdown__link-btn {
    display: none !important;
  }
</style>
