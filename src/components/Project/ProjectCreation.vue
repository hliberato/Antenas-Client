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
                        v-model="project.title"/>
                    
                    <v-text-field 
                        label="Descrição curta"
                        v-model="project.shortDescription"/>

                    <v-textarea
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
                .then(project => {
                    this.$emit('created', project);
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
