<template>
    <div id="app">
    <v-app>
      <v-app-bar color="white lighten-5" app>
        <Logo variant="blue" class="toolbar__logo"/>

        <v-spacer></v-spacer>

        <Profile class="toolbar__profile" />
      </v-app-bar>

      <v-main class="justify-center ">
        <div class="home__wrapper">
          <v-row >
            <v-col cols="4" class="medal-list">
                <Menu :menu_items='menu_items'/>
            </v-col>
            <v-col cols="8" class="medal-list">
              <div class="box items">
                <div class="box__header " >
                  <div class="row">
                    {{ page_title }}
                    <v-spacer></v-spacer>
                    <v-btn small color="#4472E9" class="white--text button" v-if="page_title != 'Informações pessoais'" @click="addInfo()">
                        Novo registro
                    </v-btn>
                </div>
                  
                </div>
                <PersonalInfo v-if="page_title == 'Informações pessoais'"/>
                <ProfessionalInfo v-if="page_title == 'Informações profissionais'"/>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Logo from '@/components/Logo/Logo.vue';
import Profile from '@/components/Toolbar/Profile.vue';
import Menu from '@/components/Menu/Menu.vue'
import PersonalInfo from '@/components/UserInfo/PersonalInfo.vue'
import ProfessionalInfo from '@/components/UserInfo/ProfessionalInfo.vue'
import EventBus from '@/helpers/EventBus.js'
import UserService from '@/services/UserService.js';

export default {
  name: 'RegistrationInfo',
  components: {
    Logo,
    Profile,
    Menu,
    PersonalInfo,
    ProfessionalInfo,
  }, 
  data() {
      return { 
        menu_items: [ 
          { title: 'Informações pessoais' },
          { title: 'Informações profissionais' },
          { title: 'Informações Acadêmicas' } 
        ],
        page_title: 'Informações pessoais',
        user: null,
      };
  },
  mounted() {
    EventBus.$on('Informações pessoais', () => {
      this.page_title = 'Informações pessoais';
    });

    EventBus.$on('Informações profissionais', () => {
      this.page_title = 'Informações profissionais';
    });

    EventBus.$on('Informações Acadêmicas', () => {
      this.page_title = 'Informações Acadêmicas';
    });

    UserService.getUser()
        .then((res) => {
          this.user = res;
          console.log(this.user)
        })
  },
  methods:{
    addInfo() {
      if (this.page_title == 'Informações profissionais') {
        EventBus.$emit('ADD_PROFESSIONAL_INFO')
      } else if (this.page_title == 'Informações Acadêmicas') {
        EventBus.$emit('ADD_ACADEMIC_INFO')
      }      
    },
  }
}
</script>
            
<style scoped lang="scss">
.content {
  max-height: 100%;
}

.button {
  margin-right: 40px;
}

.biography-input {
  margin-top: 20px
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