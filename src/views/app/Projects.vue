<template>
  <el-container class="projects-view">
    <el-aside style="padding: 10px;">
      <ProjectCard
        status="waitingAction"
        title="Projetão monstro"
        description="Um carro eletrico movido a gasolina renovavel baseado em flatulência de suínos."
        updated-at="2020-10-26T03:27:06.000+0000"
        :progress="2"
      />
    </el-aside>
    <el-main>
      projetos
    </el-main>
  </el-container>
</template>

<script>
import ProjectCard from '@/components/Project/ProjectCard.vue'

export default {
  components: {
    ProjectCard
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.projects-view {
  .el-card__body {
    padding: 4px 12px;
  }
}
</style>
