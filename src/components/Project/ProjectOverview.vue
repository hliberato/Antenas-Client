<template>
  <el-card class="project-overview h100">
    <div v-if="project">
      <transition name="fade">
        <div v-if="!fade">
          <h1 class="title">{{ project.title }}</h1>
          <el-tabs :key="tabsKey" @tab-click="tabClick">
            <el-tab-pane label="Projeto">
              <el-steps
                :space="200"
                :active="project.progress - 1"
                finish-status="success"
                process-status="finish"
                align-center
              >
                <el-step v-for="(step, index) in steps" :key="index" :title="step" />
              </el-steps>
              <el-collapse class="mt-28">
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
              <div v-if="showMeetingDetails()">
                <h3> Local da reunião: </h3>
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
              <div v-if="project.progress === 7">
                <h3> Professor responsável: </h3> {{ project.teacher.name }}
                <h3> Projeto aplicado no {{ project.semester }} semestre </h3>
              </div>
              <div v-if="$store.getters.isCadi">
                <div v-if="!project.refused && project.createdBy">
                  <br>
                  <h3> Criado por: </h3> {{ project.createdBy.name }}
                  <h3> Telefone: </h3> {{ project.createdBy.telephone }}
                  <br><br>
                  <!-- <h3> Aprovado por: </h3> {{ project.approvedBy.name }} -->
                </div>
                <!-- NUM APAGA ESSES COMENTARIOS
                <div v-else>
                  <h3> Motivo pelo qual foi rejeitado: </h3> {{ project.reason }}
                </div>-->
              </div>
              <div class="content mt-28 mb-36">
                <component :is="currentStep" :project="project" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="Equipe">
              <TeamView ref="teamView" :project="project" />
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
            <el-link type="primary">crie um novo projeto</el-link>.
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
        // 'Avaliação',
        'Finalizado'
      ]
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
  },
  methods: {
    showMeetingDetails () {
      return (this.project && this.project.meeting &&
            (this.project.progress === 5 || this.project.progress === 6) &&
            (this.$store.getters.isCadi || this.$store.getters.isRepresentative))
    },
    tabClick (tab) {
      if (tab.label === 'Equipe') {
        this.$refs.teamView.getTeam()
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.project-overview {
  max-height: calc(100vh - 100px);
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
