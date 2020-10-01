<template>
    <div class="project-view">
        <div v-if="project" class="box project-view__project">
            <div class="box__header " style="padding: 0px">
                <!-- todo - trar o style -->
                <div>
                    <v-tabs>
                        <v-tab @click="selectTab('project')"> {{ project.title }} </v-tab>
                        <v-tab @click="selectTab('team')"> {{ getTabNAme() }} </v-tab>
                    </v-tabs>
                </div>
                
                <div class="flex-box">
                    <v-btn
                        v-if="($store.getters.isTeacher && !project.open && project.progress == 8) " 
                        small 
                        color="#4472E9" 
                        type="button"  
                        class="white--text" 
                        @click="evaluateStudents()"
                    >
                        Avaliar alunos
                    </v-btn>

                    <v-btn
                        v-if="($store.getters.isRepresentative && project.refused ) " 
                        small 
                        color="#4472E9" 
                        type="button"  
                        class="white--text" 
                        @click="deleteProject()"
                    >
                        Excluir projeto
                    </v-btn>
                    <div v-if="project && ($store.getters.isTeacher) && project.progress == 7" class="mr-3">
                        <v-btn
                            small 
                            color="#4472E9" 
                            type="button"  
                            class="white--text" 
                            @click="submit()"
                        >
                            {{ getButtonText() }}
                        </v-btn>

                        <p class="started-project" v-if="$store.getters.isTeacher && project && this.project.open && !project.progress == 7" >Projeto iniciado</p>
                    </div>
                    <div class="mr-2">   
                        <a href @click.prevent="closeProject()" class="close">
                            <i class="material-icons close">close</i>
                        </a>
                    </div>
                </div>
            </div>

            <div v-if="tabSelected === 'project'" class="project-view__box">
                <div class="box__body project-body">
                    <ProjectStatus class="project-view__phase" :project="project" v-if="!$store.getters.isStudent" />

                    <div v-if="!$store.getters.isStudent">
                        <br> <br> 
                    </div>
                    
                    <ProjectUpdateForm 
                        v-if="projectStatus === 'WAITING' && !project.refused"
                        :project="project"
                        class="project-view__form" 
                    />
                    
                    <div class="project-view">
                        <div class="project-view__field"
                            v-if="showMeetingDetails()">
                            <p class="label">Local e data da reunião:</p>
                            <div class="text text-mb-0">
                                {{ project.meeting.address.neighborhood }} 
                                {{ project.meeting.address.neighborhood && (project.meeting.address.street || project.meeting.address.number) ? ',' : ''}} 
                                {{ project.meeting.address.street }}
                                {{ project.meeting.address.number  ? ',' : '' }} 
                                {{ project.meeting.address.number }}
                                <div>
                                    {{ project.meeting.address.zipCode }} {{ project.meeting.address.city }}
                                </div> 
                            </div>
                            <p class="text">
                                <strong>Data e horario:</strong> {{ getDatetime(project.meeting.chosenDate) }}
                            </p>
                        </div>

                        <div class="project-view__field" v-if="project && project.semester">
                            <p class="label">Aplicado no {{ project.semester }}º semestre</p>
                        </div>
                        <div class="project-view__field" v-if="project && project.semester">
                            <span class="label">Professor responsável: </span>
                            <span class="text">{{ project.teacher.name }}</span>
                        </div>

                        <div class="project-view__field" v-if="project && project.shortDescription">
                            <p class="label">Descrição breve:</p>
                            <p class="text">{{ project.shortDescription }}</p>
                        </div>
                        
                        <div class="project-view__field" v-if="project && project.completeDescription">
                            <p class="label">Descrição completa:</p>
                            <p class="text">{{ project.completeDescription }}</p>
                        </div>
                        
                        <div class="project-view__field" v-if="project && project.technologyDescription">
                            <p class="label">Descrição da tecnologia:</p>
                            <p class="text">{{ project.technologyDescription }}</p>
                        </div>

                        <div class="project-view__field" v-if="project && project && project.notes">
                            <p class="label">Notas adicionais:</p>
                            <p class="text">{{ project.notes }}</p>
                        </div>

                        
                    </div>
                </div>
            </div>

            <TeamView v-if="tabSelected == 'team'" :projectId="project.id">
            </TeamView>
        </div>

        <div v-else class="project-view__empty">
            <div class="content">
                <i class="material-icons icon">touch_app</i>
                <p class="text">Selecione um projeto ao lado para saber mais</p>
                <v-btn small color="#4472E9" type="button" class="white--text"  @click="createProject()" v-if="$store.getters.isRepresentative">
                    Criar projeto
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectStatus from '@/components/Project/ProjectStatus.vue'
import ProjectUpdateForm from '@/components/Project/ProjectUpdateForm.vue'
import ProjectService from '@/services/ProjectService.js';
import TeamView from '@/components/team/TeamView.vue'
import EventBus from '@/helpers/EventBus.js'
import store from '../../store/index'

