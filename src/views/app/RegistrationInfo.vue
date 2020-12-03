<template>
  <div class="registration-info-view h100">
    <el-tabs class="tabs h100" value="info" tab-position="left">
      <el-tab-pane v-loading="loading" label="Informações pessoais" name="info">
        <PersonalInfo :user.sync="user" />
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.isStudent" v-loading="loading" label="Informações profissionais" name="job">
        <ProfessionalInfo :user.sync="user" />
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.isStudent" v-loading="loading" label="Informações acadêmicas" name="school">
        <AcademicInfo :user.sync="user" />
      </el-tab-pane>
      <!-- <el-tab-pane v-loading="loading" label="Medalhas" name="medals">
        Medalhas
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import PersonalInfo from '@/components/UserInfo/PersonalInfo.vue'
import ProfessionalInfo from '@/components/UserInfo/ProfessionalInfo.vue'
import AcademicInfo from '@/components/UserInfo/AcademicInfo.vue'
import UserService from '@/services/UserService.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    PersonalInfo,
    ProfessionalInfo,
    AcademicInfo
  },
  data () {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters([
      'loading'
    ])
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
@import '@/styles/_colors.scss';
.registration-info-view {
  .tabs {
    background: #fff;
  }
  .el-tabs__header {
    margin-right: 0 !important;
    background-color: mix(#fff, $--color-primary, 90%);
  }
  .el-tab-pane {
    padding: 40px;
  }
  .el-tabs__nav {
    margin-top: 2rem;
  }
  .el-tabs__item {
    text-align: left !important;
  }
}

</style>
