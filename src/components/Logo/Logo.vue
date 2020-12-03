<template>
  <div
    class="logo"
    :class="`logo--${ variant }`"
    @click="redirect()"
  >
    <h1 class="logo-title">
      Antenas
    </h1>
    <h2 class="logo-subtitle">
      Um projeto FATEC
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: ''
    }
  },
  methods: {
    redirect () {
      this.$router.push('/projects')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';

.logo {
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  color: white;
  cursor: pointer;
  .logo-title {
    margin-top: -6px;
    font-weight: 600;
    font-size: 27px !important;
    font-style: normal;
  }
  .logo-subtitle {
    font-weight: 200;
    font-size: 12px;
    font-style: normal;
  }
  &--blue {
    color: $--color-primary;
  }
}
</style>
