<template>
  <div class="registration-info-view">
    <el-tabs value="info" tab-position="left">
      <el-tab-pane label="Informações pessoais" name="info">
        <PersonalInfo
          v-if="page_title == 'Informações pessoais'"
          :user="user"
        />
      </el-tab-pane>
      <el-tab-pane label="Informações profissionais" name="job">Informações profissionais</el-tab-pane>
      <el-tab-pane label="Informações acadêmicas" name="school">Informações acadêmicas</el-tab-pane>
      <el-tab-pane label="Medalhas" name="medals">Medalhas</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PersonalInfo from '@/components/UserInfo/PersonalInfo.vue'

export default {
  name: 'RegistrationInfo',
  components: {
    PersonalInfo
  }
}
</script>

<style lang="scss" scoped>

</style>
