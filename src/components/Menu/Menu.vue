<template>
	<div class="box items">
        <div>
            <div class="menu-item" @click="view(1)"> Informações pessoais </div>
            <div class="menu-item" @click="view(2)"> Informações profissionais </div>
            <div class="menu-item" @click="view(3)"> Informações Acadêmicas </div>
        </div>
	</div>
</template>

<script>
import EventBus from '@/helpers/EventBus.js'

export default {
	name: 'items',
	components: {
    },
    mounted() {
        EventBus.$on('UPDATE_item_LIST', () => {
            this.updateitems();
        });

        // this.updateitems();
    },

    methods: {
        view(item) {
            this.item = item
        }
    },
	data() {
        return {
            item: 1,
        };
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
