<template>
  <div v-if="isTeacher" class="project-step-8">
    <el-alert
      :closable="false"
      title="Avalie e atribua medalhas aos alunos"
      type="info"
    >
      <el-button
        :loading="loading"
        type="primary"
        class="ml-16"
        icon="el-icon-notebook-2"
        @click="openDialog()"
      >
        Avaliar alunos
      </el-button>
    </el-alert>

    <el-dialog
      title="Avaliação"
      width="85%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-steps
        :active="step"
        finish-status="success"
        process-status="finish"
        simple
      >
        <el-step title="Atribuir medalhas" icon="el-icon-medal-1" />
        <el-step title="Atribuir notas" icon="el-icon-notebook-2" />
      </el-steps>
      <div v-if="!step">
        <el-row :gutter="32" class="ml-12 mr-12">
          <el-col :span="12" class="medals">
            <div class="d-flex">
              <el-input
                v-model="searchTerm"
                placeholder="Buscar medalhas"
                suffix-icon="el-icon-search"
                class="w100 mr-12"
                clearable
                @input="searchMedals"
              />
              <el-button type="primary">
                Criar nova medalha
              </el-button>
            </div>
            <div class="medals-list">
              <div
                v-for="medal in medals"
                :key="medal.id"
                draggable="true"
                class="drag"
                @dragstart="dragStart($event, medal)"
              >
                <medal-template :medal="medal" />
              </div>
            </div>
          </el-col>
          <el-col :span="12" class="teams">
            <div
              v-for="team in teams"
              :key="team.id"
              class="team"
              @dragover.prevent
              @drop="onDropTeam($event, team)"
            >
              <h1>{{ team }}</h1>
              <div
                v-for="student in []"
                :key="student.id"
                class="student"
                @dragover.prevent
                @drop="onDropStudent($event, student)"
              >
                <div class="d-flex align-center">
                  <span class="student-name">
                    {{ student }}
                  </span>
                  <div
                    v-for="medal in [{name: 'Teste', color: '28a745'}, {name: 'Medalha foda'}, {name: 'Acertô miseravi', color: 'E6A23C' }]"
                    :key="medal.name"
                    class="medal-student"
                    @click="removeMedal()"
                  >
                    <medal-template :medal="medal" />
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        a
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MedalTemplate from '@/components/Medal/MedalTemplate'

import MedalService from '@/services/MedalService.js'
import TeamService from '@/services/TeamService'
import { mapGetters } from 'vuex'

export default {
  components: {
    MedalTemplate
  },
  data () {
    return {
      dialogVisible: true,
      step: 0,
      medals: [],
      teams: [],
      loading: false,
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject',
      isTeacher: 'isTeacher'
    })
  },
  mounted () {
    this.getTeams()
  },
  methods: {
    openDialog () {
      this.loading = true
      Promise
        .all([
          this.getMedals(),
          this.getTeams()
        ])
        .then(response => {
          this.medals = response[0]
          this.teams = response[1]
          this.dialogVisible = true
        })
        .catch(err => this.$throwError(err))
        .finally(() => { this.loading = false })
    },
    getMedals () {
      return MedalService.getMedals().then(res => res)
    },
    getTeams () {
      return TeamService.getTeam(this.project.id).then(res => res)
    },
    searchMedals () {
    },
    dragStart (ev, medal) {
      ev.dataTransfer.setData('medal', medal)
      ev.dataTransfer.dropEffect = 'move'
      ev.dataTransfer.effectAllowed = 'move'
    },
    onDropTeam (ev, team) {
      const medal = ev.dataTransfer.getData('medal')
      console.log(medal)
      console.log(team)
    },
    onDropStudent (ev, student) {
      ev.stopPropagation()
      const medal = ev.dataTransfer.getData('medal')
      console.log(medal)
      console.log(student)
    },
    removeMedal () {
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-step-8 {
  .el-dialog {
    min-height: 50vh;
  }
  .medals, .teams {
    padding: 32px 0;
    h1 {
      font-size: 1.17rem;
    }
    .student-name {
      font-size: 1rem;
      padding: 9px 0;
    }
  }
  .medals-list {
    padding: 40px 8px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }
  .medal-template {
    flex-basis: 100%;
    flex: 1;
  }
  .medal-template + .medal-template {
    margin-top: 12px;
  }
  .team {
    padding: 12px;
    border: 1px dashed;
    border-left: 5px solid;
    border-radius: 4px;
  }
  .team + .team {
    margin-top: 20px;
  }
  .student {
    border: 1px dashed;
    padding: 8px 12px;
    margin-top: 8px;
  }
  .drag {
    opacity: 0.999;
  }
  .medal-student {
    transform: scale(0.2);
    width: 40px;
    height: 34px;
    display:inline-block;
    transform-origin: top center;
    cursor: pointer;
    &:hover {
      &::before {
        content: "\e7c9";
        font-family: element-icons !important;
        font-size: 90px;
        position: absolute;
        z-index: 9999;
        color: #DD2C2C;
        background-color: #ffffff;
        padding: 40px 24px;
      }
    }
  }
}
</style>
