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
                  {{ page_title }}
                </div>
                <PersonalInfo v-if="page_title == 'Informações pessoais'"/>
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
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'RegistrationInfo',
  components: {
    Logo,
    Profile,
    Menu,
    PersonalInfo,
  }, 
  data() {
      return { 
        menu_items: [ 
          { title: 'Informações pessoais' },
          { title: 'Informações profissionais' },
          { title: 'Informações Acadêmicas' } 
        ],
        page_title: 'Informações pessoais'
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