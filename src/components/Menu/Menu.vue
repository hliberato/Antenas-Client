<template>
  <div class="box items">
    <div @click="view('Informações pessoais')">
      Informações pessoais
    </div>
    <div @click="view('Informações profissionais')">
      Informações profissionais
    </div>
    <div @click="view('Informações Acadêmicas')">
      Informações Acadêmicas
    </div>
  </div>
</template>

<script>
import EventBus from '@/helpers/EventBus.js'

export default {
  name: 'Items',
  props: {
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      item: String
    }
  },
  methods: {
    view (item) {
      EventBus.$emit(item)
      console.log(item)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
