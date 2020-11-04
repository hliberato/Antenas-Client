<template>
  <v-snackbar
    v-model="isVisible"
    :vertical="true"
    :right="true"
    :timeout="timeout"
    :show-close="showClose"
    color="error"
    class="notification"
  >
    <div class="title">
      {{ content.title }}
    </div>
    <div class="content">
      {{ content.message }}
    </div>
    <template v-slot:action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="isVisible = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 6000
    },
    type: {
      type: String,
      required: true,
      validator: (type) => [
        'success',
        'info',
        'error',
        'error-login',
        'error-register'
      ].includes(type)
    }
  },
  computed: {
    isVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    content () {
      switch (this.type) {
        case 'error-login':
          return {
            title: 'Erro ao realizar login',
            message: 'Verifique o e-mail e senha informados e tente novamente.'
          }
        case 'error-register':
          return {
            title: 'Erro ao realizar cadastro',
            message: 'Verifique os dados informados e tente novamente.'
          }
      }
      return {
        title: 'Ocorreu um erro inesperado',
        message: 'Tente novamente ou entre em contato com o administrador do sistema.'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .notification {
    .title {
      font-size: 2rem;;
    }
  }
</style>
