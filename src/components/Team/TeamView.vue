<template>
  <div>
    <div v-if="teams.length == 0 && !createTeam">
      <el-alert
        v-if="!$store.getters.isStudent"
        title="Não há equipes cadastradas no momento"
        type="warning"
        center
        show-icon
      />
      <el-alert
        v-if="canEdit && teams.length == 0 && !createTeam"
        center
        type="warning"
        prominent
        border="left"
      >
        <el-button type="text" @click="createTeam = !createTeam">Crie uma equipe</el-button> ou peça para um colega te adicionar em uma.
      </el-alert>
    </div>
    <div v-else-if="teams.length > 0 && !createTeam">
      <el-collapse v-for="teamInfo in teams" :key="teamInfo.id" value="1">
        <el-collapse-item :title="teamInfo.name " name="1">
          <div class="student-flex-box">
            <div
              v-for="member in teamInfo.studentTeamList"
              :key="member.label"
              :type="member.type"
              class="team-member member-view"
            >
              <div class="student-flex-box">
                <div>
                  <div class="member-name">{{ member.student.name }}</div>
                  <div class="role-view">{{ formatStudentRoles(member) }}</div>
                </div>
                <div v-if="canEdit" class="overlay">
                  <div class="icon" @click="editMember(member)">
                    <i class="el-icon-edit-outline" /> Editar
                  </div>
                  <div class="icon close" @click="removeStudent(member)">
                    <i class="el-icon-close" /> Remover
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="canEdit" class="justify-end d-flex">
            <el-button
              icon="el-icon-plus"
              type="text"
              @click="addMember = !addMember"
            >
              Adicionar novo membro
            </el-button>
          </div>
          <br><br>
          <div v-if="canEdit">
            <el-form
              ref="form"
              v-loading="$store.getters.loading"
              class="team-form-url"
              label-position="top"
              label-width="130px"
            >
              <el-form-item label="Url do projeto" prop="projectUrl">
                <el-input
                  v-model="projectUrl"
                  type="text"
                  maxlength="50"
                  show-word-limit
                  @blur="update()"
                />
              </el-form-item>
              <el-form-item label="Link de comunicação" prop="communicationLink">
                <el-input
                  v-model="communicationLink"
                  type="text"
                  maxlength="50"
                  show-word-limit
                  @blur="update()"
                />
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <strong>Url do projeto: </strong> <el-link type="primary" @click="openUrl(teamInfo.projectUrl)"> {{ teamInfo.projectUrl }} </el-link>
            <br>
            <strong>Link de comunicação: </strong> <el-link type="primary" @click="openUrl(teamInfo.communicationLink)"> {{ teamInfo.communicationLink }} </el-link>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-dialog
        v-if="canEdit"
        :title="editingMember ? 'Editar função do membro' : 'Adicionar novo membro' "
        :visible.sync="addMember"
        width="50%"
      >
        <el-form
          ref="form"
          v-loading="$store.getters.loading"
          class="team-form-1"
          label-position="top"
          label-width="130px"
        >
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="Aluno" prop="name">
                <el-select v-model="newTeamMember" :disabled="editingMember" filterable>
                  <el-option
                    v-for="student in students"
                    :key="student.id"
                    :label="`${student.name} (${student.email})`"
                    :value="student.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Função na equipe" prop="role">
                <el-select v-model="roles" multiple>
                  <el-option
                    v-for="roleList in rolesSelect"
                    :key="roleList.id"
                    :label="roleList.name"
                    :value="roleList.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="justify-end d-flex">
            <el-button
              plain
              @click="clear()"
            >
              Cancelar
            </el-button>
            <el-button
              :disabled="!roles.length > 0 || !newTeamMember"
              plain
              type="success"
              @click="editingMember ? updateRole() : update()"
            >
              {{ editingMember ? 'Salvar' : 'Adicionar' }}
            </el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog
      v-if="canEdit"
      title="Criar equipe"
      :visible.sync="createTeam"
      width="50%"
    >
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        class="team-form"
        label-position="top"
        label-width="130px"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="Nome" prop="name">
              <el-input
                v-model="teamName"
                type="text"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Sua função na equipe" prop="role">
              <el-select v-model="roles" multiple>
                <el-option
                  v-for="roleList in rolesSelect"
                  :key="roleList.id"
                  :label="roleList.name"
                  :value="roleList.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="justify-end d-flex">
          <el-button
            plain
            @click="createTeam = !createTeam"
          >
            Cancelar
          </el-button>
          <el-button
            plain
            type="primary"
            @click="save()"
          >
            Salvar
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TeamService from '@/services/TeamService'
import UserService from '@/services/UserService.js'

