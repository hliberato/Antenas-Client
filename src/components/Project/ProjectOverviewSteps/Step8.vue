<template>
  <div v-if="$store.getters.isTeacher" class="project-step-8">
    <el-alert
      :closable="false"
      title="Avalie e atribua medalhas aos alunos"
      type="info"
    >
      <el-button
        plain
        type="primary"
        class="ml-16"
        icon="el-icon-notebook-2"
        @click="openDialog()"
      >
        Avaliar alunos
      </el-button>
    </el-alert>

    <el-dialog
      title="Avaliação"
      :visible.sync="dialogVisible"
      finish-status="success"
      process-status="finish"
    >
      <el-steps :active="0" finish-status="success" simple>
        <el-step title="Criar medalha" icon="el-icon-medal" />
        <el-step title="Atribuir medalhas" icon="el-icon-medal-1" />
        <el-step title="Atribuir notas" icon="el-icon-notebook-2" />
      </el-steps>
      <el-row>
        <el-col :span="10">
          <h3>Medalhas cadastradas</h3>

          <el-row>
            <div v-for="medal in medals" :key="medal.id" @click="currentMedal = medal">
              <el-row>
                <el-col :span="5">
                  <v-img
                    :src="medal.picture"
                    class="medal-image"
                  />
                </el-col>
                <el-col :span="19">
                  <div> {{ medal.name }} </div>
                  <div> Conquista </div>
                </el-col>
              </el-row>
            </div>
          </el-row>
        </el-col>
        <el-col :span="10">
          <h3>Criar / Editar</h3>

          <el-form
            ref="form"
            v-loading="$store.getters.loading"
            class="edit-project-setp-7"
            label-position="top"
            label-width="130px"
          >
            <el-form-item label="Nome" prop="name">
              <el-input
                v-model="currentMedal.name"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="Descrição" prop="description">
              <el-input
                v-model="currentMedal.description"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="Imagem">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-change="changePhoto"
                :auto-upload="false"
              >
                <img v-if="currentMedal.picture" :src="currentMedal.picture" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="info">Formato JPG e PNG, tamanho máximo de 2 MB.</div>
            </el-form-item>
          </el-form>

          <h3> Visualização prévia: </h3>
        </el-col>
      </el-row>
      <div />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"> Cancelar </el-button>
        <el-button type="primary"> Avançar </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MedalService from '@/services/MedalService.js'

export default {
  data () {
    return {
      dialogVisible: false,
      medals: [],
      currentMedal: {
        name: '',
        id: '',
        description: '',
        picture: '',
        category: ''
      },
      courses: [
        'Análise e Desenvolvimento de Sistemas',
        'Banco de Dados',
        'Gestão da Produção Industrial',
        'Logística',
        'Manufatura Avançada',
        'Manutenção de Aeronaves',
        'Projetos de Estruturas Aeronáuticas'
      ]
    }
  },
  methods: {
    update (project) {
      this.$store.commit('SHOW_LOADING')
      this.$store.dispatch('updateProject', project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    openDialog () {
      this.dialogVisible = true

      MedalService.getMedals()
        .then(res => {
          this.medals = res
          console.log(this.medals)
        })
    },
    changePhoto (file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) this.$message.error('Foto de perfil deve estar no formato JPG ou PNG.')
      if (!isLt2M) this.$message.error('Foto de perfil não pode exceder 2 MB.')
      if (isJPG && isLt2M) {
        const reader = new FileReader()
        reader.onload = e => { this.currentMedal.picture = e.target.result }
        reader.readAsDataURL(file.raw)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-step-8 {
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
  .medal-image {
    width: 38px;
    border-radius: 20px;
  }
  .el-steps--simple {
    background-color: transparent ;
  }
  .el-dialog__body {
    padding: 0px 20px;
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .el-form-item__content {
    font-size: 10px;
    line-height: 20px;
  }
}
</style>
