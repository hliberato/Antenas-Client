<template>
  <el-tooltip placement="top">
    <div slot="content">{{ medal.description }}<br> Criada dia {{ medal.creationDate | moment("DD/MM/YYYY") }} </div>
    <div class="medal-template">
      <div :style="`background: linear-gradient(135deg, #fff 0%, ${color} 50%, #fff 100%);`" class="wrap">
        <div class="title">
          <span
            v-for="(char, index) in name.split('')"
            :key="index"
            :style="`transform: rotate(${(anglePerChar * index) - angleOffset}deg)`"
          >
            {{ char }}
          </span>
        </div>
        <el-avatar :src="medal.picture" :size="80" class="avatar">
          <i class="el-icon-trophy fallback" />
        </el-avatar>
      </div>
      <img class="medal" src="@/assets/images/medal.png">
    </div>
  </el-tooltip>
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
    name () {
      return this.medal.name.toUpperCase()
    },
    color () {
      return this.medal.color ? this.medal.color : '#4472E9'
    },
    anglePerChar () {
      return (16 * this.name.length) / this.name.length
    },
    angleOffset () {
      return 8 * (this.name.length - 1)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap');

.medal-template {
  position: relative;
  display: inline-block;
  margin: 6px 6px 40px;
  max-width: 124px;
  text-align: left;
  .wrap {
    width: 118px;
    height: 118px;
    border-radius: 50%;
    position: relative;
    border: 3px solid #424242;
    box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 12%);
    z-index: 1;
  }
  img {
    width: 100%;
  }
  .title {
    margin-left: 53px;
    span {
      font-weight: 700;
      font-family: 'Roboto Mono', monospace;
      font-size: 1.17rem;
      height: 59px;
      position: absolute;
      transform-origin: bottom center;
      color: #424242;
    }
  }
  .avatar {
    border: 3px solid #424242;
    margin: 18px;
    background: transparent;
  }
  .medal {
    position: absolute;
    left: -5px;
    top: -4px;
    width: 133px;
  }
  .fallback {
    color: #424242;
    font-size: 4rem;
    margin-left: 2px;
    margin-top: 6px;
  }
}
</style>
