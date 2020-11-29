<template>
  <div class="profile">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-card class="profile-view h100" :shadow="'always'">
          <el-row>
            <el-col :span="6">
              <img class="image" :src="user.photo" alt="Flowers in Chania">
            </el-col>
            <el-col :span="18">
              {{ user.name }}
              <div> <i class="el-icon-location-outline" /> {{ user.city }} </div>
              <br>
              <div> {{ user.biography }} </div>
            </el-col>
          </el-row>
          <div>
            <i class="el-icon-trophy" />
            {{ user.completedProjects }} projetos concluídos
          </div>
          <div>
            <i class="el-icon-message" />
            {{ user.email }}
          </div>
          <div>
            <i class="el-icon-link" />
            {{ user.linkedin }}
          </div>
          <br>
        </el-card>
        <br>
        <el-card class="profile-view h100 medal" shadow="always">
          <h3> Medalhas </h3>
          <br>
          <div class="medal-list">
            <el-row :gutter="10">
              <el-col v-for="medal in user.medals" :key="medal.id" :span="5">
                <el-row :gutter="5">
                  <el-col :span="8">
                    <v-img
                      :src="medal.picture"
                      class="medal-image"
                    />
                  </el-col>
                  <el-col :span="16">
                    <div>
                      <div>
                        {{ medal.name }}
                      </div>
                      <div>
                        Conquista
                        <br>
                        {{ medal.studentMedals[0].date | moment("DD/MM/YYYY") }}
                        <!-- {{ medal.description }} -->
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="justify-end d-flex">
            {{ user.medals.length }} medalhas conquistadas.
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="profile-view h100 info" :shadow="'always'">
          <el-tabs type="card">
            <el-tab-pane label="Informaçôes Profissionais">
              <div v-for="professionalInfo in user.professionalInfos" :key="professionalInfo.id">
                <h3> {{ professionalInfo.company }} </h3>
                <strong> Atividades exercidas: </strong> {{ professionalInfo.activitiesPerformed }} <br>
                <strong> Cargo: </strong> {{ professionalInfo.role }}<br>
                <strong>Início: </strong> {{ professionalInfo.start | moment("DD/MM/YYYY") }}
                <strong>Fim: </strong> {{ professionalInfo.end | moment("DD/MM/YYYY") }}
                <br><br><hr>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Informações Acadêmicas">
              <div v-for="academicInfo in user.academicInfos" :key="academicInfo.id">
                <h3> {{ academicInfo.institution }} </h3>
                <strong> Curso: </strong> {{ academicInfo.course }}<br>
                <strong>Início: </strong> {{ academicInfo.start | moment("DD/MM/YYYY") }}
                <strong>Fim: </strong> {{ academicInfo.end | moment("DD/MM/YYYY") }}
                <br><br><hr>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <div>
      <el-card class="profile-view h100" :shadow="'always'">
        <h2>projetos</h2>
        <br>
        <el-row :gutter="40">
          <el-col :span="4">
            <div v-for="studentTeam in user.studentTeam" :key="studentTeam.team.project.title" @click="currentProject = studentTeam">
              {{ studentTeam.team.project.title }}
              <div class="description">
                {{ studentTeam.team.project.shortDescription }}
              </div>
              <br><hr><br>
            </div>
          </el-col>
          <el-col :span="10">
            <div v-if="currentProject">
              <h3> {{ currentProject.team.project.title }} </h3>

              <div>
                <strong> Resumo: </strong> {{ currentProject.team.project.shortDescription }}
                <br>
                <strong> Descrição completa: </strong> {{ currentProject.team.project.completeDescription }}
                <br>
                <strong> Descrição da tecnologia: </strong> {{ currentProject.team.project.technologyDescription }}
              </div>
            </div>
          </el-col>
          <el-col v-if="!currentProject" :span="10">
            <highcharts :options="getChartOptionsAverage()" />
          </el-col>
          <el-col :span="10">
            <highcharts :options="getChartOptions()" />
          </el-col>
        </el-row>
      </el-card>
    </div>
    <br>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import UserService from '@/services/UserService.js'

export default {
  components: {
    highcharts: Chart
  },
  data () {
    return {
      currentProject: undefined,
      user: {}
    }
  },
  beforeMount () {
    this.$store.commit('SHOW_LOADING')
    UserService.getProfileInfo(this.$route.params.userId)
      .then((res) => {
        this.user = res
      })
      .catch(err => this.$throwError(err))
      .finally(() => this.$store.commit('HIDE_LOADING'))
  },
  methods: {
    getChartOptions () {
      return {
        series: this.getSeries(this.currentProject ? this.currentProject : this.user.studentTeam[0]),
        chart: {
          polar: true,
          type: 'line'
        },
        title: {
          text: this.currentProject ? 'Desempenho' : 'Desempenho no último projeto'
        },
        xAxis: {
          categories: ['Proatividade', 'Autonomia', 'Colaboração', 'Entrega de resultados'],
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        }
      }
    },
    getChartOptionsAverage () {
      return {
        series: this.getSeriesAverage(),
        chart: {
          polar: true,
          type: 'line'
        },
        title: {
          text: 'Desempenho geral'
        },
        xAxis: {
          categories: ['Proatividade', 'Autonomia', 'Colaboração', 'Entrega de resultados'],
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0,
          max: 5
        }
      }
    },
    getSeriesAverage () {
      return [{
        name: 'Média geral',
        data: [
          this.user.average.proactivity,
          this.user.average.autonomy,
          this.user.average.collaboration,
          this.user.average.resultsDeliver
        ],
        pointPlacement: 'on'
      }]
    },
    getSeries (project) {
      const series = []

      project.evaluations.forEach(evaluation => {
        series.push({
          name: evaluation.evaluatedBy.authorizations[0].name === 'ROLE_TEACHER' ? 'Avaliação do professor' : 'Avaliação do Scrum Master',
          data: [
            evaluation.proactivity,
            evaluation.autonomy,
            evaluation.collaboration,
            evaluation.resultsDeliver
          ],
          pointPlacement: 'on'
        })
      })
      return series
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';

.profile-view {
  max-height: calc(100vh - 100px);
  .title {
    font-size: 1.8rem;
  }
}
.image {
  width: 120px;
  border-radius: 20px;
}
.profile {
  margin: 20px;
}
.description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.medal {
  &-image {
    width: 38px;
    border-radius: 20px;
  }
  &-list {
    font-size: 10px;
    height: 347px;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.medal-image {
  width: 38px;
  border-radius: 20px;
}
.info {
  height: 757px;
  max-height: 100%;
  overflow-y: auto;
}
.profile {
  overflow-y: auto;
    overflow-x: hidden;
}
</style>
