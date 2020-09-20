<template>
    <div class="project-status">
        <div :class="getAccessClass()">
            <span class="project-status__label">{{ getLabel() }}:</span>
            <a class="project-status__button" >
                {{ getButtonContent() }}
            </a>
        </div>
        
        <ProgressStep :length="9" :progress="this.project.progress" :tips="getTips()" v-if="!$store.getters.isStudent"/>

        <!-- <div class="project-status__popup" v-if="popupActive">
            <a  href 
                @click.prevent="hidePopup()" 
                class="close-icon" >
                <i class="material-icons close-icon">close</i>
            </a>

            <Timeline :progress="project.progress" />
        </div> -->
    </div>
</template>

<script>
// import Timeline from '@/components/Timeline.vue';
import ProgressStep from '@/components/progress-steps/progress-step.vue'
import store from '../../store/index'

export default {
    props: {
        project: Object
    },
    computed: {
        phases() {
            return this.$store.state.phases;
        },
        projectStatus() {
            return this.getProjectStatus(this.project);
        }
    },
    components: {
        ProgressStep
    },
    methods: {
        // showPopup () {
        //     this.popupActive = true;
        // },
        // hidePopup () {
        //     this.popupActive = false;
        // },
        getAccessClass () {
            if (this.projectStatus) {
                let base = 'project-status__access';
                let modificador = base + `--${this.projectStatus.toLowerCase()}`;
                return [base, modificador];
            }
        },
        getLabel () {
            if (['WAITING', 'PENDING'].includes(this.projectStatus)) {
                return 'Fase do projeto';
            }
            else {
                return 'Status do projeto';
            }
        },
        getButtonContent () {
            if (['WAITING', 'PENDING'].includes(this.projectStatus)) {
                if (this.project.progress === 5 && this.$store.getters.isRepresentative && this.project.meeting.possibleDate.length == 0) {
                    return `${this.phases[this.project.progress]} - Aguardando informações.`
                } else if (this.project.progress === 5 && this.$store.getters.isCadi && this.project.meeting.possibleDate.length > 0) {
                    return `${this.phases[this.project.progress]} - Aguardando representante.`
                }
                return this.phases[this.project.progress];
            }
            else if (this.project.refused) {
                return 'Recusado';
            }
            else {
                return 'Concluído';
            }
        },
        getTips () {
            return [
                'Cadastro inicial',
                'Avaliação inicial',
                'Cadastro detalhado',
                'Avaliação detalhada',
                'Reunião',
                'Designar responsável',
                'Entrega',
                'Avaliação',
                'Finalizado'
            ]
            
        },
        getProjectStatus(project)  {
            let isMeetingPhase = project.progress === 5;
            let hasMeeting = false;

            if (project.meeting != null) {
                hasMeeting = project.meeting.chosenDate != null;
            }
            
            
            let isRefused = project.refused;
            let isDeliveryPhase = project.progress === 6;

            let isConcluded = project.finished == true;

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
    data() {
        return {
            popupActive: false
        };
    }
}
</script>

<style lang="scss" scoped>
    .project-status {

        position: relative;

        &__button {
            margin-left: 4px;
            font-weight: 600;
        }

        &__label {
            color: #A6A6A6;
            font-weight: 600;
        }

        &__popup {
            position: absolute;
            padding: 8px;
            border-radius: 3px;
            box-shadow: shadow-depth(2);
            left: 140px;
            top: 20px;

            .close-icon {
                color: white;
                position: absolute;
                right: 2px;
                top: 2px;
                font-size: 16px;
            }
        }

        &__access {
            font-size: 16px;
            $background-opacity: .95;

            &--refused {
                
                .project-status__button {
                    color: #DD2C2C;
                }

                + .project-status__popup {
                    background-color: rgba(#DD2C2C, .95);
                }
            }

            &--waiting {
                
                .project-status__button {
                    color: #2C73DD;
                }

                + .project-status__popup {
                    background-color: rgba(#2C73DD, .95);
                }
            }

            &--pending {
                
                .project-status__button {
                    color: #f3c017;
                }

                + .project-status__popup {
                    background-color: rgba(#f3c017, .95);
                }
            }

            &--concluded {
                
                .project-status__button {
                    color: #3BBC48;
                }

                + .project-status__popup {
                    background-color: rgba(#3BBC48, .95);
                }
            }
        }
    }
</style>