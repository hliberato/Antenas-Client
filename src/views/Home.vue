<template>
  <div id="app">
    <v-app>
      <v-app-bar color="white lighten-5" app>
        <Logo variant="blue" class="toolbar__logo"/>

        <v-spacer></v-spacer>
        <Profile class="toolbar__profile" />
      </v-app-bar>

      <v-main class="justify-center ">
        <div class="home__wrapper">
          <v-row >
            <v-col v-if="evaluateStudents" cols="4" class="medal-list">
                <medal-list/>
            </v-col>
            <v-col v-if="evaluateStudents" cols="8" class="medal-list">
                <evaluation/>
            </v-col>


            <v-col v-if="!evaluateStudents" cols="4" class="content">
              <Projects 
                class="home__projects"
                @create="createProject" />
            </v-col>
            <v-col v-if="!evaluateStudents" cols="8" class="content">
              <ProjectView
                v-if="!creating"
                class="home__project-view"
                @create="createProject" />
              <ProjectCreation 
                v-if="creating"
                class="home__project-view" 
                @close="stopCreation" />
            </v-col>
          </v-row>
        </div>
      </v-main>
    </v-app>
  </div>

</template>

<script>
import Projects from '@/components/Project/Projects.vue'
import Logo from '@/components/Logo/Logo.vue';
import Profile from '@/components/Toolbar/Profile.vue';
import ProjectView from '@/components/Project/ProjectView.vue'
import ProjectCreation from '@/components/Project/ProjectCreation.vue'
import MedalList from '@/components/medal/MedalList' 
import Evaluation from '@/components/medal/Evaluation'
import EventBus from '@/helpers/EventBus.js' 


export default {
  name: 'Home',
  components: {
    Projects,
    Logo,
    Profile,
    ProjectView,
    ProjectCreation,
    MedalList,
    Evaluation,
  },
  mounted() {
      EventBus.$on('EVALUATE_STUDENTS', (projectId) => {
          this.evaluateStudents = !this.evaluateStudents;
          EventBus.$emit('EVALUATION', projectId);
      });
      EventBus.$on('EVALUATE_STUDENTS_CLOSE', () => {
          this.evaluateStudents = !this.evaluateStudents;
      });
  },
  methods: {
    deselectProject() {
      this.selectedProject = {};
    },
    createProject() {
      this.creating = true;
      this.deselectProject();
    },
    stopCreation() {
      this.creating = false;
    }
  },
  data() {
    return {
      selectedProject: {},
      creating: false,
      evaluateStudents: false,
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