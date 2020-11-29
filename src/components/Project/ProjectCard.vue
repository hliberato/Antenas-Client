<template>
  <div :class="`project-card--${project.status}`" class="mt-20 mb-20 mr-12 project-card">
    <el-card
      :shadow="isActive ? 'always' : 'hover'"
      @click.native="$emit('click', project.id)"
    >
      <h4>{{ project.title }}</h4>
      <div class="mt-4 mb-8 description">
        {{ project.shortDescription }}
      </div>
      <div class="justify-between d-flex align-end">
        <span class="updated">
          Atualizado em:
          <br>
          <b>{{ project.updatedAt ? project.updatedAt : project.createdAt | moment("DD/MM/YYYY") }}</b>
        </span>
        <h5 class="progress">
          {{ project.labelPhase }}
        </h5>
      </div>
    </el-card>
    <i v-if="project.status === 'pending'" class="alert el-icon-warning-outline" />
  </div>
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
  }
}
</script>

<style lang="scss">
@import '@/styles/_colors.scss';

.project-card {
  position: relative;
  .el-card {
    border: 0;
    border-left-width: 6px;
    border-left-style: solid;
    cursor: pointer;
    &.is-always-shadow {
      box-shadow: $--box-shadow-dark;
    }
  }
  &--waiting {
    .el-card {
      border-left-color: $--color-primary;
    }
    .progress {
      color: $--color-primary;
    }
  }
  &--pending {
    .el-card {
      border-left-color: $--color-warning;
    }
    .progress {
      color: $--color-warning;
    }
  }
  &--refused {
    .el-card {
      border-left-color: $--color-danger;
    }
    .progress {
      color: $--color-danger;
    }
  }
  &--concluded {
    .el-card {
      border-left-color: $--color-success;
    }
    .progress {
      color: $--color-success;
    }
  }
  .description {
    font-size: .875rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .progress {
    word-break: break-word;
    max-width: 50%;
    text-align: right;
  }
  .updated {
    color: $--color-text-secondary;
    font-size: .75rem;
  }
  .alert {
    top: -4px;
    right: -4px;
    font-size: 1.4rem;
    position: absolute;
    color: $--color-warning;
    animation: pulse 1.5s infinite linear;
  }
  .el-card__body {
    padding: 8px 12px;
  }
}

@keyframes pulse {
0% { transform: scale(1); }
50% { transform: scale(1.2); }
100% { transform: scale(1); }
}
</style>
