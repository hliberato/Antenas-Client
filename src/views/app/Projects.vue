<template>
  <el-container class="projects-view">
    <el-aside style="padding: 10px;">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="index"
        :project="project"
        @click="selectProject"
      />
    </el-aside>
    <el-main>
      projetos
    </el-main>
  </el-container>
</template>

<script>
import ProjectCard from '@/components/Project/ProjectCard.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    ProjectCard
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
  },
  methods: {
    selectProject (id) {
      console.log(id)
    }
  }
}
</script>

<style lang="scss">
.projects-view {
  .el-card__body {
    padding: 4px 12px;
  }
  .project-card + .project-card {
    margin-top: 1rem;
  }
}
</style>
