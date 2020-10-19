<template>
    <div class=" box__body">
        <div v-if="show_fields">
            <v-text-field 
                v-model="user.role" 
                label="Empresa" 
                hide-details="auto">
            </v-text-field>

            <v-text-field 
                v-model="user.activities_performed" 
                label="Cargo" 
                hide-details="auto">
            </v-text-field>

            <div class="row">
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="user.start"
                            label="Data de início"
                            class="date-field"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        />
                    </template>
                        <v-date-picker
                            ref="picker"
                            v-model="user.start"
                            show-current="true"
                        />
                </v-menu>
            
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            v-model="user.end"
                            label="Data final"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                        />
                    </template>
                        <v-date-picker
                            ref="picker"
                            v-model="user.end"
                            show-current="true"
                        />
                </v-menu>
            </div>
            <div class="row">
                <v-spacer></v-spacer>
                <v-btn small color="#4472E9" class="white--text button" type="submit" @click="show_fields = !show_fields;">
                    Salvar
                </v-btn>
            </div>
        </div>
        
        <div class="company">
            <strong>
                Empresita
            </strong>

            <div class="company-info">
                <div class="line-spacing">
                    <strong> Cargo: </strong> Estagiário 
                </div>
                
                <div class="line-spacing">
                    <strong> Atividades exercidas: </strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor justo eget nunc aliquet, sed dictum purus consequat
                </div>

                <div class="row">
                    <div>
                        <strong> Início: </strong> 05/2019  
                    </div>
                    <div class="ml-25">
                        <strong> Fim: </strong> 05/2019
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'ProfessionalInfo',
  components: {
  }, 
  data() {
    return { 
        user: {
            role: '',
            activities_performed: '',
            start: '',
            end: '',
        },
        show_fields: false,
    };
  },
  mounted() {
    EventBus.$on('ADD_PROFESSIONAL_INFO', () => {
      this.show_fields = !this.show_fields;
    });
  },
}
</script>
            
<style scoped lang="scss">
.content {
  max-height: 100%;
}

.button {
  margin-right: 40px;
}

.date-field {
    margin-right: 30px;
}

.ml-25 {
    margin-left: 25px;
}

.row {
    margin-left: 0px;
    margin-right: 0px;
}

.company-info {
    margin-left: 15px;
    margin-top: 5px;
}

.line-spacing {
    margin-bottom: 5px;
}

.company {
    border-top: solid 1px #CDCCCC;
    margin-top: 40px;
}

.home {
  &__wrapper {
    display: flex;
    max-width: 1080px;
    width: 90%;
    margin: 25px auto;
    height: calc(100vh - 70px - #{32px } * 2);
  }

  &__projects,
  &__project-view {
    height: 100%;
  }

  &__project-view {
    margin-left: spacing(4);
    flex-grow: 1;
  }
}

</style>