<template>
  <div class="box ">
    <div class="box__header ">
      <div> Carro Voador </div>

      <div class="mr-2">
        <a
          href
          class="close"
          @click.prevent="leaveEvaluation()"
        >
          <i class="material-icons close">close</i>
        </a>
      </div>
    </div>

    <v-btn
      small
      color="#4472E9"
      class="white--text save-button"
      type="submit"
      @click="submit()"
    >
      Salvar
    </v-btn>
    <div class="list">
      <div
        v-for="team in teams"
        :id="team.id"
        :key="team.id"
      >
        <div class="project-view__box">
          <div
            div
            class="box__body project-body"
          >
            <div>
              <div class="group-title flex-box">
                <v-checkbox
                  :label="team.name"
                  hide-details
                  :value="team.id"
                  @click="selectAllTeam(team)"
                />

                <v-spacer />

                <span
                  class="project-link link"
                  @click="upenUrl(team.projectUrl)"
                >
                  Abrir url do projeto
                </span>
              </div>
            </div>

            <div class="evaluation-form">
              <div
                v-for="studentTeam in team.studentTeamList"
                :key="studentTeam.id"
                class="student flex-box"
              >
                <div>
                  <div class="flex-box">
                    <v-checkbox
                      :id="`checkbox-${studentTeam.student.id}`"
                      v-model="selectedStudents"
                      :label="studentTeam.student.name"
                      hide-details
                      :value="studentTeam.student.id"
                    />
                    <span class="student-role"> {{ studentTeam.role }} </span>
                  </div>

                  <div
                    v-for="medal in studentTeam.studentMedals"
                    :key="medal.id"
                  >
                    <v-img
                      :src="medal.picture"
                      :title="medal.name"
                      class="medal-style"
                    />
                  </div>
                </div>
                <v-spacer />
                <div>
                  <div class="flex-box inputs">
                    <div class="box-input">
                      <div>
                        <div class="input-label">
                          Proatividade
                        </div>
                        <input
                          v-model="studentTeam.evaluations.proactivity"
                          type="number"
                          class="custom-input"
                          min="0"
                          max="5"
                        >
                      </div>
                      <div>
                        <div class="input-label">
                          Autonomia
                        </div>
                        <input
                          v-model="studentTeam.evaluations.autonomy"
                          type="number"
                          class="custom-input"
                          min="0"
                          max="5"
                        >
                      </div>
                    </div>
                    <div class="box-input">
                      <div>
                        <div class="input-label">
                          Colaboração
                        </div>
                        <input
                          v-model="studentTeam.evaluations.collaboration"
                          type="number"
                          class="custom-input"
                          min="0"
                          max="5"
                        >
                      </div>
                      <div>
                        <div class="input-label">
                          Entrega de resultado
                        </div>
                        <input
                          v-model="studentTeam.evaluations.resultsDeliver"
                          type="number"
                          class="custom-input"
                          min="0"
                          max="5"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamService from '@/services/TeamService'
import EventBus from '@/helpers/EventBus.js'

export default {
  props: {
    projectId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      proactivity: '',
      teams: [],
      pic: '',
      selectedStudents: []
    }
  },
  mounted () {
    TeamService.getTeam(this.projectId)
      .then(teams => {
        this.teams = teams
        this.teams.forEach((team) => {
          team.studentTeamList.forEach((studentTeam) => {
            studentTeam.evaluations = {
              proactivity: '',
              resultsDeliver: '',
              autonomy: '',
              collaboration: ''
            }
          })
        })
      })
  },
  methods: {
    leaveEvaluation () {
      EventBus.$emit('EVALUATE_STUDENTS')
    },

    selectAllTeam (team) {
      team.studentTeamList.forEach(studentTeam => {
      })
    },

    upenUrl (url) {
      if (url) {
        window.open(url)
      }
    },

    submit () {
      const updatedTeam = this.teams
      updatedTeam.forEach((team) => {
        team.studentTeamList.forEach((studentTeam) => {
          studentTeam.evaluations = [studentTeam.evaluations]
        })
      })

      updatedTeam.forEach((team) => {
        TeamService.updateTeam(team)
      })
    }
  }
}
</script>

<style scoped lang="scss">

.evaluation-form {
    background-color: #eaf0ff;
    border: solid 1px #a3b8ec;
    padding: 8px;
    border-radius: 3px;
    height: 100%;
}

.box-input {
    margin-left: 10px;
}

.save-button {
    display: flex;
    margin-right: 25px;
    margin-top: 10px;
}

.project-view {
    &__box {
        max-height: 100%;
        height: calc(100% - 20px - (16px * 2));
        overflow-y: auto;
    }
}

.custom-input {
    width: 70px;
    border-bottom: solid 1px #cac9c9;
}

.student-name {
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    color: #000000;
}

textarea:focus, input:focus{
    outline: none;
    border-bottom: solid 1px #6c8cde;
}

.student-role {
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 14px;
    color: #9F9D9D;
    padding-top: 7px;
    padding-left: 5px;
}

.input-label {
    font-size: 10px;
    color: #716c6c;
}

.inputs {
    margin-right: 69px;
}

.student {
    background: #FFFFFF;
    border-radius: 21px;
    padding: 8px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
    margin-top: 10px;
}

.group-title {
    background-color: #eaf0ff;
    border: solid 1px #a3b8ec;
    border-bottom: solid 0px #a3b8ec;
    border-radius: 15px 15px 0px 0px;
    padding: 10px 10px 0px 10px;

}

.medal-style {
    border: 1px solid #C1BBBB;
    border-radius: 6px;
    height: 45px;
    width: 35px;
    flex: none;
        margin: 5px 5px 5px 0px;
}

.project-link {
    font-size: 13px;
}

.link {
    color: blue;
    cursor: pointer;
    padding-top: 4%;

}

.close {
    margin-right: 2%;
    color: #6e6e6e;
}

.v-input--selection-controls {
    margin-top: 0px;
    padding-top: 0px;
}

.theme--light.v-label {
    color: rgba(0, 0, 0, 0.75);
}

.list {
    max-height: 100%;
    height: calc(100% - 20px - (#{16px} * 2));
    overflow-y: auto;
}
</style>
