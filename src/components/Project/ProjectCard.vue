<template>
  <el-card
    :class="`project-card--${status}`"
    class="project-card"
    shadow="hover"
  >
    <h4 class="title">{{ title }}</h4>
    <div class="description">
      {{ description }}
    </div>
    <div class="justify-between d-flex">
      <span class="updated">
        Atualizado em: <b>{{ updatedAt | moment("DD/MM/YYYY") }}</b>
      </span>
      <span class="progress">
        {{ progressLabel }}
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    updatedAt: {
      type: String,
      default: ''
    },
    progress: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      default: 'waitingAction',
      validator: (val) => [
        'waitingAction',
        'requestedAction',
        'rejected',
        'finished'].includes(val)
    }
  },
  computed: {
    progressLabel () {
      switch (this.progress) {
        case 1:
          return 'a'
        default:
          return 'b'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/element/_colors.scss';

.project-card {
  border: 0;
  border-left-width: 6px;
  border-left-style: solid;
  &--waitingAction {
    border-left-color: $--color-primary;
    .title {
      color: $--color-primary;
    }
  }
  .description {
    font-size: .875rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .updated {
    color: $--color-text-secondary;
    font-size: .75rem;
  }
}
</style>
