<template>
    <form @submit.prevent="submit()" class="project-update-form">
        <h5 class="project-update-form__title">
            {{ getFormTitle() }}
        </h5>

        <fieldset class="project-update-form__section" v-if="updatedProject.progress === 3 && $store.getters.isRepresentative">

            <v-textarea
                clearable
                clear-icon="cancel"
                v-model="updatedProject.completeDescription"
                rows="4"
                outlined
                counter
                label="Descrição completa">
            </v-textarea>

            <v-textarea
                clearable
                clear-icon="cancel"
                v-model="updatedProject.technologyDescription"
                rows="4"
                counter
                outlined
                label="Descrição da tecnologia">
            </v-textarea>

        </fieldset >

        <fieldset class="project-update-form__section" v-if="updatedProject.progress === 5 && $store.getters.isCadi && !updatedProject.meeting.chosenDate">
            <v-text-field 
                label="Local da reunião - CEP"
                v-model="updatedProject.meeting.address.zipCode"/>

            <v-text-field 
                label="Local da reunião - Cidade"
                v-model="updatedProject.meeting.address.city"/>

            <v-text-field 
                label="Local da reunião - Rua"
                v-model="updatedProject.meeting.address.street"/>

            <v-text-field 
                label="Local da reunião - Numero"
                v-model="updatedProject.meeting.address.number"/>
                
            <span class="date-input-title">Data da reunião</span><br>

            <div class="grid-date  ">
                <div> 
                    <datetime 
                        class="date-input"
                        input-id="pickDateTime"
                        v-model="newMeetingDate" 
                        type="datetime"
                        :use12-hour='false'
                        :minute-step='5'
                        :auto="true"
                        :phrases="{ok: 'Ok', cancel: 'Cancelar'}"
                        format="dd/LL/yyyy T"
                    /> 
                    <i class="material-icons input-icon " @click="openCalendar()">event</i>

                </div>
                <v-btn 
                    small 
                    color="#4472E9" 
                    class="white--text form-button" 
                    type="button" 
                    @click="addPossibleDate()"
                    :disabled="newMeetingDate == null || newMeetingDate == ''"
                >
                    Adicionar data
                </v-btn>
            </div>
            
            <ul v-if="updatedProject.meeting.possibleDate.length">
                <span class="date-title">Datas cadastradas:</span>
                <div class="flex-box">
                    <div class="rounded-background flex-box" v-for="(possibleDate, index) in updatedProject.meeting.possibleDate || []" :key="possibleDate.datetime">
                        <span>{{ getFormatedDate(possibleDate.dateTime) }}</span>
                        <i @click.prevent="removePossibleDate(index)" class="material-icons black-color">close</i>
                    </div>
                </div>
            </ul>
        </fieldset>

        <fieldset class="project-update-form__section" v-if="project.progress === 6 && $store.getters.isCadi">
            <v-select
                :items="getTeachersOptions()"
                label="Professor responsável"
                :item-text="'label'"
                :item-value="'value'"
                v-model="selectedTeacher"
                id="meeting-date">
            </v-select>

            <v-text-field
                label="Semestre"
                v-model="semester"
                type="number"
                :rules="semester_rules"
            />

        </fieldset>

        <fieldset class="project-update-form__section" v-if="updatedProject.progress === 5 && $store.getters.isRepresentative && updatedProject.meeting.possibleDate">
            <v-select
                :items="getMeetingOptions()"
                label="Data da reunião"
                :item-text="'label'"
                :item-value="'value'"
                v-model="chosenDate"
                id="meeting-date">
            </v-select>
        </fieldset>

        <div v-if="showSaveButton()">
            <v-btn 
                small 
                color="#4472E9"
                class="white--text ml-87" 
                type="button"  
                @click="submit(true)">
                Salvar
            </v-btn>
        </div>

        <v-row class="button-position" v-if="isToApproveOrDeny()">
            <v-col cols="6" class="ml-0">
                <v-btn 
                    small 
                    color="#4472E9"
                    class="white--text" 
                    type="button"  
                    @click="submit(true)">
                    <v-icon left>check</v-icon>
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
                    <v-icon left>close</v-icon>
                    Rejeitar
                </v-btn>
            </v-col>
        </v-row>
    </form>
</template>

<script>
import ProjectService from '@/services/ProjectService.js';
import UserService from '@/services/UserService.js';
import { Datetime } from 'vue-datetime';
import $ from 'jQuery'

