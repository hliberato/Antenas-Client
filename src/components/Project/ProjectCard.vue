<template>
  <el-card
    :class="`project-card--${status}`"
    class="project-card"
    :shadow="isActive ? 'always' : 'hover'"
    @click.native="$emit('click', project.id)"
  >
    <h4 class="title">{{ project.title }}</h4>
    <div class="description">
      {{ project.shortDescription }}
    </div>
    <div class="justify-between d-flex">
      <span class="updated">
        Atualizado em: <b>{{ project.updatedAt | moment("DD/MM/YYYY") }}</b>
      </span>
      <h5 class="progress">
        {{ labelPhase }}
      </h5>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    status () {
      return this.$getProjectStatus(this.project)
    },
    labelPhase () {
      return this.$getProjectLabelPhase(this.status, this.project)
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.project-card {
  border: 0;
  border-left-width: 6px;
  border-left-style: solid;
  cursor: pointer;
  border-left-color: $--color-success;
  .title, .progress {
      color: $--color-success;
    }
  &--waiting {
    border-left-color: $--color-primary;
    .title, .progress {
      color: $--color-primary;
    }
  }
  .description {
    margin: .3rem 0;
    font-size: .875rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .updated {
    color: $--color-text-secondary;
    font-size: .75rem;
  }
  .el-card__body {
    padding: 4px 12px;
  }
}
</style>
