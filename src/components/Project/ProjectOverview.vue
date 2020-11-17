<template>
  <el-card class="project-overview h100">
    <transition name="fade">
      <div v-if="!fade">
        <div v-if="project">
          <h1 class="title">{{ project.title }}</h1>
          <el-tabs>
            <el-tab-pane label="Projeto">
              <br>
              <h3>Fase atual do projeto:</h3>
              <el-steps :active="1" finish-status="success" process-status="finish">
                <el-step v-for="(step, index) in Array(9)" :key="index" />
              </el-steps>
              <br><br>
              <h4>Resumo</h4>
              <br>
              <p>{{ project.shortDescription }}</p>
              <br><br>
              <h4>Descrição</h4>
              <br>
              <p>{{ project.completeDescription }}</p>
            </el-tab-pane>
            <el-tab-pane label="Equipe">
              a
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-else>
          <div class="empty h100 d-flex align-center text-center">
            <div>
              Selecione um projeto ao lado para saber mais ou
              <el-link type="primary">crie um novo projeto</el-link>.
            </div>
          </div>
        </div>
      </div>
    </transition>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  data () {
    return {
      fade: false
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  watch: {
    project (value) {
      this.fade = true
    },
    fade: {
      handler: debounce(function (newVal) {
        if (newVal) this.fade = false
      }, 200),
      deep: true
    }
  }
}
</script>

<style lang="scss">
.project-overview {
  height: 100%;
  .title {
    font-size: 1.8rem;
  }
  .empty {
    padding: 12vw;
    * {
      font-size: 2rem;
    }
  }
  .el-card__body {
    padding: 38px;
  }
  .el-steps {
    margin-top: 1.4rem;
  }
  .el-tabs {
    margin-top: -12px;
    height: calc(100% - 20px);
  }
  .el-tabs__nav {
    float: right;
  }
  .el-card__body {
    > div {
      height: 100%;
    }
    height: 100%;
    margin-top: -1px;
  }
}
</style>
