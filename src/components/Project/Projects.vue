<template>
	<div class="box projects">
        <div class="box__header">
            <h4 class="text-title">Meus projetos</h4>
            <div class="actions">
                <v-btn small color="#4472E9" v-if="$store.getters.isRepresentative" class="white--text" @click="createProject()">
                    Criar
                </v-btn>
            </div>
        </div>
        <ul class="box__body box__body--no-horizontal-padding projects__list">
            <li class="projects__item" v-for="project in projects" :key="project.id">
                <a  href
                    @click.prevent="selectProject(project.id)" 
                    class="projects__item-content"
                    :class="`projects__item-content--${getProjectStatus(project)}`">

                    <div class="status" :class="`projects__item-content--${getProjectStatus(project)}`"></div>

                    <div class="content">
                        <span class="text-title">{{ project.title }} </span>
                        
                        <p class="description">
                            {{ project.shortDescription }}
                        </p>
                        <div class="flex-box">
                            <div class="updated">
                                <span>Atualizado em:</span>
                                <strong>{{ formatDate(project.createdAt) }}</strong>
                            </div>
                            <v-spacer></v-spacer>
                            <div class="phase" :class="`phase--${getProjectStatus(project)}`">
                                <strong  >{{ phase(project.progress) }} </strong>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
        </ul>
	</div>
</template>

<script>
import EventBus from '@/helpers/EventBus.js'
import ProjectService from '@/services/ProjectService.js'
import store from '../../store/index'

export default {
	name: 'Projects',
	components: {
    },
    mounted() {
        EventBus.$on('UPDATE_PROJECT_LIST', () => {
            this.updateProjects();
        });

        this.updateProjects();
    },

    methods: {
        phase(progress) {
            return this.$store.state.phases[progress];
        },

        updateProjects() {
            ProjectService
            .getProjects().then(res => {
                this.projects = res;
            })
        },

        addZero(number) {
            number = number.toString();

            if (number.length < 2) {
                return `0${number}`;
            }
            return number;
        },
        formatDate(datetime) {
            let date = new Date(datetime);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();

            return `${this.addZero(day)}/${this.addZero(month)}/${year}`;
        },
        selectProject(projectId) {
            EventBus.$emit('selectProject', projectId);
        },
        createProject() {
            this.$emit('create');
        },
        getProjectPhase () {
            if (['WAITING', 'PENDING'].includes(this.projectStatus)) {
                return this.phases[this.project.progress];
            }
            else if (this.project.refused) {
                return 'Recusado';
            }
            else {
                return 'Concluído';
            }
        },
        getProjectStatus(project)  {
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
                return 'refused';
            }
            else if (isConcluded) {
                return 'concluded';
            }
            else if (isWaiting) {
                return 'waiting';
            }
            else {
                return 'pending';
            }
        }
    },
	data() {
		return {
            projects: [],
        };
	}
}
</script>

<style scoped lang="scss">

.col-5 {
    padding-right: 11px !important;
}

.col {
    padding-bottom: 0px;
    padding-top: 0px;
    padding-right: 0px;
}

.phase {
    font-size: 9px;
    line-height: 12px;
    $background-opacity: .95;
    margin-top: 16px;
    text-align: right;

    &--waiting {
        color: #2C73DD !important;
    }

    &--pending {
        color: #cbb329 !important;
    }

    &--refused {
        color: #DD2C2C !important;
    }

    &--concluded {
        color: #3FEC7A !important;
    }
}

.projects {

    &__item-content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: white;
        transition: background-color .2s ease-in-out;
        font-size: 14px;
        
        &:hover {
            background-color: #f3f3f3;
        }
        &:focus {
            background-color: #FAFAFA;
        }

        .status {
            height: 100%;
            width: 6px;
        }

        .content {
            font-size: 12px;
            display: flex;
            flex-direction: column;
            margin-left: 17px;
            min-width: 90%;
            max-width: 90%;

            .text-title {
                color: #0084E3;
                font-size: 16px !important;
                line-height: 0 !important;
                font-weight: 600;
                padding-top: 11px;
            }

            .description {
                white-space: nowrap;
                max-width: 384px;
                color: #848484;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 6px 0 0 0 !important;
            }

            .updated {
                color: #C9C9C9;
                margin-top: 10px;
                font-weight: 300;

                strong {
                    margin-left: 8px;
                }
            }
        }

        &--waiting {
            .status {
                background-color: #2C73DD !important;
            }
        }

        &--pending {
            .status {
                background-color: #f8da30 !important;
            }
        }

        &--refused {
            .status {
                background-color: #DD2C2C !important;
            }
        }

        &--concluded {
            .status {
                background-color: #3FEC7A !important;
            }
        }
    }

    &__item {
        height: 78px;
        width: 100%;
        margin-top: 16px;

        &:first-child {
            margin-top: 0;
        }
    }

    &__list {
        max-height: 100%;
        height: calc(100% - 20px - (#{16px} * 2));
        overflow-y: auto;
    }
}
</style>
