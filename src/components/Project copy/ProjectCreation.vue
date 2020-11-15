<template>
  <div class="project-creation">
    <div class="box project-creation__content">
      <div class="box__header">
        <h4 class="title">
          Criar novo projeto
        </h4>
        <a
          href
          class="close"
          @click.prevent="closeCreation()"
        >
          <i class="material-icons">close</i>
        </a>
      </div>
      <div class="box__body project-creation__form">
        <form @submit.prevent="submitProject">
          <v-text-field
            v-model="project.title"
            label="Titulo"
            :maxlength="30"
            counter
          />

          <v-textarea
            v-model="project.shortDescription"
            :maxlength="1000"
            clearable
            counter
            clear-icon="cancel"
            rows="4"
            outlined
            label="Descrição curta"
          />

          <v-textarea
            v-model="project.notes"
            :maxlength="300"
            clearable
            counter
            clear-icon="cancel"
            rows="4"
            outlined
            label="Notas adicionais (links, referências, ...)"
          />

          <v-btn
            small
            color="#4472E9"
            class="white--text"
            :disabled="!isValid()"
            type="submit"
          >
            Salvar
          </v-btn>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectService from '@/services/ProjectService.js'
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'ProjectView',
  components: {
  },
  data () {
    return {
      project: {
        title: '',
        shortDescription: '',
        notes: ''
      }
    }
  },
  methods: {
    isValid () {
      return this.project.title && this.project.shortDescription
    },
    closeCreation () {
      this.$emit('close')
    },
    submitProject () {
      ProjectService
        .addProject(this.project)
        .then(() => {
          EventBus.$emit('UPDATE_PROJECT_LIST')
          this.closeCreation()
        })
    }
  }
}
</script>

<style scoped lang="scss">
.project-creation {
    &__field {
        margin-bottom: 16px;
    }
}
</style>
