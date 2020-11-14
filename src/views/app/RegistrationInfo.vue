<template>
  <academic-info />
</template>

<script>
import AcademicInfo from '@/components/UserInfo/AcademicInfo.vue'
import UserService from '@/services/UserService.js'

export default {
  name: 'RegistrationInfo',
  components: {
    AcademicInfo
  },
  mounted () {
    UserService.getUser()
      .then((res) => {
        this.user = res
      })
  }
}
</script>

<style lang="scss" scoped>

</style>
