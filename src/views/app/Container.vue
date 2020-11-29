<template>
  <div
    v-loading="!completeLoading"
    element-loading-text="Carregando informações..."
    class="container-view"
  >
    <el-container v-if="completeLoading">
      <el-header height="auto">
        <Logo variant="blue" />
        <div class="align-center d-flex">
          <!-- <el-badge :value="1" class="notification">
            <i class="el-icon-bell" />
          </el-badge> -->
          <el-avatar size="medium" class="avatar">
            <img v-if="userPhoto" :src="userPhoto">
            <span v-else>
              {{ userInitials }}
            </span>
          </el-avatar>
          <div>
            <h4>{{ userName }}</h4>
            <h5>{{ userRoleDisplay }}</h5>
          </div>
          <el-dropdown @command="dropdownClick">
            <i class="menu el-icon-more" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="account">
                <i class="el-icon-user" />
                Dados da conta
              </el-dropdown-item>
              <el-dropdown-item v-if="$store.getters.isStudent" command="profile">
                <i class="el-icon-s-custom" />
                Perfil
              </el-dropdown-item>
              <el-dropdown-item command="projects">
                <i class="el-icon-document" />
                Projetos
              </el-dropdown-item>
              <el-dropdown-item command="medals">
                <i class="el-icon-medal" />
                Medalhas
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <i class="el-icon-switch-button" />
                Sair
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <transition name="fade">
        <router-view />
      </transition>
    </el-container>
  </div>
</template>

<script>
import Logo from '@/components/Logo/Logo.vue'
import { mapGetters } from 'vuex'

export default {
  components: { Logo },
  data () { return { completeLoading: false } },
  computed: {
    ...mapGetters([
      'userName',
      'userRoleDisplay',
      'userPhoto'
    ]),
    userInitials () {
      if (this.userName) {
        const splitedName = this.userName.split(' ')
        return (splitedName[0].charAt(0) + splitedName[splitedName.length - 1].charAt(0)).toUpperCase()
      }
      return ''
    }
  },
  mounted () {
    Promise.all([
      this.$store.dispatch('loadCurrentUserInfo'),
      this.$store.dispatch('loadProjects')
    ])
      .catch(err => this.$throwError(err))
      .finally(() => { this.completeLoading = true })
  },
  methods: {
    dropdownClick (action) {
      if (action === 'account' && this.$route.path !== '/dados-cadastrais') {
        this.$router.push('/dados-cadastrais')
      } else if (action === 'logout') {
        this.$store.commit('LOGOUT_CURRENT_USER')
        this.$store.commit('CLEAR_PROJECTS')
        this.$router.push('/')
      } else if (action === 'projects') {
        this.$router.push('/projects')
      } else if (action === 'profile') {
        this.$router.push(`/${this.$store.getters.userName.replace(' ', '.').replace(' ', '')}-${this.$store.getters.userId}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';

h3, h4, h5 {
  color: $--color-text-regular;
}
.notification {
  margin-right: 1.4rem;
  font-size: 1.2rem;
}
.avatar {
  margin-right: .75rem;
}
.menu {
  margin-left: .7rem;
  font-size: 1.4rem;
  transform: rotate(90deg);
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  padding: 9px 20px;
  margin: 0;
  z-index: 9;
}
</style>
