<template>
  <v-app class="container-view">
    <v-app-bar
      color="white lighten-5"
      app
    >
      <Logo
        variant="blue"
        class="toolbar__logo"
      />
      <v-spacer />
      <Profile class="toolbar__profile" />
    </v-app-bar>
    <router-view />
  </v-app>
</template>

<script>
import Logo from '@/components/Logo/Logo.vue'
import Profile from '@/components/Toolbar/Profile.vue'
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'Home',
  components: {
    Logo,
    Profile
  },
  data () {
    return {
      selectedProject: {},
      creating: false,
      evaluateStudents: false,
      projectId: 0
    }
  },
  mounted () {
    EventBus.$on('EVALUATE_STUDENTS', (projectId) => {
      this.projectId = projectId
      this.evaluateStudents = !this.evaluateStudents
    })
  },
  methods: {
    deselectProject () {
      this.selectedProject = {}
    },
    createProject () {
      this.creating = true
      this.deselectProject()
    },
    stopCreation () {
      this.creating = false
    }
  }
}
</script>

<style scoped lang="scss">
.container-view {
}
</style>
