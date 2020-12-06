<template>
  <div v-if="$store.getters.isTeacher" class="project-step-8">
    <el-alert
      :closable="false"
      title="Avalie e atribua medalhas aos alunos"
      type="info"
    >
      <el-button
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-steps :active="step" finish-status="success" simple>
        <el-step title="Criar medalha" icon="el-icon-medal" />
        <el-step title="Atribuir medalhas" icon="el-icon-medal-1" />
        <el-step title="Atribuir notas" icon="el-icon-notebook-2" />
      </el-steps>
      <el-row>
        <el-col v-if="step === 0 || step === 1" :span="10">
          <h3>Medalhas cadastradas</h3>

          <el-row>
            <div v-for="medal in medals" :key="medal.id" @click="currentMedal = medal">
              <el-row>
                <el-col :span="5">
                  <el-image
                    :src="medal.picture"
                    class="medal-image"
                  />
                </el-col>
                <el-col :span="19">
                  <div> {{ medal.name }} </div>
                  <div class="medal-description"> {{ medal.description }} </div>
                  <div> Criada dia </div> {{ medal.creationDate | moment("DD/MM/YYYY") }}
                </el-col>
              </el-row>
            </div>
          </el-row>
        </el-col>
        <el-col v-if="step === 0" :span="10">
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
            <el-form-item label="Categoria" prop="category">
              <el-select v-model="currentMedal.category" class="w100">
                <el-option
                  v-for="category in categoryList"
                  :key="category"
                  :label="category"
                  :value="category"
                />
              </el-select>
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
          <el-row>
            <el-col :span="5">
              <el-image
                :src="currentMedal.picture"
                class="medal-image"
              />
            </el-col>
            <el-col :span="19">
              <div> {{ currentMedal.name }} </div>
              <div class="medal-description"> {{ currentMedal.description }} </div>
              <div v-if="currentMedal.creationDate"> Criada dia </div>  {{ currentMedal.creationDate | moment("DD/MM/YYYY") }}
            </el-col>
          </el-row>
          <el-button @click="saveMedal()"> Salvar medalha </el-button>
        </el-col>
        <el-col v-if="step === 1" :span="10">
          <h3>Atribuiçao de medalhas</h3>
        </el-col>
      </el-row>
      <div v-if="step === 2" :span="10">
        <h3>avaliação</h3>
        <br>
        <div v-for="team in teams" :key="team.id">
          <h3> {{ team.name }} </h3>
          <el-row v-for="studentTeam in team.studentTeamList" :key="studentTeam.id">
            <el-col :span="24">
              {{ studentTeam.student.name }}
              <el-form
                ref="form"
                class="edit-project-setp-7"
                label-position="top"
                label-width="130px"
              >
                <el-row :gutter="10">
                  <el-col :span="5">
                    <el-form-item label="Proatividade" prop="proactivity">
                      <el-input v-model="studentTeam.evaluation.proactivity" type="number" min="0" max="5" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="Autonomia" prop="autonomy">
                      <el-input v-model="studentTeam.evaluation.autonomy" type="number" min="0" max="5" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="Colaboração" prop="collaboration">
                      <el-input v-model="studentTeam.evaluation.collaboration" type="number" min="0" max="5" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="Entrega de resultados" prop="resultsDeliver">
                      <el-input v-model="studentTeam.evaluation.resultsDeliver" type="number" min="0" max="5" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
          <hr>
        </div>
        <el-button @click="evaluate()"> Salvar </el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false"> Cancelar </el-button>
        <el-button icon="el-icon-back" circle @click="step = step > 0 ? step -= 1 : step" />
        <el-button icon="el-icon-right" circle @click="step = step < 2 ? step += 1 : step" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MedalService from '@/services/MedalService.js'
import TeamService from '@/services/TeamService'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false,
      medals: [],
      teams: [],
      step: 0,
      currentMedal: {
        name: '',
        id: '',
        description: '',
        picture: '',
        category: ''
      },
      categoryList: [
        'Análise e Desenvolvimento de Sistemas',
        'Banco de Dados',
        'Gestão da Produção Industrial',
        'Logística',
        'Manufatura Avançada',
        'Manutenção de Aeronaves',
        'Projetos de Estruturas Aeronáuticas',
        'Outro'
      ]
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  mounted () {
    this.getTeams()
  },
  methods: {
    evaluate () {
      this.$store.commit('SHOW_LOADING')
      TeamService.evaluate(this.teams)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    openDialog () {
      this.dialogVisible = true

      this.getTeams()

      MedalService.getMedals()
        .then(res => {
          this.medals = res
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
    },
    getTeams () {
      TeamService
        .getTeam(this.project.id)
        .then(teams => {
          this.teams = teams
          console.log(this.teams)
        })
    },
    saveMedal () {
      console.log('?')
      // this.$store.commit('SHOW_LOADING')
      MedalService
        .saveMedal(this.currentMedal)
        // .finally(() => this.$store.commit('HIDE_LOADING'))
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-step-8 {
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
  .medal-description {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
