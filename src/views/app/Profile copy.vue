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
              ({{ user.name }})
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
            <el-row>
              <el-col v-for="medal in user.medals" :key="medal.id" :span="4">
                <medal-template :medal="medal" />
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
                <h3 class="info-title"> {{ professionalInfo.company }} </h3>
                <div class="other-info">
                  <strong> Atividades exercidas: </strong> {{ professionalInfo.activitiesPerformed }} <br>
                  <strong> Cargo: </strong> {{ professionalInfo.role }}<br>
                  <strong>Início: </strong> {{ professionalInfo.start | moment("DD/MM/YYYY") }}
                  <strong>Fim: </strong> {{ professionalInfo.end | moment("DD/MM/YYYY") }}
                </div>
                <br><br><hr>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Informações Acadêmicas">
              <div v-for="academicInfo in user.academicInfos" :key="academicInfo.id">
                <h3 class="info-title"> {{ academicInfo.institution }} </h3>
                <div class="other-info">
                  <strong> Curso: </strong> {{ academicInfo.course }}<br>
                  <strong>Início: </strong> {{ academicInfo.start | moment("DD/MM/YYYY") }}
                  <strong>Fim: </strong> {{ academicInfo.end | moment("DD/MM/YYYY") }}
                </div>
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
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import MedalTemplate from '@/components/Medal/MedalTemplate'

highchartsMore(Highcharts)

export default {
  components: {
    highcharts: Chart,
    MedalTemplate
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
        console.log(this.user)
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
        name: 'Avaliação do professor',
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
      if (project.evaluation) {
        series.push({
          name: 'Avaliação do professor',
          data: [
            project.evaluation.proactivity,
            project.evaluation.autonomy,
            project.evaluation.collaboration,
            project.evaluation.resultsDeliver
          ],
          pointPlacement: 'on'
        })
      }
      return series
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';
.profile {
  margin: 20px;
  overflow-y: auto;
  overflow-x: hidden;

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
  .medal-template {
    transform: scale(0.5);
  }
  .el-col-4 {
      width: 10.666667%;
      height: 100px;
  }
  .info-title {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .other-info {
    margin-left: 14px;
  }
}

</style>
