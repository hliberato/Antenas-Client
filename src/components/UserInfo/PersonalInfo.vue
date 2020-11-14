<template>
  <div>
    <div>
      <label>Nome completo: </label>
      <input
        v-model="user.name"
        type="text"
      >

      <br>

      <label>E-mail: </label>
      <input
        v-model="user.email"
        type="text"
      >

      <br>

      <label>R.A: </label>
      <input
        v-model="user.ra"
        type="text"
      >

      <br>

      <label>Cidade: </label>
      <input
        v-model="user.city"
        type="text"
      >

      <br>

      <label>LinkedIn: </label>
      <input
        v-model="user.linkedin"
        type="text"
      >

      <br>

      <label>Biografia: </label>
      <input
        v-model="user.biography"
        type="text"
      >

      <br>

      <label>Foto de perfil: </label>
      <input
        v-model="user.photo"
        type="text"
      >
    </div>

    <br>
    <br>

    <button
      type="button"
      @click="update"
    >
      Salvar
    </button>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  name: 'PersonalInfo',
  components: {
  },
  props: {
    user: {
      type: Object,
      default () {
        return {
          name: '',
          email: '',
          ra: '',
          city: '',
          linkedIn: '',
          biography: '',
          photo: ''
        }
      }
    }
  },
  methods: {
    update () {
      UserService.updateUser(this.user)
        .then((res) => {
          this.user = res
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
