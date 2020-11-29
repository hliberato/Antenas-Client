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
    <div class="d-flex align-center">
      <el-input
        v-model="searchTerm"
        placeholder="Buscar por projetos"
        suffix-icon="el-icon-search"
        class="w100"
        clearable
        @input="searchProjects"
      />
      <el-popover
        width="220"
        trigger="click"
      >
        <el-select
          v-model="filterStatus"
          multiple
          placeholder="Filtrar por status"
          collapse-tags
          clearable
          @change="searchProjects"
        >
          <el-option
            v-for="filter in availableFilters"
            :key="filter"
            :label="filter"
            :value="filter"
          />
        </el-select>
        <el-badge
          slot="reference"
          :value="filterStatus.length"
          :hidden="!filterStatus.length"
          type="primary"
        >
          <el-tooltip :open-delay="500" content="Filtre por status" placement="top">
            <el-button
              type="text"
              icon="el-icon-s-operation"
              class="filter"
            />
          </el-tooltip>
        </el-badge>
      </el-popover>
    </div>
    <div class="list">
      <ProjectCard
        v-for="(project, index) in filteredProjects"
        :key="index"
        :project="project"
        :is-active="activeProjectId === project.id"
        @click="selectProject"
      />
      <div v-if="!filteredProjects.length && (searchTerm || filterStatus.length)" class="mt-4 text-center">
        <i>Sem resultados para os filtros selecionados.</i>
      </div>
    </div>
  </el-card>
</template>

<script>
import ProjectCard from '@/components/Project/ProjectCard'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'

export default {
  components: {
    ProjectCard
  },
  props: {
    activeProjectIdProps: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      searchTerm: '',
      filterStatus: [],
      filteredProjects: []
    }
  },
  computed: {
    ...mapGetters([
      'projects',
      'availableFilters'
    ]),
    activeProjectId: {
      get () {
        return this.$store.getters.selectedProject?.id || 0
      },
      set (value) {
        this.$store.commit('SET_SELECTED_PROJECT_ID', value)
      }
    }
  },
  mounted () {
    this.filteredProjects = this.projects
  },
  methods: {
    selectProject (id) {
      this.activeProjectId = id
    },
    showProjectModal () {
      this.$store.commit('SET_PROJECT_MODAL', true)
    },
    searchProjects: debounce(function () {
      this.$search(this.searchTerm, this.projects, {
        keys: ['title', 'shortDescription'],
        threshold: 0.2
      }).then(results => {
        let filtered
        if (this.searchTerm) filtered = results
        else filtered = this.projects
        this.filteredProjects = filtered.filter(p => {
          return !this.filterStatus.length || this.filterStatus.includes(p.labelPhase)
        })
      })
    }, 500),
    handleClose (tag) {
      this.filterStatus.splice(this.filterStatus.indexOf(tag), 1)
      this.searchProjects()
    }
  }
}
</script>

<style lang="scss">
.project-list {
  max-height: calc(100vh - 96px);
  .el-card__header {
    padding: 12px 20px;
  }
  > .el-card__body {
    height: 100%;
  }
  .list {
    height: calc(100% - 88px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 12px;
  }
  .new {
    font-size: .9rem;
  }
  .filter {
    font-size: 1.2rem;
    padding: 0;
    margin-left: 16px;
  }
}
</style>
