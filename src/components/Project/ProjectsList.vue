<template>
  <el-card class="project-list h100">
    <div slot="header" class="justify-between d-flex align-center mt-4 mb-4">
      <h3>Seus projetos</h3>
      <el-button
        v-if="$store.getters.isRepresentative"
        class="new"
        type="success"
        size="small"
        @click="showProjectModal"
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
    <div class="list">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="index"
        :project="project"
        :is-active="activeProjectId === project.id"
        @click="selectProject"
      />
    </div>
  </el-card>
</template>

<script>
import ProjectCard from '@/components/Project/ProjectCard'

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
    },
    showProjectModal () {
      this.$store.commit('SET_PROJECT_MODAL', true)
    }
  }

}
</script>

<style lang="scss">
.project-list {
  max-height: calc(100vh - 100px);
  .el-card__header {
    padding: 12px 20px;
  }
  > .el-card__body {
    height: 100%;
  }
  .list {
    height: calc(100% - 126px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .new {
    font-size: .9rem;
  }
}
</style>
