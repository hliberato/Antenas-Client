<template>
  <form
    class="project-update-form"
    @submit.prevent="submit()"
  >
    <h5 class="project-update-form__title">
      {{ getFormTitle() }}
    </h5>

    <fieldset
      v-if="updatedProject.progress === 3 && $store.getters.isRepresentative"
      class="project-update-form__section"
    >
      <v-textarea
        v-model="updatedProject.completeDescription"
        clearable
        clear-icon="cancel"
        rows="4"
        outlined
        :maxlength="1000"
        counter
        label="Descrição completa"
      />

      <v-textarea
        v-model="updatedProject.technologyDescription"
        clearable
        clear-icon="cancel"
        rows="4"
        counter
        :maxlength="1000"
        outlined
        label="Descrição da tecnologia"
      />
    </fieldset>

    <fieldset
      v-if="updatedProject.progress === 5 && $store.getters.isCadi && !updatedProject.meeting.chosenDate"
      class="project-update-form__section"
    >
      <v-text-field
        v-model="updatedProject.meeting.address.zipCode"
        label="Local da reunião - CEP"
        @blur="findAddressByCep()"
      />

      <v-text-field
        v-model="updatedProject.meeting.address.city"
        label="Local da reunião - Cidade"
      />

      <v-text-field
        v-model="updatedProject.meeting.address.street"
        label="Local da reunião - Rua"
      />

      <v-text-field
        v-model="updatedProject.meeting.address.neighborhood"
        label="Local da reunião - Bairro"
      />

      <v-text-field
        v-model="updatedProject.meeting.address.number"
        label="Local da reunião - Numero"
      />

      <span class="date-input-title">Data da reunião</span><br>

      <div class="grid-date ">
        <div>
          <datetime
            v-model="newMeetingDate"
            class="date-input"
            input-id="pickDateTime"
            type="datetime"
            :use12-hour="false"
            :minute-step="5"
            :auto="true"
            :phrases="{ok: 'Ok', cancel: 'Cancelar'}"
            format="dd/LL/yyyy T"
          />
          <i
            class="material-icons input-icon "
            @click="openCalendar()"
          >event</i>
        </div>
        <v-btn
          small
          color="#4472E9"
          class="white--text form-button"
          type="button"
          :disabled="newMeetingDate == null || newMeetingDate == ''"
          @click="addPossibleDate()"
        >
          Adicionar data
        </v-btn>
      </div>

      <ul v-if="updatedProject.meeting.possibleDate.length">
        <span class="date-title">Datas cadastradas:</span>
        <div class="flex-box">
          <div
            v-for="(possibleDate, index) in updatedProject.meeting.possibleDate || []"
            :key="possibleDate.datetime"
            class="rounded-background flex-box"
          >
            <span>{{ getFormatedDate(possibleDate.dateTime) }}</span>
            <i
              class="material-icons black-color"
              @click.prevent="removePossibleDate(index)"
            >close</i>
          </div>
        </div>
      </ul>
    </fieldset>

    <fieldset
      v-if="project.progress === 6 && $store.getters.isCadi"
      class="project-update-form__section"
    >
      <v-select
        id="meeting-date"
        v-model="selectedTeacher"
        :items="getTeachersOptions()"
        label="Professor responsável"
        :item-text="'label'"
        :item-value="'value'"
      />

      <v-text-field
        v-model="semester"
        label="Semestre"
        type="number"
        :rules="semester_rules"
      />
    </fieldset>

    <fieldset
      v-if="updatedProject.progress === 5 && $store.getters.isRepresentative && updatedProject.meeting.possibleDate"
      class="project-update-form__section"
    >
      <v-select
        id="meeting-date"
        v-model="chosenDate"
        :items="getMeetingOptions()"
        label="Data da reunião"
        :item-text="'label'"
        :item-value="'value'"
      />
    </fieldset>

    <div v-if="showSaveButton()">
      <v-btn
        small
        color="#4472E9"
        class="white--text ml-87"
        type="button"
        :disabled="buttonDisabled()"
        @click="submit(true)"
      >
        Salvar
      </v-btn>
    </div>

    <v-row
      v-if="isToApproveOrDeny()"
      class="button-position"
    >
      <v-col
        cols="6"
        class="ml-0"
      >
        <v-btn
          small
          color="#4472E9"
          class="white--text"
          type="button"
          @click="submit(true)"
        >
          <v-icon left>
            check
          </v-icon>
          Aprovar
        </v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn
          small
          color="#DD2C2C"
          type="button"
          class="white--text"
          @click="submit(false)"
        >
          <v-icon left>
            close
          </v-icon>
          Rejeitar
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script>
import ProjectService from '@/services/ProjectService.js'
import UserService from '@/services/UserService.js'
import { Datetime } from 'vue-datetime'
import EventBus from '@/helpers/EventBus.js'
import $ from 'jQuery'