export default {
    name: 'ProjectView',
	components: {
        ProjectStatus,
        ProjectUpdateForm,
        TeamView,
    },
    computed: {
        projectStatus() {
            return this.getProjectStatus(this.project);
        },
    },
    mounted() {
        EventBus.$on('selectProject', (id) => {
            this.projectId = id;
            this.updateProject()
        });
    },
    methods: {
        selectTab(tab) {
            this.tabSelected = tab;
        },

        updateProject() {
            ProjectService.getProjectById(this.projectId)
                .then((res) => {
                    this.project = res
                    this.project.meeting.address.number = undefined;
                })
        },

        evaluateStudents() {
            EventBus.$emit('EVALUATE_STUDENTS', this.project.id);
        },

        getMembersList(ids) {
            return ids.map(id => this.students.filter(student => student.id == id)[0].name).join(', ');
        },

        getButtonText() {
            if (this.$store.getters.isTeacher) {
                if (!this.project.open) {
                    return "Iniciar projeto"
                }
                return "Finalizar projeto"
            }
        },

        getDatetime(chosenDate) {
            if (chosenDate) {
                let date = new Date(chosenDate);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
            }
            return 'A definir'
        },

        closeProject() {
            this.project = null
        },

        getTabNAme() {
            return this.$store.getters.isStudent ? "Equipe" : "Equipes";
        },

        createProject() {
            this.$emit('create');
        },

        submit() {
            if ((this.$store.getters.isTeacher || this.$store.getters.isCadi) && this.project.progress == 7 ) {
               this.project.open  = !this.project.open 
            }

            ProjectService.updateProject(this.project).then(() => {
                this.updateProject();
                setTimeout(() => this.updated = false, 5000);
            });
        },

        showMeetingDetails() {
            return (this.project && this.project.meeting && 
            (this.project.progress == 5 || this.project.progress == 6) && 
            (this.$store.getters.isCadi || this.$store.getters.isRepresentative));
        },

        getProjectStatus(project)  {
            if (project) {
                let isMeetingPhase = project.progress === 5;
                let hasMeeting = false;

                if (project.meeting != null) {
                    hasMeeting = project.meeting.chosenDate != null;
                }
                
                
                let isRefused = project.refused;
                let isDeliveryPhase = project.progress === 6;

                let isConcluded = project.finished;

                let isWaiting;

                if (store.getters.isRepresentative) {
                    isWaiting = project.progress === 3 || (isMeetingPhase && !hasMeeting && project.meeting.possibleDate.length);
                }
                else if (store.getters.isCadi) {
                    isWaiting = [2, 4].includes(project.progress) || (isMeetingPhase && !project.meeting.chosenDate) || (isDeliveryPhase && !project.teacher);
                }
                else if (store.getters.isTeacher) {
                    isWaiting = !!isDeliveryPhase;
                }
                else if (store.getters.isStudent) {
                    isWaiting = isDeliveryPhase && !project.deliver.some(entrega => entrega.students.includes(store.state.user.id));
                }

                if (isRefused) {
                    return 'REFUSED';
                }
                else if (isConcluded) {
                    return 'CONCLUDED';
                }
                else if (isWaiting) {
                    return 'WAITING';
                }
                else {
                    return 'PENDING';
                }
            }
        },

        deleteProject()  {
            ProjectService.deleteProject(this.project.id);
        }
    },
	data() {
		return {
            students: [],
            project: null,
            tabSelected: "project",
            projectID: null,
        };
	}
}
</script>

<style scoped lang="scss">
.close {
    margin-right: 2%;
    color: #6e6e6e;
}

.started-project {
    color: #A6A6A6;
    font-weight: 400;
    font-size: 12px;
    margin-top: 2px;
}

.v-application p {
    margin-bottom: 0px;
}

.v-tab {
    text-transform: none;
    font-size: 100%;
    font-weight: 600;
}

.text-mb-0 {
    margin-bottom: 0px;
}

.v-tabs-bar {
    height: 53px;
}

.box_header {
    &-tabs {
        padding: 0px !important;
    }
}
.not-selected {
    border-radius: 0px 4px 4px 0px;
    height: 35px;
    padding-top: 19px;
    padding-left: 20px;
    padding-right: 20px;
    -webkit-transition: color 1s ease-out;
    -moz-transition: color 1s ease-out;
    -o-transition: color 1s ease-out;
    transition: color 1s ease-out;

    color: #c0c0c0;
    cursor: pointer;
}

.not-selected:active {
    cursor: pointer;
}

.selected {
    padding-top: 19px;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: solid 3px #4472e9;
}

.project-view {
    &__box {
        max-height: 100%;
        height: calc(100% - 20px - (16px * 2));
        overflow-y: auto;
    }

    &__empty {
    
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border: 2px dashed #D6D1D1;
        border-radius: 4px;

        .content {
            
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #9E9E9E;

            .icon {
                font-size: 78px;
            }

            .text {
                max-width: 320px;
                font-size: 24px;
                font-weight: 600;
                text-align: center;
                margin: 24px 0;
                line-height: 1.4em;
            }
        }
    }

    &__project {
        height: 100%;

        .project-body {
            max-height: 100%;
            overflow-y: auto;
        }
    }

    &__field {

        margin-bottom: 16px;

        &--horizontal {
            display: flex;
            align-items: center;
        }
        
        .label {
            color: #A6A6A6;
            font-weight: 600;
            margin-bottom: 0px;
        }

        .text {
            line-height: 1.4em;
        }
    }

    &__link {
        padding: 8px;
        border: solid 1px #0084E3;
        border-radius: 4px;
        color: #0084E3;
        font-weight: 600;
        margin-right: 16px;
        display: block;
    }

    &__phase {
        margin-bottom: 16px;
    }

    &__form {
        margin-bottom: 16px;
    }

    &__deliver-item {
        margin-bottom: 16px;
        line-height: 1.3em;
        padding: 8px 0;
        border-bottom: solid 1px #ccc;
        strong {
            margin-right: 8px;
        }
        &:last-child {
            margin-bottom: 0;
            border-bottom: 0;
        }
    }
}
</style>
