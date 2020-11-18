<template>
  <el-card class="project-overview h100">
    <div v-if="project">
      <transition name="fade">
        <div v-if="!fade">
          <h1 class="title">{{ project.title }}</h1>
          <el-tabs :key="tabsKey">
            <el-tab-pane label="Projeto">
              <h3>
                Fase atual do projeto:
                <span>{{ $getProjectLabelPhase($getProjectStatus(project), project) }}</span>
              </h3>
              <el-steps :active="project.progress - 1" finish-status="success" process-status="finish">
                <el-step v-for="(step, index) in Array(9)" :key="index" />
              </el-steps>
              <el-collapse class="mt-28" value="1">
                <el-collapse-item v-if="project.shortDescription" title="Resumo" name="1">
                  {{ project.shortDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.completeDescription" title="Descrição completa" name="2">
                  {{ project.completeDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.technologyDescription" title="Tecnologias" name="3">
                  {{ project.technologyDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.notes" title="Notas adicionais" name="4">
                  {{ project.notes }}
                </el-collapse-item>
              </el-collapse>
              <div class="content mt-28">
                <component :is="currentStep" :project="project" />
              </div>
            </el-tab-pane>
            <el-tab-pane :disabled="false" label="Equipe" />
          </el-tabs>
        </div>
      </transition>
    </div>
    <div v-else>
      <div class="text-center empty h100 d-flex align-center">
        <div>
          Selecione um projeto ao lado para saber mais ou
          <el-link type="primary">crie um novo projeto</el-link>.
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Step2 from './ProjectOverviewSteps/Step2'
import Step3 from './ProjectOverviewSteps/Step3'
import Step4 from './ProjectOverviewSteps/Step4'
import Step5 from './ProjectOverviewSteps/Step5'
import Step6 from './ProjectOverviewSteps/Step6'
import Step7 from './ProjectOverviewSteps/Step7'
import Step8 from './ProjectOverviewSteps/Step8'
import Step9 from './ProjectOverviewSteps/Step9'

import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  components: {
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
    Step8,
    Step9
  },
  data () {
    return {
      fade: false,
      tabsKey: 0
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    }),
    currentStep () {
      return 'Step' + this.project.progress
    }
  },
  watch: {
    project (value) {
      this.fade = true
    },
    fade: {
      handler: debounce(function (newVal) {
        if (newVal) this.fade = false
        else setTimeout(() => { this.tabsKey += 1 }, 300)
      }, 200),
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.project-overview {
  height: 100%;
  .title {
    font-size: 1.8rem;
  }
  .empty {
    padding: 12vw;
    * {
      font-size: 2rem;
    }
  }
  // Step
  .el-steps {
    margin-top: 1.4rem;
  }
  // Tab
  .el-tabs {
    margin-top: -12px;
    height: calc(100% - 20px);
  }
  .el-tab-pane {
    padding-top: 1rem;
  }
  .el-tabs__nav {
    float: right;
  }
  .el-tabs__item {
    font-size: 1.1rem;
  }
  // Card
  .el-card__body {
    padding: 38px;
    height: 100%;
    margin-top: -1px;
    > div {
      height: 100%;
    }
  }
  // Collapse
  .el-collapse-item__header {
    font-size: 1.17em;
  }
  .el-collapse-item__content {
    color: $--color-text-secondary;
    font-size: 1rem;
  }
}
</style>
