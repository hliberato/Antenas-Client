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
            10 projetos concluídos
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
        projetos
      </el-card>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  data () {
    return {
      user: {}
    }
  },

  beforeMount () {
    this.$store.commit('SHOW_LOADING')
    UserService.getUser()
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
  // width: 50%;
  // margin: 20px;
}
.image {
  width: 120px;
  border-radius: 20px;
}
// .el-card__body {
//   padding: 38px;
//   height: 100%;
// }

.profile {
  margin: 20px;
}

</style>
