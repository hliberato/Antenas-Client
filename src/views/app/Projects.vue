<template>
  <el-container class="projects-view">
    <el-aside style="padding: 10px;">
      <ProjectsList :projects="projects" />
    </el-aside>
    <el-main>
      <ProjectOverview />
      <ProjectNewModal />
    </el-main>
  </el-container>
</template>

<script>
import ProjectsList from '@/components/Project/ProjectsList'
import ProjectOverview from '@/components/Project/ProjectOverview.vue'
import ProjectNewModal from '@/components/Project/ProjectNewModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    ProjectsList,
    ProjectOverview,
    ProjectNewModal
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
}
</style>
