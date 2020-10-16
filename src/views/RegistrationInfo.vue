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
                <Menu></Menu>
            </v-col>
            <v-col cols="8" class="medal-list">
                <div class="box items">
                  <div class="box__header " >
                    Informações pessoais
                  </div>

                  <div class=" box__body">
                    <v-text-field 
                        v-model="user.name" 
                        label="Nome completo" 
                        hide-details="auto">
                    </v-text-field>

                    <v-text-field 
                        v-model="user.email" 
                        label="E-mail" 
                        hide-details="auto">
                    </v-text-field>

                    <v-text-field 
                        v-model="user.ra" 
                        label="R.A" 
                        hide-details="auto">
                    </v-text-field>

                    <v-text-field 
                        v-model="user.city" 
                        label="Cidade" 
                        hide-details="auto">
                    </v-text-field>

                    <v-text-field 
                        v-model="user.linkedIn" 
                        label="LinkedIn" 
                        hide-details="auto">
                    </v-text-field>

                    <v-textarea
                        :maxlength="300"
                        clearable
                        counter
                        clear-icon="cancel"
                        v-model="user.biography"
                        rows="4"
                        outlined
                        class="biography-input"
                        label="Biografia">
                        
                    </v-textarea>

                    <v-file-input
                      label="Foto de perfil"
                      chips
                      small-chips
                      truncate-length="50"
                      v-model="user.photo"
                    ></v-file-input>
                  </div>

                    <div class="row">
                      <v-spacer></v-spacer>
                      <v-btn small color="#4472E9" class="white--text button" type="submit">
                        Salvar
                      </v-btn>
                    </div>
                  
                   
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

export default {
  name: 'RegistrationInfo',
  components: {
    Logo,
    Profile,
    Menu,
  }, 
  data() {
      return { 
        user: {
          name: '',
          email: '',
          ra: '',
          city: '',
          linkedIn: '',
          biography: '',
          photo: '',
          photoFile: '',
        }
      };
  },
  methods: {
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