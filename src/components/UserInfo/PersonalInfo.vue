<template>
  <div class="personal-info">
    <h2>Informações pessoais</h2>
    <el-form
      ref="form"
      v-loading="$store.getters.loading"
      :model="form"
      :rules="rules"
      class="login-form"
      label-position="top"
      label-width="130px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Nome completo" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="E-mail" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
        </el-col>
        <div v-if="$store.getters.isStudent">
          <el-col :span="5">
            <el-form-item label="RA" prop="ra">
              <el-input v-model="form.ra" v-mask="'#############'" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Cidade" prop="city">
              <el-input v-model="form.city" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="LinkedIn" prop="LinkedIn">
              <el-input v-model="form.linkedin" />
            </el-form-item>
          </el-col>
        </div>
        <div v-if="$store.getters.isRepresentative">
          <el-col :span="12">
            <el-form-item label="Empresa" prop="company">
              <el-input v-model="form.company" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Telefone" prop="telephone">
              <el-input v-model="form.telephone" v-mask="['(##) ####-####', '(##) #####-####']" />
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-form-item v-if="$store.getters.isStudent" label="Biografia" prop="biography">
        <el-input v-model="form.biography" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="Foto de perfil">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="changePhoto"
          :auto-upload="false"
        >
          <img v-if="form.photo" :src="form.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <div class="info">Formato JPG e PNG, tamanho máximo de 2 MB.</div>
      </el-form-item>
      <el-button type="primary" :disabled="buttonDisabled()" @click="update">
        Salvar
      </el-button>
    </el-form>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'
import { mask } from 'vue-the-mask'

export default {
  directives: { mask },
  components: {
  },
  props: {
    user: {
      type: Object,
      default () {
        return {
          name: '',
          email: '',
          ra: '',
          city: '',
          linkedIn: '',
          biography: '',
          photo: '',
          company: '',
          telephone: ''
        }
      }
    }
  },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    return {
      form: {
        name: '',
        email: '',
        ra: '',
        city: '',
        linkedin: '',
        biography: '',
        photo: ''
      },
      rules: {
        name: required,
        email: required,
        telephone: required,
        company: required
      }
    }
  },
  watch: {
    user (user) {
      if (user.id) this.form = user
    }
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')
      UserService.updateUser(this.user)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    changePhoto (file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) this.$message.error('Foto de perfil deve estar no formato JPG ou PNG.')
      if (!isLt2M) this.$message.error('Foto de perfil não pode exceder 2 MB.')
      if (isJPG && isLt2M) {
        const reader = new FileReader()
        reader.onload = e => { this.form.photo = e.target.result }
        reader.readAsDataURL(file.raw)
      }
      return isJPG && isLt2M
    },
    buttonDisabled () {
      let returnValue = this.form.name && this.form.email
      if (this.$store.getters.isRepresentative) {
        returnValue = returnValue && this.form.company && this.form.telephone
      }
      return !returnValue
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.personal-info {
  .info {
    margin-top: -14px;
    color: $--color-text-regular;
  }

  h2 {
    color: $--color-primary;
    margin-bottom: 30px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
