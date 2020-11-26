<template>
  <div class="box medal">
    <div class="box__header">
      <h4 class="text-title">
        Medalhas
      </h4>
      <div class="actions">
        <v-btn
          small
          color="#4472E9"
          class="white--text"
        >
          Criar
        </v-btn>
      </div>
    </div>

    <div class="flex-box search">
      <v-text-field
        v-model="searchTerm"
        class="mb-1"
        label="Buscar"
        hide-details
      />
      <span class="material-icons"> search </span>
    </div>

    <ul class="box__body box__body--no-horizontal-padding medal__list">
      <li
        v-for="medal in medals"
        :key="medal.id"
        class="medal__item"
      >
        <a class="medal__item-content">
          <medal
            :medal="medal"
            @click="assignMedal(medal)"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Medal from './Medal'
import MedalService from '@/services/MedalService.js'
import EventBus from '@/helpers/EventBus.js'

export default {
  components: {
    Medal
  },
  data () {
    return {
      searchTerm: '',
      medals: []
    }
  },
  mounted () {
    MedalService
      .getMedals().then(res => {
        this.medals = res
      })
  },

  methods: {
    assignMedal (medal) {
      EventBus.$emit('ASSIGN_MEDAL', medal)
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

.search {
    padding: 0px 10px 0px 10px;
}

.material-icons {
    padding-top: 24px;
}

.medal {

    &__item-content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: white;
        transition: background-color .2s ease-in-out;
        font-size: 14px;

        .content {
            font-size: 12px;
            display: flex;
            flex-direction: column;
            margin-left: 17px;
            min-width: 90%;

            .text-title {
                color: #0084E3;
                font-size: 16px !important;
                line-height: 0 !important;
                font-weight: 600;
                padding-top: 11px;
            }
        }
    }

    &__item {
        height: 78px;
        width: 100%;
        margin-top: 5px;

        &:first-child {
            margin-top: 0;
        }
    }

    &__list {
        max-height: 100%;
        height: calc(100% - 20px - (#{42px} * 2));
        overflow-y: auto;;
    }
}
</style>
