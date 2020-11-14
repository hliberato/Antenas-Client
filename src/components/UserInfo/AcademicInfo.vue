<template>
  <div>
    <button
      type="button"
      @click="show_fields = !show_fields"
    >
      Adicionar novo curso
    </button>
    <br>
    <br>

    <div v-if="show_fields">
      <label>
        Instituição:
      </label>
      <input
        v-model="academicInfo.institution"
        type="text"
      >

      <br>

      <label>Curso: </label>
      <input
        v-model="academicInfo.course"
        type="text"
      >

      <br>

      <label>Data inicial: </label>
      <input
        v-model="academicInfo.start"
        type="date"
      >

      <label>Data final: </label>
      <input
        v-model="academicInfo.end"
        type="date"
      >

      <br>
      <br>

      <button
        type="button"
        @click="save()"
      >
        Salvar
      </button>
    </div>

    <br>

    <div
      v-for="info in user.academicInfos"
      :id="info.id"
      :key="info.id"
    >
      <strong>
        {{ info.institution }}
      </strong>

      <div>
        <div>
          <strong> Curso: </strong> {{ info.course }}
        </div>

        <div>
          <strong> Início: </strong> {{ info.start }}
          <strong> Fim: </strong> {{ info.end }}
        </div>
      </div>

      <br>
      <br>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  name: 'AcademicInfo',
  components: {
  },
  data () {
    return {
      academicInfo: {
        start: '',
        end: '',
        institution: '',
        course: ''
      },
      user: { },
      show_fields: false
    }
  },
  mounted () {
    UserService.getUser()
      .then((res) => {
        this.user = res
      })
  },
  methods: {
    save () {
      if (!this.user.academicInfos) {
        this.user.academicInfos = []
      }

      this.user.academicInfos.push(this.academicInfo)
      console.log(this.user)

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
