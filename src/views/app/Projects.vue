<template>
  <el-container class="projects-view">
    <el-aside style="padding: 10px;">
      <ProjectsList :projects="projects" />
    </el-aside>
    <el-main>
      <ProjectOverview />
    </el-main>
  </el-container>
</template>

<script>
import ProjectsList from '@/components/Project/ProjectsList'
import ProjectOverview from '@/components/Project/ProjectOverview'
import { mapGetters } from 'vuex'

export default {
  components: {
    ProjectsList,
    ProjectOverview
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'projects'
    ])
  },
  mounted () {
  }
}
</script>

<style lang="scss">
.projects-view {
  .project-card + .project-card {
    margin-top: 1rem;
  }
}
</style>
