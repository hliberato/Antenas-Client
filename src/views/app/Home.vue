<template>
  <v-main class="justify-center home-view">
    <div class="home__wrapper">
      <v-row>
        <v-col
          v-if="evaluateStudents"
          cols="4"
          class="medal-list"
        >
          <medal-list />
        </v-col>
        <v-col
          v-if="evaluateStudents"
          cols="8"
          class="medal-list"
        >
          <evaluation :project-id="projectId" />
        </v-col>
        <v-col
          v-if="!evaluateStudents"
          cols="4"
          class="content"
        >
          <Projects
            class="home__projects"
            @create="createProject"
          />
        </v-col>
        <v-col
          v-if="!evaluateStudents"
          cols="8"
          class="content"
        >
          <ProjectView
            v-if="!creating"
            class="home__project-view"
            @create="createProject"
          />
          <ProjectCreation
            v-if="creating"
            class="home__project-view"
            @close="stopCreation"
          />
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
import Projects from '@/components/Project/Projects.vue'
import ProjectView from '@/components/Project/ProjectView.vue'
import ProjectCreation from '@/components/Project/ProjectCreation.vue'
import MedalList from '@/components/Medal/MedalList'
import Evaluation from '@/components/Medal/Evaluation'
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'Home',
  components: {
    Projects,
    ProjectView,
    ProjectCreation,
    MedalList,
    Evaluation
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
.content {
  max-height: 100%;
}

.home {
  &__wrapper {
    display: flex;
    max-width: 1080px;
    width: 90%;
    margin: 25px auto;
    height: calc(100vh - 70px - #{32px } * 2);
  }

  &__projects,
  &__project-view {
    height: 100%;
  }

  &__project-view {
    margin-left: spacing(4);
    flex-grow: 1;
  }
}

.medal-list {
    max-height: 100%;
}
</style>
