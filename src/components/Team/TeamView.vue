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
        v-if="$store.getters.isStudent && teams.length == 0 && !createTeam"
        center
        type="warning"
        prominent
        border="left"
      >
        <el-button type="text" @click="createTeam = !createTeam">Crie uma equipe</el-button> ou peça para um colega te adicionar em uma.
      </el-alert>
    </div>
    <div v-else-if="teams.length > 0 && !createTeam">
      <div v-for="team in teams" :key="team.id">
        <h2>{{ team.name }}</h2>
        <h4>Membros</h4>
        <div
          v-for="member in team.studentTeamList"
          :key="member.label"
          :type="member.type"
        >
          <div @click="editMember(member)">
            {{ member.student.name }}
            <br>
            {{ formatStudentRoles(member) }}
          </div>
          <el-button
            icon="el-icon-close"
            @click="removeStudent(member)"
          />
        </div>
        <br><br>
        <el-button
          plain
          type="primary"
          @click="addMember = !addMember"
        >
          {{ 'Adicionar novo membro' }}
        </el-button>
        <el-dialog
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
                  <el-select v-model="newTeamMember" :disabled="editingMember">
                    <el-option
                      v-for="student in students"
                      :key="student.id"
                      :label="student.name"
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
                plain
                type="success"
                @click="editingMember ? updateRole() : update(team)"
              >
                {{ editingMember ? 'Salvar' : 'Adicionar' }}
              </el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <el-dialog
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
          {{ rolesSelect }}
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
  props: {
    project: {
      type: Object,
      default () {
        return {}
      }
    }
  },
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
      rolesSelect: []
    }
  },
  methods: {
    updateTeams () {
      TeamService
        .getTeam(this.project.id)
        .then(teams => {
          this.teams = teams
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
        alert('Equipe criada')
        this.updateTeams()
          .catch(() => {
            alert('Ocorreu um erro ao criar a equipe')
          })
      })
      this.clear()
    },
    update (team) {
      team.studentTeamList.push({
        role: this.getRoleObject(),
        student: {
          id: this.newTeamMember
        }
      })
      TeamService.updateTeam(team)
        .then(() => {
          alert('Equipe atualizada')
          this.updateTeams()
        })
        .catch((err) => {
          if (err.response.status === 409) {
            alert('Este aluno já pertence a uma equpe.')
          } else {
            alert('Ocorreu um erro ao atualizar a equipe')
          }
        })
      this.clear()
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
            alert(`${student.student.name} foi removido do grupo`)
          })
          .catch(err => {
            this.$throwError(err)
            alert('Ocorreu um erro ao remover o aluno da equipe')
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
      this.roles = member.role
      console.log(this.roles)
      console.log(this.rolesSelect)
    },
    clear () {
      this.editingMember = ''
      this.addMember = false
      this.newTeamMember = ''
      this.roles = []
    },
    updateRole () {
      this.editingMember.role = this.getRoleObject()
      TeamService.updateStudentTeam(this.editingMember)
        .then(() => {
          alert('Equipe atualizada')
          this.updateTeams()
        })
        .catch(() => alert('Ocorreu um erro ao atualizar as informações'))
      this.clear()
    }
  }
}
</script>

<style scoped lang="scss">
.el-alert .el-alert__description {
  font-size: 14px;
}
.el-icon-close {
  visibility: hidden !important;
}
.el-select {
    width: 100%;
}
</style>
