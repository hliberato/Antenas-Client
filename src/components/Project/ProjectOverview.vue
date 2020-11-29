<template>
  <el-card v-loading="$store.getters.loading" class="project-overview h100">
    <div v-if="project">
      <transition name="fade">
        <div v-if="!fade">
          <h1 class="title">{{ project.title }}</h1>
          <el-tabs :key="tabsKey" @tab-click="tabClick">
            <el-tab-pane label="Projeto">
              <el-steps
                :active="project.progress - 1"
                finish-status="success"
                :process-status="project.progress == 9 ? 'success' : project.refused ? 'error' : 'finish'"
                align-center
              >
                <el-step v-for="(step, index) in steps" :key="index" :title="step" />
              </el-steps>
              <el-collapse v-model="openAnotherInfo" class="mt-40">
                <el-collapse-item v-if="project.shortDescription" title="Resumo" name="1">
                  {{ project.shortDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.completeDescription" title="Descrição completa" name="2">
                  {{ project.completeDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.technologyDescription" title="Tecnologias" name="3">
                  {{ project.technologyDescription }}
                </el-collapse-item>
                <el-collapse-item v-if="project.notes && !$store.getters.isStudent" title="Notas adicionais" name="4">
                  {{ project.notes }}
                </el-collapse-item>
                <el-collapse-item v-if="!this.$store.getters.isStudent" title="Outras informações" name="5">
                  <div v-if="showMeetingDetails">
                    <h3> Local da reunião: </h3>
                    <div v-if="showAddress">
                      <div>
                        {{ project.meeting.address.place }}
                        <br>
                        {{ project.meeting.address.neighborhood }},
                        {{ project.meeting.address.street }},
                        {{ project.meeting.address.number }}
                        <br>
                        {{ project.meeting.address.zipCode }} {{ project.meeting.address.city }}
                      </div>
                      <div>
                        <h3>Data e hora:</h3> {{ project.meeting.chosenDate == null ? 'A definir' : project.meeting.chosenDate | moment("DD/MM/YYYY HH:mm") }}
                      </div>
                    </div>
                    <div v-else>
                      A definir
                    </div>
                  </div>
                  <div v-if="project.progress === 7">
                    <strong> Professor responsável: </strong> {{ project.teacher.name }}
                    <br>
                    <strong> Semestre: </strong> {{ project.semester }}º
                  </div>
                  <div>
                    <div v-if="project.createdBy">
                      <strong> Criado por: </strong> {{ project.createdBy.name }}
                      <br>
                      <strong> Telefone: </strong> {{ project.createdBy.telephone }}
                      <br>
                      <strong> Empresa: </strong> {{ project.createdBy.company }}
                      <div v-if="project.approvedBy">
                        <br>
                        <br>
                        <strong> Aprovado por: </strong> {{ project.approvedBy.name }}
                      </div>
                    </div>
                    <div v-if="project.reason">
                      <br>
                      <h4> Motivo pelo qual foi rejeitado: </h4> {{ project.reason }}
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div class="content mt-28 mb-36">
                <component :is="currentStep" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="Equipe">
              <TeamView ref="teamView" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </transition>
    </div>
    <div v-else>
      <div class="text-center empty h100 d-flex align-center">
        <div>
          Selecione um projeto ao lado para saber mais<span v-if="!$store.getters.isRepresentative">.</span>
          <span v-if="$store.getters.isRepresentative">
            ou
            <el-link type="primary" @click="showProjectModal">crie um novo projeto</el-link>.
          </span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
/* eslint-disable import/no-duplicates */
import TeamView from '@/components/Team/TeamView.vue'

import Step2 from './ProjectOverviewSteps/Step2'
import Step3 from './ProjectOverviewSteps/Step3'
import Step4 from './ProjectOverviewSteps/Step2'
import Step5 from './ProjectOverviewSteps/Step5'
import Step6 from './ProjectOverviewSteps/Step6'
import Step7 from './ProjectOverviewSteps/Step7'
import Step8 from './ProjectOverviewSteps/Step8'
import Step9 from './ProjectOverviewSteps/Step9'

import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  components: {
    TeamView,
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
      tabsKey: 0,
      steps: [
        'Cadastro inicial',
        'Avaliação inicial',
        'Cadastro detalhado',
        'Avaliação detalhada',
        'Reunião',
        'Designar professor',
        'Entrega',
        'Avaliação dos alunos',
        'Finalizado'
      ]
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    }),
    openAnotherInfo () {
      return (this.$store.getters.isCadi || this.$store.getters.isRepresentative) && this.project.progress === 5 ? ['5'] : []
    },
    currentStep () {
      return 'Step' + this.project.progress
    },
    showMeetingDetails () {
      return (this.project && this.project.meeting &&
        (this.project.progress === 5 || this.project.progress === 6) &&
        (this.$store.getters.isCadi || this.$store.getters.isRepresentative))
    },
    showAddress () {
      return this.project.meeting.address.place && this.project.meeting.address.neighborhood &&
        this.project.meeting.address.neighborhood && this.project.meeting.address.street &&
        this.project.meeting.address.number && this.project.meeting.address.zipCode &&
        this.project.meeting.address.city
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
  },
  methods: {
    tabClick (tab) {
      if (tab.label === 'Equipe') {
        this.$refs.teamView.getTeam()
      }
    },
    showProjectModal () {
      this.$store.commit('SET_PROJECT_MODAL', true)
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-overview {
  max-height: calc(100vh - 96px);
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
  .el-step__title {
    line-height: 1.2rem;
    margin-top: 12px;
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
    overflow-y: auto;
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
