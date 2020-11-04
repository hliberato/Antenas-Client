<template>
  <ul class="timeline">
    <li
      v-for="(currentPhase, phase) in phases"
      :key="`phase-${phase}`"
      class="timeline__phase"
      :class="{ 'timeline__phase--active': phase == progress }"
    >
      <span>{{ phase }}. {{ currentPhase }}</span>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'Timeline',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return { }
  },
  computed: {
    phases () {
      return this.$store.state.phases
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
    .timeline {
        display: flex;
        flex-direction: column;
        color: white;
        width: 100%;
        justify-content: center;
        font-size: 16px;

        &__phase {
            font-weight: 300;
            margin: 4px 0;
            font-size: 14px;

            &--active {
                font-weight: 600;
                max-width: inherit;
            }
        }
    }
</style>