export default {
  name: 'ProjectUpdateForm',
  components: {
    Datetime
  },
  props: {
    project: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      newPossibleDate: '',
      newMeetingDate: null,
      updated: false,
      teachers: [],
      students: [],
      selectedTeacher: null,
      selectedMember: null,
      semester: null,
      deliver: {
        link: '',
        comment: '',
        responsible: { id: this.$store.state.user.id },
        students: [{ id: this.$store.state.user.id }]
      },
      selectedStudent: null,
      chosenDate: undefined,

      semester_rules: [
        semester => !!semester || 'Campo obrigatório',
        semester => (semester && semester < 7) || 'Insira um semestre válido.',
        semester => (semester && semester > 0) || 'Insira um semestre válido.'
      ]
    }
  },
  computed: {
    updatedProject () {
      return this.project
    },
    isValid () {
      const project = this.updatedProject
      return {
        3: this.$store.getters.isRepresentative && project.completeDescription && project.technologyDescription,
        5: (this.$store.getters.isRepresentative && this.chosenDate) || (this.$store.getters.isCadi && project.meeting.possibleDate && project.meeting.possibleDate.length && project.meeting.address),
        6: (this.$store.getters.isCadi && this.selectedTeacher) ||
                    (this.$store.getters.isTeacher && this.selectedStudent) ||
                    (this.$store.getters.isStudent && this.deliver.link)
      }[project.progress]
    }
  },
  mounted () {
    UserService
      .getTeacherUsers()
      .then(teachers => { this.teachers = teachers })

    UserService
      .getStudentsUsers()
      .then(students => { this.students = students })
  },
  methods: {
    getFormTitle () {
      if (this.updated) {
        return 'Atualizações enviadas com sucesso!'
      } else if (this.$store.getters.isRepresentative) {
        if (this.project.progress === 5) {
          return 'Selecione uma data a para a reunião:'
        }
        return 'Atualize as informações do seu projeto para prosseguir:'
      } else if (this.$store.getters.isCadi && [2, 4].includes(this.project.progress)) {
        return 'Leia as especificações do projeto e decida se ele está apto a continuar:'
      } else if (this.$store.getters.isCadi && this.project.progress === 5) {
        return 'Insira informações sobre a reunião:'
      } else if (this.$store.getters.isCadi && this.project.progress === 6) {
        return 'Selecione o semestre em qual o projeto será realizado e um professor para ser o responsável:'
      }
    },
    openCalendar () {
      $('#pickDateTime').click()
    },
    getMeetingOptions () {
      return this.updatedProject.meeting.possibleDate.map(option => ({
        label: this.getFormatedDate(option.dateTime),
        value: option.dateTime
      }))
    },
    isToApproveOrDeny () {
      return this.$store.getters.isCadi && [2, 4].includes(this.project.progress)
    },
    addPossibleDate () {
      if (!this.updatedProject.meeting.possibleDate) {
        this.updatedProject.meeting.possibleDate = []
      }

      const dateObject = new Date(this.newMeetingDate)
      this.updatedProject.meeting.possibleDate.push({ dateTime: dateObject })
      this.newMeetingDate = null
    },
    getTeachersOptions () {
      return [...this.teachers.map(teacher => ({ label: teacher.name, value: teacher.id }))]
    },
    buttonDisabled () {
      if (this.$store.getters.isRepresentative && this.project.progress === 3 &&
                this.updatedProject.completeDescription && this.updatedProject.technologyDescription) {
        return false
      }
      if (this.$store.getters.isCadi && this.project.progress === 6 &&
                this.selectedTeacher && this.semester) {
        return false
      }
      if (this.getMeetingOptions().length > 0 && this.chosenDate) {
        return false
      }
      if (this.updatedProject.progress === 5 && this.$store.getters.isCadi && (this.updatedProject.meeting.address.zipCode.length > 0 ||
            this.updatedProject.meeting.address.city.length > 0 || this.updatedProject.meeting.address.street.length > 0 ||
            this.updatedProject.meeting.address.number || this.updatedProject.meeting.possibleDate.length > 0)) {
        return false
      }

      return true
    },
    submit (approved) {
      if (this.$store.getters.isCadi && this.updatedProject.progress === 6) {
        this.updatedProject.teacher = {
          id: this.selectedTeacher
        }
      } else if (this.$store.getters.isTeacher) {
        this.updatedProject.started = true
      }

      if (this.chosenDate) {
        this.updatedProject.meeting.chosenDate = this.chosenDate
      }
      if (this.deliver.link) {
        this.updatedProject.deliver.push(this.deliver)
      }

      if (this.semester) {
        this.updatedProject.semester = this.semester
      }

      ProjectService.updateProject(this.updatedProject, approved).then(() => {
        this.selectedTeacher = null
        this.selectedStudent = null
        this.deliver = {}
        this.updated = true
        EventBus.$emit('UPDATE_PROJECT_LIST')
        setTimeout(() => { this.updated = false }, 5000)
      })
    },
    updateProject () {
      ProjectService.getProjectById(this.project.id).then((project) => {
        this.project = project
      })
    },
    forceTwoChars (number) {
      return ('0' + number).slice(-2)
    },
    getFormatedDate (dateRaw) {
      const date = new Date(dateRaw)
      const day = this.forceTwoChars(date.getDate())
      const month = this.forceTwoChars(date.getMonth())
      const year = date.getFullYear()
      const hour = this.forceTwoChars(date.getHours())
      const minute = this.forceTwoChars(date.getMinutes())
      return `${day}/${month}/${year} ${hour}:${minute}`
    },
    removePossibleDate (index) {
      this.updatedProject.meeting.possibleDate.splice(index, 1)
    },
    showSaveButton () {
      return (this.$store.getters.isRepresentative && this.updatedProject.progress === 3) ||
            (this.project.progress === 5 && this.$store.getters.isCadi && !this.project.meeting.chosenDate) ||
            (this.project.progress === 5 && this.$store.getters.isRepresentative && this.project.meeting.possibleDate) ||
            (this.project.progress === 6 && this.$store.getters.isCadi)
    },
    findAddressByCep () {
      const cep = this.updatedProject.meeting.address.zipCode
      let address
      if (/^[0-9]{5}-[0-9]{3}$/.test(cep) || /^[0-9]{5}[0-9]{3}$/.test(cep)) {
        $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (res) {
          address = res
        }).then(() => {
          this.updatedProject.meeting.address.city = address.localidade
          this.updatedProject.meeting.address.street = address.logradouro
          this.updatedProject.meeting.address.neighborhood = address.bairro
          this.updatedProject.meeting.address.zipCode = address.cep
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.date-title {
    font-size: 15px;
}

.black-color {
    color: #6e6e6e;
}

.v-application ul {
    padding-left: 0px;
    padding-top: 10px;
}

.ml-87 {
    margin-left: 87%;
}

.date-input-title {
    margin-top: 20px;
    font-weight: 400;
    font-size: 12px;
    color: #606369;
}
.date-input {
    border-bottom: 1px solid #8c8a8a;
    padding-left: 40px;
}

.input-icon {
    float: left;
    margin-left: 7px;
    margin-top: -27px;
    position: relative;
    z-index: 2;
}

.material-icons:hover{
    cursor: pointer;
}

.grid-date {
    display: grid;
    grid-template-columns: calc(50% - #{16px} * 2) calc(30% - #{16px} * 2);
    grid-gap: calc(37% - #{16px} * 2);
}

.ml-0 {
    margin-left: 0px;
}

.button-position {
    margin-left: 50%;
}
.rounded-background {
    margin-right: 10px;
    background-color: white;
    border-radius: 50px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;
    padding-right: 10px;
    margin-bottom: 10px;
}

.project-update-form {
    background-color: #eaf0ff;
    border: solid 1px #a3b8ec;
    padding: 8px;
    border-radius: 3px;

    &__title {
        font-weight: 600;
        margin-bottom: 16px;
        color: #4472E9;
    }

    &__section {
        margin-bottom: 16px;

        .form-button {
            margin-right: 16px;

            &:last-child {
                margin-right: 0;
            }

            &-mr-15 {
                margin-right: 15px !important;
            }
        }
    }

    &__field {
        margin-bottom: 8px;
    }

    &__section,

    &__field {
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
