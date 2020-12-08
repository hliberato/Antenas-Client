<template>
  <el-container class="projects-view">
    <el-aside style="padding: 10px;">
      <ProjectsList />
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

export default {
  components: {
    ProjectsList,
    ProjectOverview,
    ProjectNewModal
  }
}
</script>
