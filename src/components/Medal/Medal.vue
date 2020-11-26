<template>
  <div class="medal-box flex-box">
    <div class="flex-box">
      <v-img
        :src="medal.picture"
        class="medal-style"
      />

      <div class="medal-info">
        <div class="medal-name">
          {{ medal.name }}
        </div>
        <div class="medal-description">
          {{ medal.description }}
        </div>
      </div>
    </div>

    <div
      v-if="medal.achieveDate"
      class="medal-date-box"
    >
      <div class="flex-box">
        <span class="material-icons icon"> check_circle_outline </span>
        <div>
          <div class="medal-date">
            Conquista
          </div>
          <div class="medal-date">
            10/02/2020
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="medal-date-box" v-else>
            <div class="flex-box">
                <div>
                    <div class="medal-date">Criada dia </div>
                    <div class="medal-date">10/02/2020</div>
                </div>
            </div>
        </div> -->
  </div>
</template>

<script>
export default {
  props: {
    medal: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getSource () {
      return '@/assets/images/business_deal.svg'
    }
  }
}
</script>

<style scoped>

.medal-box:hover {
    transition: box-shadow 0.10s ease-in-out;
    transition: width 0.4s ease-in-out;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
    width: 220px !important;
}

.medal:focus {
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
    width: 220px;
}

.medal-info {
    max-width: 70%;
}

.medal-style {
    border: 1px solid #C1BBBB;
    /* box-sizing: border-box; */
    border-radius: 6px;
    height: 60px;
    width: 50px;
    flex: none;
    margin: 5px;
}

.icon {
    color: rgba(61, 214, 23, 0.81);
    font-size: 20px;
}

.medal-box {
    background: #FAFAFA;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    width: 210px;
    margin: 0px 10px 10px 10px;
}

.medal-name {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #212121;
    margin-top: 5px;
}

.medal-description {
    font-weight: 600;
    font-size: 9px;
    line-height: 12px;
    color: #212121;
    max-width: 95%;
}

.medal-date-box {
    padding-left: 65%;
}

.medal-date {
    font-weight: 600;
    font-size: 7px;
    line-height: 10px;
    color: #B7B7B7;
}

</style>