export default {
  data () {
    return {
      teams: [],
      students: [],
      addMember: false,
      createTeam: false,
      editingMember: false,
      teamName: '',
      roles: [],
      newTeamMember: '',
      rolesSelect: [],
      communicationLink: '',
      projectUrl: '',
      project: {}
    }
  },
  computed: {
    canEdit () {
      return this.$store.getters.isStudent && !this.project.finished
    }
  },
  created () {
    this.project = JSON.parse(JSON.stringify(this.$store.getters.selectedProject))
  },
  methods: {
    updateTeams () {
      TeamService
        .getTeam(this.project.id)
        .then(teams => {
          this.teams = teams
          if (this.$store.getters.isStudent && this.teams.length) {
            this.projectUrl = this.teams[0].projectUrl
            this.communicationLink = this.teams[0].communicationLink
          }
        })
        .catch((err) => {
          console.log(err)
          this.$notify({
            title: 'Ops!',
            message: 'Ocorreu um erro ao atualizar a equipe.',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    getRoles () {
      if (this.$store.getters.isStudent) {
        TeamService
          .getRoles()
          .then(roles => {
            this.rolesSelect = roles
          })
      }
    },
    getRoleObject () {
      const roleList = []
      this.roles.forEach(role => {
        roleList.push({ id: role })
      })
      return roleList
    },
    save () {
      TeamService.addTeam(
        {
          project: { id: this.project.id },
          name: this.teamName,
          roles: this.getRoleObject()
        }).then(() => {
        this.$notify({
          title: 'Equipe criada',
          message: 'A equipe foi criada com sucesso!',
          type: 'success',
          position: 'bottom-right'
        })
        this.createTeam = false
        this.updateTeams()
      })
        .catch(err => {
          if (err.response.status === 409) {
            this.$notify({
              title: 'Você já pertence a uma equipe!',
              message: 'Para criar uma nova equipe, é necessário sair da outra.',
              type: 'error',
              position: 'bottom-right'
            })
          } else {
            this.$notify({
              title: 'Ops!',
              message: 'Ocorreu um erro ao criar uma equipe.',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
      this.clear()
    },
    update () {
      if (this.projectUrl && this.communicationLink && ((!this.projectUrl.includes('http://') && !this.projectUrl.includes('https://')) || !this.projectUrl ||
      (!this.communicationLink.includes('http://') && !this.communicationLink.includes('https://')) || !this.communicationLink)) {
        this.$notify({
          title: 'Ops!',
          message: 'A url deve conter http:// ou https://.',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        const team = JSON.parse(JSON.stringify(this.teams[0]))
        if (this.newTeamMember) {
          team.studentTeamList.push({
            role: this.getRoleObject(),
            student: {
              id: this.newTeamMember
            }
          })
        }
        team.projectUrl = this.projectUrl
        team.communicationLink = this.communicationLink
        team.project = { id: this.project.id }
        TeamService.updateTeam(team)
          .then(() => {
            this.updateTeams()
          })
          .catch((err) => {
            if (err.response.status === 409) {
              this.$notify({
                title: 'Ops!',
                message: 'Este aluno já pertence a uma equpe.',
                type: 'error',
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: 'Ops!',
                message: 'Ocorreu um erro ao atualizar a equipe.',
                type: 'error',
                position: 'bottom-right'
              })
            }
          })
        this.clear()
      }
    },
    formatStudentRoles (member) {
      let roleString = ''
      member.role.forEach(role => {
        if (roleString.length > 0) {
          roleString += ' / '
        }
        roleString += role.name
      })
      return roleString
    },
    removeStudent (student) {
      this.$confirm(`Tem certeza que deseja remover ${student.student.name} da equipe?`, 'Remover aluno', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.$store.commit('SHOW_LOADING')
        TeamService.removeStudent(student.id)
          .then(() => {
            this.updateTeams()
            this.$notify({
              title: 'Sucesso!',
              message: `${student.student.name} foi removido do grupo`,
              type: 'success',
              position: 'bottom-right'
            })
          })
          .catch(err => {
            this.$throwError(err)
            this.$notify({
              title: 'Ops!',
              message: 'Ocorreu um erro ao remover o aluno da equipe.',
              type: 'error',
              position: 'bottom-right'
            })
          })
          .finally(() => {
            this.$store.commit('HIDE_LOADING')
          })
      })
    },
    getTeam () {
      this.updateTeams()
      UserService
        .getStudentsUsers()
        .then(students => {
          this.students = students
        })
      this.getRoles()
    },
    editMember (member) {
      this.editingMember = member
      this.addMember = true
      this.newTeamMember = member.student.name
      member.role.forEach(item => {
        this.roles.push(item.id)
      })
    },
    clear () {
      this.editingMember = null
      this.addMember = false
      this.newTeamMember = ''
      this.roles = []
    },
    updateRole () {
      this.editingMember.role = this.getRoleObject()
      TeamService.updateStudentTeam(this.editingMember)
        .then(() => {
          this.$notify({
            title: 'Sucesso!',
            message: 'Função do aluno foi alterada.',
            type: 'success',
            position: 'bottom-right'
          })
          this.updateTeams()
        })
        .catch(() => {
          this.$notify({
            title: 'Ops!',
            message: 'Ocorreu um erro ao alterar a função do aluno.',
            type: 'error',
            position: 'bottom-right'
          })
        })
      this.clear()
    },
    openUrl (url) {
      const win = window.open(url, '_blank')
      win.focus()
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/_colors.scss';

.el-alert .el-alert__description {
  font-size: 14px;
}
.el-alert__closebtn el-icon-close {
  visibility: hidden !important;
}
.el-select {
  width: 100%;
}
.student-flex-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.team-member {
  background-color: white;
  border-radius: 50px;
  padding: 4px 18px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px outset #1c6ea436;
  filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.123));
}
.role-view {
  font-family: Open Sans;
  font-size: 14px;
  line-height: 14px;
  color: #9F9D9D;
  padding-top: 5px;
}

// overlay
.member-view {
  position: relative;
}
.image {
  display: block;
  width: 100%;
  height: auto;
}
.overlay {
  border-radius: 50px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transition: .60s ease;
  background-color: #00000094
}
.member-view:hover .overlay {
  opacity: 1;
}
.icon {
  color: #d0cccc;
  font-size: 16px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
}
.icon:hover {
  color: #e6e5e5;
}
.member-name {
  color: $--color-text-regular;
}
.el-collapse {
    border-top: none;
}
</style>
