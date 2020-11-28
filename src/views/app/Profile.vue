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
        <el-card class="profile-view h100" :shadow="'always'">
          Medalhas
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="profile-view h100" :shadow="'always'">
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
      <!-- <el-col :span="12">
      </el-col> -->
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
          <el-col :span="9">
            <div v-if="currentProject !== undefined">
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
          <el-col :span="11">
            <div v-if="currentProject !== undefined">
              <highcharts :options="chartOptions" />
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
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
      user: {},
      chartOptions: {
        series: [{
          name: 'Avaliação do professor',
          data: [2, 4, 2, 5],
          pointPlacement: 'on'
        }, {
          name: 'Avaliação do Master',
          data: [3, 2, 4, 5],
          pointPlacement: 'on'
        }],
        chart: {
          polar: true,
          type: 'line'
        },
        title: {
          text: 'Desempenho'
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
    }
  },
  beforeMount () {
    this.$store.commit('SHOW_LOADING')
    UserService.getProfileInfo()
      .then((res) => {
        this.user = res
      })
      .catch(err => this.$throwError(err))
      .finally(() => this.$store.commit('HIDE_LOADING'))
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

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

</style>
