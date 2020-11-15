<template>
  <div class="registration-info-view h100">
    <el-main>
      <el-tabs class="tabs h100" value="info" tab-position="left">
        <el-tab-pane v-loading="loading" label="Informações pessoais" name="info">
          <PersonalInfo :user.sync="user" />
        </el-tab-pane>
        <el-tab-pane v-loading="loading" label="Informações profissionais" name="job">
          <ProfessionalInfo :user.sync="user" />
        </el-tab-pane>
        <el-tab-pane v-loading="loading" label="Informações acadêmicas" name="school">Informações acadêmicas</el-tab-pane>
        <el-tab-pane v-loading="loading" label="Medalhas" name="medals">Medalhas</el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import PersonalInfo from '@/components/UserInfo/PersonalInfo.vue'
import ProfessionalInfo from '@/components/UserInfo/ProfessionalInfo.vue'
import UserService from '@/services/UserService.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    PersonalInfo,
    ProfessionalInfo
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
@import '@/plugins/element/_colors.scss';

.el-tabs__header {
  background-color: mix(#fff, $--color-primary, 90%);
}
.el-tab-pane {
  padding: 18px 40px 20px;
}
.el-tabs__nav {
  margin-top: 2rem;
}
.el-tabs__item {
  text-align: left !important;
}
</style>
