<template>
  <div class="box items">
    <div
      class="menu-item"
      @click="view('Informações pessoais')"
    >
      Informações pessoais
    </div>
    <div
      class="menu-item"
      @click="view('Informações profissionais')"
    >
      Informações profissionais
    </div>
    <div
      class="menu-item"
      @click="view('Informações Acadêmicas')"
    >
      Informações Acadêmicas
    </div>
    <!-- {{menuItems}}
        <div V-for='item in menuItems' :key='item.title'>
            <div class="menu-item" @click="view(item.title)"> {{ item.title }} </div>
        </div> -->
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

.col-5 {
    padding-right: 11px !important;
}

.col {
    padding-bottom: 0px;
    padding-top: 0px;
    padding-right: 0px;
}

.menu-item {
    border-radius: 0px 50px 50px 0px;
    background-color: #F1F1F1;
    padding: 5px 0px 5px 10px;
    margin: 10px 10px 0px 0px;
    cursor: pointer;
    transition: background-color 4s ease-in-out;
    transition: font-weight 4s ease-in-out;
    transition: margin .3s ease-in-out;
}

.menu-item:hover {
    font-weight: bold;
    background-color: #DADADA;
    margin: 10px 0px 0px 0px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
