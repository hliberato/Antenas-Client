<template>
  <div class="box-team">
    <div v-if="teams.length == 0">
      <v-alert
        v-if="!$store.getters.isStudent"
        outlined
        color="red"
      >
        <div class="warning-stye">
          Não há equipes cadastradas neste projeto.
        </div>
      </v-alert>

      <v-alert
        v-if="$store.getters.isStudent && teams.length == 0 && !createTeam"
        outlined
        type="warning"
        prominent
        border="left"
      >
        <span
          class="text-button"
          @click="createTeam = !createTeam"
        > Crie uma equipe </span> ou aguarde até ser convidado para uma.
      </v-alert>
    </div>

    <div v-if="createTeam">
      <div class="flex-box">
        <v-text-field
          v-model="teamName"
          class="mr-3"
          label="Nome da equipe"
          hide-details="auto"
        />

        <v-select
          v-model="role"
          :items="roles"
          :item-text="'label'"
          :item-value="'value'"
          label="Sua função no projeto"
        />
      </div>

      <v-row class="button-position ml-65p">
        <v-col
          cols="6"
          class="ml-0"
        >
          <v-btn
            small
            color="#4472E9"
            class="white--text"
            type="button"
            @click="submit()"
          >
            <v-icon left>
              save
            </v-icon>
            Criar
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            small
            color="#DD2C2C"
            type="button"
            class="white--text"
            @click="createTeam = !createTeam"
          >
            <v-icon left>
              close
            </v-icon>
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-expansion-panels
      v-for="team in teams"
      :key="team.id"
      :disabled="false"
      multiple
    >
      <v-expansion-panel :aria-expanded="$store.getters.isStudent">
        <v-expansion-panel-header class="team-view__title">
          <v-row>
            <h5> {{ team.name }} </h5>
          </v-row>
        </v-expansion-panel-header>

        <v-expansion-panel-content class="team-view">
          <div class="student-flex-box">
            <div
              v-for="member in team.studentTeamList"
              :key="member.id"
              class="team-member"
            >
              <div class="student-flex-box">
                <div>
                  <div class="member-name">
                    {{ member.student.name }}
                  </div>
                  <div class="role-view">
                    {{ member.role }}
                  </div>
                </div>

                <a
                  v-if="$store.getters.isStudent"
                  @click.prevent="removeStudent(member.student.id)"
                >
                  <i class="material-icons material-icons-padding">close</i>
                </a>
              </div>
            </div>
          </div>
          <div v-if="$store.getters.isStudent">
            <v-row>
              <v-col cols="11">
                <v-text-field
                  v-model="team.communicationLink"
                  label="Link de comunicação"
                  :rules="rules.link"
                  append-icon="link"
                  hide-details="auto"
                />
              </v-col>

              <v-col
                cols="1"
                class="save-button"
              >
                <span
                  v-if="$store.getters.isStudent"
                  class="material-icons material-icons-p25 pointer "
                  @click="saveLink(team, team.communicationLink)"
                >
                  save
                </span>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="11">
                <v-text-field
                  v-model="team.projectUrl"
                  label="Link do projeto"
                  append-icon="link"
                  :rules="rules.link"
                  hide-details="auto"
                />
              </v-col>

              <v-col
                cols="1"
                class="save-button"
              >
                <span
                  v-if="$store.getters.isStudent"
                  class="material-icons material-icons-p25 pointer "
                  @click="saveLink(team, team.projectUrl)"
                >
                  save
                </span>
              </v-col>
            </v-row>
          </div>

          <div v-else>
            <div>
              <div class="link-title">
                Link de comunicação
              </div>
              <div
                class="link-view flex-box"
                @click="upenUrl(team.communicationLink)"
              >
                <span>
                  {{ getLink(team.communicationLink) }}
                </span>

                <div class="spacer" />
                <span class="material-icons"> link </span>
              </div>
            </div>

            <div>
              <div class="link-title">
                Link do projeto
              </div>
              <div
                class="link-view flex-box"
                @click="upenUrl(team.projectUrl)"
              >
                <span>
                  {{ getLink(team.projectUrl) }}
                </span>

                <div class="spacer" />
                <span class="material-icons"> link </span>
              </div>
            </div>
          </div>

          <div
            v-if="$store.getters.isStudent"
            class="add-member"
          >
            <div class="my-2">
              <v-btn
                text
                color="primary"
                @click="addMember = !addMember"
              >
                <v-icon left>
                  person_add
                </v-icon> Adicionar novo membro
              </v-btn>
            </div>

            <v-row v-if="addMember">
              <v-col cols="6">
                <v-select
                  v-model="newTeamMember"
                  :items="getSudentOptions()"
                  label="Nome"
                  :item-text="'label'"
                  :item-value="'value'"
                />
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="role"
                  :items="roles"
                  :item-text="'label'"
                  :item-value="'value'"
                  label="Função"
                />
              </v-col>
            </v-row>

            <v-row
              v-if="addMember"
              class="button-position"
            >
              <v-col
                cols="6"
                class="ml-0"
              >
                <v-btn
                  small
                  color="#4472E9"
                  class="white--text "
                  type="button"
                  @click="submit(team)"
                >
                  <v-icon left>
                    save
                  </v-icon>
                  Salvar
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-btn
                  small
                  color="#DD2C2C"
                  type="button"
                  class="white--text pl-30"
                  @click="addMember = !addMember"
                >
                  <v-icon left>
                    close
                  </v-icon>
                  Cancelar
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import TeamService from '@/services/TeamService'
import UserService from '@/services/UserService.js'
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
      teams: [],
      students: [],
      addMember: false,
      createTeam: false,

      teamName: '',
      role: '',
      newTeamMember: 0,
      roles: [
        { value: 'DevOps', label: 'DevOps' },
        { value: 'Dev', label: 'Dev' },
        { value: 'Scrum Master', label: 'Scrum Master' }
      ],
      rules: {
        link: [
          link => (link.includes('http://') || link.includes('https://')) || 'É necessário que o link possua http:// ou https://',
          link => !!link || 'Campo obrigatório'
        ],

        semester_rules: [
          semester => !!semester || 'Campo obrigatório',
          semester => (semester && semester < 7) || 'Insira um semestre válido.',
          semester => (semester && semester > 0) || 'Insira um semestre válido.'
        ]
      }
    }
  },
  mounted () {
    UserService
      .getStudentsUsers()
      .then(students => {
        this.students = students.filter(student => {
          // TODO alterar esse cara
          return student.id.toString() !== localStorage.getItem('USER_ID').toString()
        })
      })

    this.updateTeams(this.projectId)

    EventBus.$on('selectProject', (projectId) => {
      this.updateTeams(projectId)
    })
  },
  methods: {
    updateTeams (projectId) {
      TeamService
        .getTeam(projectId)
        .then(teams => {
          this.teams = teams
        })
    },

    submit (team) {
      const updatedTeams = team

      if (updatedTeams !== undefined) {
        if ((this.teamName && this.role) || this.newTeamMember !== 0) {
          updatedTeams.studentTeamList.push({
            role: this.role,
            student: {
              id: this.newTeamMember !== 0 ? this.newTeamMember : this.$store.state.selectedProject.id
            }
          })
        }

        TeamService.updateTeam(updatedTeams).then(() => {
          this.updateTeams(this.projectId)
        })
        this.addMember = false
      } else {
        TeamService.addTeam(
          {
            project: { id: this.projectId },
            name: this.teamName
          },
          this.role).then(() => {
          this.updateTeams(this.projectId)
        })
        this.createTeam = false
      }
    },

    getSudentOptions () {
      return [...this.students.map(student => ({ label: student.name, value: student.id }))]
    },

    getLink (link) {
      return link || 'A equipe ainda não adicionou um Link.'
    },

    getClassTextField () {
      const class1 = 'input-link'
      return [class1]
    },

    upenUrl (url) {
      if (url) {
        window.open(url)
      }
    },

    removeStudent (student) {
      TeamService.removeStudent(student).then(() => {
        this.updateTeams(this.projectId)
      })
    },

    saveLink (team, link) {
      if ((!link.includes('http://') && !link.includes('https://')) || !link) {
        alert('Link incorreto')
      } else {
        this.submit(team)
      }
    }
  }
}
</script>

