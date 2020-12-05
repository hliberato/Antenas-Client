<template>
  <div v-if="isTeacher" class="project-step-8">
    <el-alert
      :closable="false"
      title="Avalie e atribua medalhas aos alunos"
      type="info"
    >
      <el-button
        plain
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
      :visible.sync="dialogVisible"
      finish-status="success"
      process-status="finish"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-steps :active="step" finish-status="success" simple>
        <el-step title="Atribuir medalhas" icon="el-icon-medal-1" />
        <el-step title="Atribuir notas" icon="el-icon-notebook-2" />
      </el-steps>
      {{ step }}
    </el-dialog>
  </div>
</template>

<script>
import MedalService from '@/services/MedalService.js'
import TeamService from '@/services/TeamService'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      dialogVisible: false,
      step: 0
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
      this.dialogVisible = true
      this.getTeams()
      this.getMedals()
    },
    getMedals () {
      MedalService
        .getMedals()
        .then(res => { this.medals = res })
    },
    getTeams () {
      TeamService
        .getTeam(this.project.id)
        .then(teams => { this.teams = teams })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-step-8 {
}
</style>
