<template>
  <div>
    <div v-if="show_fields">
      <br>
      <label>Empresa: </label>
      <input
        v-model="professionalInfo.role"
        type="text"
      >

      <br>

      <label>Cargo: </label>
      <input
        v-model="professionalInfo.activities_performed"
        type="text"
      >

      <br>

      <label>Data inicial: </label>
      <input
        v-model="professionalInfo.start"
        type="text"
      >

      <label>Data final: </label>
      <input
        v-model="professionalInfo.end"
        type="text"
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

    <div>
      <strong>
        Empresita
      </strong>

      <div>
        <div>
          <strong> Cargo: </strong> Estagiário
        </div>

        <div>
          <strong> Atividades exercidas: </strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor justo eget nunc aliquet, sed dictum purus consequat
        </div>

        <div>
          <strong> Início: </strong> 05/2019
          <strong> Fim: </strong> 05/2019
        </div>
      </div>
    </div>

    {{ '[[[[[' + user + ']]]]]' }}
  </div>
</template>

<script>
import EventBus from '@/helpers/EventBus.js'
import UserService from '@/services/UserService.js'

export default {
  name: 'ProfessionalInfo',
  components: {
  },
  props: {
    user: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      show_fields: false,
      professionalInfo: {
        role: '',
        activities_performed: '',
        start: '',
        end: ''
      }
    }
  },
  mounted () {
    EventBus.$on('ADD_PROFESSIONAL_INFO', () => {
      this.show_fields = !this.show_fields
    })
  },
  methods: {
    save () {
      this.user.professionalInfos.push(this.professionalInfo)
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