<style scoped lang="scss">

.warning-stye {
    text-align: center;
    font-weight: 600;
}

.text-button {
    padding-left: 0;
    color: #516cf5!important;
    cursor: pointer;
    text-transform: none !important;
}

.text-button:hover {
    cursor: pointer;
    border-bottom: 1px solid #516cf5;
    font-weight: 700 ;
}

.pl-30 {
    margin-left: 30px !important;
}

.spacer {
    flex-grow: 1 !important;
}

.row {
    margin-left: 0;
}

.link-title {
    margin-top: 20px;
    font-weight: 100;
    font-size: 12px;
}

.link-view {
    padding-left: 0;
    border-bottom: 1px dashed #353535;
    color: #516cf5;;
    cursor: pointer;
}

.add-member {
    padding-top: 25px;
}

.role-view {
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 14px;
    color: #9F9D9D;
    padding-top: 5px;
}

.title-style {
    font-weight: 600;
    font-size: 17px;
    line-height: 23px;
    display: block;
}

.save-button {
    color: #4472E9;
    padding-right: 15px;
    padding-left: 0px;
    padding-top: 5% !important;
}

.pointer {
    cursor:pointer !important;
}

.ml-65p {
    margin-left: 65% !important;
}

.button-position {
    width: 30%;
    margin-left: 58%;
}

.input-link {
    padding: 20px 5px 5px 5px;
}

.student-flex-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.v-expansion-panels {
   justify-content: left;
}

.team-member {
    background-color: white;
    border-radius: 0px 21px 21px 21px;
    padding: 5px 0px 5px 17px;
    margin-right: 10px;
    margin-bottom: 10px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.123));
}

.material-icons {
    cursor: pointer;
}

.material-icons-padding {
    padding-right: 10px;
    padding-top: 8px;
    color: #6e6e6e;
}

.col {
    padding-bottom: 0px;
    padding-top: 0px;
}

.member-name {
    padding-right: 18px;
}

.box-team {
    padding: 16px 15px;
    height: calc(100% - 20px - (16px * 2));
    overflow-y: auto;
}

.v-expansion-panel-header {
    min-height: 0px;
}

.v-expansion-panel {
    padding-bottom: 20px;
}

.v-expansion-panel::before {
    box-shadow: none;
}

.team-view {
    background-color: #eaf0ff;
    border: solid 1px #a3b8ec;
    padding: 8px 0 8px 0;
    border-radius: 0px 0px 3px 3px;
    border-top: none;

    &__title {
        font-weight: 600;
        padding-top: 5px;
        font-size: 18px;
        line-height: 22px;
        // border-radius: 10px 10px 0px 0px;
        background-color: #eaf0ff;
        border: solid 1px #a3b8ec;
        padding-left: 10px;
        padding-right: 5px;
    }

    &__section {
        margin-bottom: spacing(2);

        .form-button {
            margin-right: spacing(2);

            &:last-child {
                margin-right: 0;
            }

            &-mr-15 {
                margin-right: 15px !important;
            }
        }
    }
}

</style>
