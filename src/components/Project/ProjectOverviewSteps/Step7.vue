<template>
  <div v-if="$store.getters.isTeacher" class="project-step-7">
    <el-alert
      :closable="false"
      title="É necessário iniciar o projeto para que fique visível para os alunos."
      type="info"
    >
      <el-button
        plain
        :type="project.open ? 'danger' : 'primary'"
        class="ml-16"
        :icon="project.open ? 'el-icon-document-checked' : 'el-icon-check'"
        @click="update(project.open ? 'finish' : 'open')"
      >
        {{ project.open ? 'Encerrar' : 'Iniciar' }}
      </el-button>

      <el-button
        plain
        type="primary"
        class="ml-16"
        icon="el-icon-edit-outline"
        @click="editProject = !editProject"
      >
        Editar informações do projeto
      </el-button>
    </el-alert>
    <el-dialog
      title="Editando informações do projeto"
      :visible.sync="editProject"
      width="50%"
    >
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        class="edit-project-setp-7"
        label-position="top"
        label-width="130px"
      >
        <el-form-item label="Resumo" prop="shortDescription">
          <el-input
            v-model="project.shortDescription"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Descrição completa" prop="completeDescription">
          <el-input
            v-model="project.completeDescription"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Descrição da tecnologia" prop="technologyDescription">
          <el-input
            v-model="project.technologyDescription"
            type="textarea"
            :rows="4"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <div class="justify-end d-flex mt-28">
          <el-button
            plain
            class="ml-16"
            @click="editProject = !editProject"
          >
            Cancelar
          </el-button>
          <el-button
            plain
            type="primary"
            class="ml-16"
            @click="update(undefined)"
          >
            Salvar
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      editProject: false
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  methods: {
    update (action) {
      this.$store.commit('SHOW_LOADING')
      const project = JSON.parse(JSON.stringify(this.project))
      if (action === 'open') {
        project.open = true
      } else if (action === 'finish') {
        project.open = false
        project.finished = true
      }
      this.$store.dispatch('updateProject', project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    confirmDialog (openProject) {
      if (openProject !== undefined) {
        const confirmMessage = this.project.open ? 'Tem certeza de que deseja encerrar o projeto? Ele ficará invisível para os alunos.' : 'Deseja iniciar o projeto?'
        this.$confirm(confirmMessage, 'Entrega', {
          confirmButtonText: this.project.open ? 'Sim, encerrar' : 'Sim, iniciar',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: this.project.open ? 'el-button--danger' : 'el-button--success'
        }).then(() => {
          this.update(openProject)
        })
      } else {
        this.update(openProject)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.project-step-7 {
  .el-alert__title {
    font-size: 1.17rem;
    color: $--color-text-regular;
  }
  .el-alert__description {
    margin-top: 24px;
    text-align: center;
  }
  .el-alert__content {
    padding: 20px;
    margin: auto;
  }
}
</style>
