<template>
    <div class="box ">
        <div class="box__header " >
            <div> Carro Voador </div>

            <div class="mr-2">   
                <a href @click.prevent="leaveEvaluation()" class="close">
                    <i class="material-icons close">close</i>
                </a>
            </div>
        </div>

        <div  class="project-view__box">
            <div class="box__body project-body">
                <div class="evaluation-form">
                    <div v-for="team in teams" :key="team.id" :id="team.id">
                        <div>
                            {{ team.name }}
                        </div>
                        <div class="student flex-box" v-for="studentTeam in team.studentTeamList" :key="studentTeam.id">
                            <div >
                                <div class="flex-box">
                                    <v-checkbox 
                                        v-model="selectedStudents" 
                                        :label="studentTeam.student.name"
                                        hide-details
                                        :value="studentTeam.student.id"
                                    />
                                    <span class="student-role"> {{ studentTeam.role }} </span>
                                </div>

                                <div v-for="medal in studentTeam.studentMedals" :key="medal.id">
                                    <v-img :src="medal.picture" :title="medal.name" class="medal-style" />
                                </div>
                            </div>
                            <v-spacer></v-spacer>
                            <div>
                                <div class="flex-box inputs">
                                    <div class="box-input">
                                        <div>
                                            <div class="input-label"> Proatividade </div>
                                            <input type="number" class="custom-input" v-model="proactivity" min="0" max="5"/>
                                        </div>
                                        <div> 
                                            <div class="input-label"> Autonomia </div>
                                            <input type="number" class="custom-input" v-model="proactivity" min="0" max="5"/>
                                        </div>
                                    </div>
                                    <div class="box-input">
                                        <div>
                                            <div class="input-label"> Colaboração </div>
                                            <input type="number" class="custom-input" v-model="proactivity" min="0" max="5"/>
                                        </div>
                                        <div>
                                            <div class="input-label"> Entrega de resultado </div>
                                            <input type="number" class="custom-input" v-model="proactivity" min="0" max="5"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TeamService from '@/services/TeamService'
import EventBus from '@/helpers/EventBus.js'
// import $ from 'jQuery'

export default {
    name: 'evaluation',
	components: {
    },
    mounted() {
        TeamService
                .getTeam(1)
                    .then( teams => { 
                        this.teams = teams 
                        console.log(teams)
                    })

        EventBus.$on('ASSIGN_MEDAL', (medal) => {
            console.log(medal)
        })

        EventBus.$on('EVALUATION', (projectId) => {
            TeamService
                .getTeam(projectId)
                    .then( teams => { 
                        this.teams = teams 
                        console.log(teams)
                    })
        })
    },
    methods: {
        // checkChildren(teamId) {
        //     $(`#${teamId}`).children(':input').attr('aria-checked', true);
        //     console.log($(`#${teamId}`).children(':input'))
        //     console.log(this.$refs.1);
        // },

        leaveEvaluation() {
            EventBus.$emit('EVALUATE_STUDENTS_CLOSE');
        },
    },
	data() {
		return {
            proactivity: '',
            teams: [],
            pic: '',
            selectedStudents: [],
        };
	}
}
</script>

<style scoped lang="scss">

.evaluation-form {
    background-color: #eaf0ff;
    border: solid 1px #a3b8ec;
    padding: 8px;
    border-radius: 3px;
    height: 100%;
}

.box-input {
    margin-left: 10px;
}
.project-view {
    &__box {
        max-height: 100%;
        height: calc(100% - 20px - (16px * 2));
        overflow-y: auto;
    }
}

.custom-input {
    width: 70px;
    border-bottom: solid 1px #cac9c9;
}

.student-name {
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    color: #000000;
}

textarea:focus, input:focus{
    outline: none;
    border-bottom: solid 1px #6c8cde;
}

.student-role {
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 14px;
    color: #9F9D9D;
    padding-top: 7px;
    padding-left: 5px;
}

.input-label {
    font-size: 10px;
    color: #716c6c;
}

.inputs {
    margin-right: 69px;
}

.student {
    background: #FFFFFF;
    border-radius: 21px;
    padding: 8px;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
    margin-top: 10px;
}

.medal-style {
    border: 1px solid #C1BBBB;
    border-radius: 6px;
    height: 45px;
    width: 35px;
    flex: none;
        margin: 5px 5px 5px 0px;
}

.close {
    margin-right: 2%;
    color: #6e6e6e;
}

.v-input--selection-controls {
    margin-top: 0px;
    padding-top: 0px;
}

.theme--light.v-label {
    color: rgba(0, 0, 0, 0.75);
}
</style>
