<template>
    <div class="project-creation">
        <div class="box project-creation__content">
            <div class="box__header">
                <h4 class="title">Criar novo projeto</h4>
                <a href @click.prevent="closeCreation()" class="close">
                    <i class="material-icons">close</i>
                </a>

            </div>
            <div class="box__body project-creation__form">
                <form @submit.prevent="submitProject">
                    <v-text-field 
                        label="Titulo"
                        :maxlength="30"
                        counter
                        v-model="project.title"/>

                    <v-textarea
                        :maxlength="1000"
                        clearable
                        counter
                        clear-icon="cancel"
                        v-model="project.shortDescription"
                        rows="4"
                        outlined
                        label="Descrição curta">
                    </v-textarea>

                    <v-textarea
                        :maxlength="300"
                        clearable
                        counter
                        clear-icon="cancel"
                        v-model="project.notes"
                        rows="4"
                        outlined
                        label="Notas adicionais (links, referências, ...)">
                    </v-textarea>

                    <v-btn small color="#4472E9" class="white--text" :disabled="!isValid()" type="submit">
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
    methods: {
        isValid() {
            return this.project.title && this.project.shortDescription;
        },
        closeCreation() {
            this.$emit('close');
        },
        submitProject() {
            ProjectService
                .addProject(this.project)
                .then(() => {
                    EventBus.$emit('UPDATE_PROJECT_LIST');
                    this.closeCreation();
                });
        }
    },
	data() {
		return {
            project: {
                title: '',
                shortDescription: '',
                notes: ''
            }
        };
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
