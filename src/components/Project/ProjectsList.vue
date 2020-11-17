<template>
  <el-card class="project-list h100">
    <div slot="header" class="d-flex justify-between align-center">
      <h3>Seus projetos</h3>
      <el-button
        size="small"
        type="success"
      >
        Novo projeto
      </el-button>
    </div>
    <el-input
      v-model="searchTerm"
      placeholder="Buscar por projetos"
      suffix-icon="el-icon-search"
    />
    <br><br>
    <ProjectCard
      v-for="(project, index) in projects"
      :key="index"
      :project="project"
      :is-active="activeProjectId === project.id"
      @click="selectProject"
    />
  </el-card>
</template>

<script>
import ProjectCard from '@/components/Project/ProjectCard.vue'

export default {
  components: {
    ProjectCard
  },
  props: {
    projects: {
      type: Array,
      default: () => []
    },
    activeProjectIdProps: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      searchTerm: ''
    }
  },
  computed: {
    activeProjectId: {
      get () {
        return this.$store.getters.selectedProject?.id || 0
      },
      set (value) {
        this.$store.commit('SET_SELECTED_PROJECT_ID', value)
      }
    }
  },
  methods: {
    selectProject (id) {
      this.activeProjectId = id
    }
  }

}
</script>

<style lang="scss">
.project-list {
  .el-card__header {
    padding: 12px 20px;
  }
}
</style>