export default {
    name: 'ProjectUpdateForm',
    props: {
        project: Object
    },
    components: {
        Datetime
    },
    mounted() {
        UserService
            .getTeacherUsers()
            .then(teachers => this.teachers = teachers);

        UserService
            .getStudentsUsers()
            .then(students => this.students = students);
    },
    computed: {
        updatedProject() {
            return this.project;
        },
        isValid() {
            let project = this.updatedProject;
            return {
                3: this.$store.getters.isRepresentative && project.completeDescription && project.technologyDescription,
                5: (this.$store.getters.isRepresentative && this.chosenDate) || (this.$store.getters.isCadi && project.meeting.possibleDate && project.meeting.possibleDate.length && project.meeting.address),
                6: (this.$store.getters.isCadi && this.selectedTeacher) || 
                    (this.$store.getters.isTeacher && this.selectedStudent) ||
                    (this.$store.getters.isStudent && this.deliver.link)
            }[project.progress];
        }
    },
    methods: {
        getFormTitle() {
            if (this.updated) {
                return 'Atualizações enviadas com sucesso!';
            } else if (this.$store.getters.isRepresentative) {
                return 'Atualize as informações do seu projeto para prosseguir:';
            } else if (this.$store.getters.isCadi && [2, 4].includes(this.project.progress)) {
                return 'Leia as especificações do projeto e decida se ele está apto a continuar:';
            } else if (this.$store.getters.isCadi && this.project.progress === 5) {
                return 'Escolha opções de datas para uma reunião com o representante do projeto:';
            } else if (this.$store.getters.isCadi && this.project.progress === 6) {
                return 'Selecione o semestre em qual o projeto será realizado e um professor para ser o responsável:';
            } 
        },
        openCalendar() {
            $("#pickDateTime").click()
        },
        getMeetingOptions() {
            return this.updatedProject.meeting.possibleDate.map(option => ({ 
                label: this.getFormatedDate(option.dateTime), 
                value: option.dateTime 
            }));
        },
        isToApproveOrDeny() {
            return this.$store.getters.isCadi && [2, 4].includes(this.project.progress);
        },
        addPossibleDate() {
            if (!this.updatedProject.meeting.possibleDate) {
                this.updatedProject.meeting.possibleDate = [];
            }

            let dateObject = new Date(this.newMeetingDate);
            this.updatedProject.meeting.possibleDate.push({ dateTime: dateObject });
            this.newMeetingDate = null;
            
        },
        getTeachersOptions() {
            return [...this.teachers.map(teacher => ({ label: teacher.name, value: teacher.id }))];
        },
        submit(approved) {
            if (this.$store.getters.isCadi && this.updatedProject.progress == 6) {
                this.updatedProject.teacher = {
                    id: this.selectedTeacher
                }
            }

            else if (this.$store.getters.isTeacher) {
                this.updatedProject.started = true;
            }

            if (this.chosenDate) {
                this.updatedProject.meeting.chosenDate = this.chosenDate;
            }
            if (this.deliver.link) {
                this.updatedProject.deliver.push(this.deliver);
            }

            if(this.semester) {
                this.updatedProject.semester = this.semester;
            }

            ProjectService.updateProject(this.updatedProject, approved).then(() => {
                this.selectedTeacher = null;
                this.selectedStudent = null;
                this.deliver = {};
                this.updated = true;
                setTimeout(() => this.updated = false, 5000);
            });
        },
        forceTwoChars(number) {
            return ("0" + number).slice(-2);
        },
        getFormatedDate(dateRaw) {
            let date = new Date(dateRaw);
            let day = this.forceTwoChars(date.getDate());
            let month = this.forceTwoChars(date.getMonth());
            let year = date.getFullYear();
            let hour = this.forceTwoChars(date.getHours());
            let minute = this.forceTwoChars(date.getMinutes());
            return `${day}/${month}/${year} ${hour}:${minute}`;
        },
        removePossibleDate(index) {
            this.updatedProject.meeting.possibleDate.splice(index, 1);
        },
        showSaveButton() {
            return (this.$store.getters.isRepresentative && this.updatedProject.progress === 3) || 
            (this.project.progress === 5 && this.$store.getters.isCadi && !this.project.meeting.chosenDate) || 
            (this.project.progress === 5 && this.$store.getters.isRepresentative && this.project.meeting.possibleDate) ||
            (this.project.progress === 6 && this.$store.getters.isCadi);
        },
    },
    data() {
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
                semester => (semester && semester > 0 ) || 'Insira um semestre válido.'
            ]
        };
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