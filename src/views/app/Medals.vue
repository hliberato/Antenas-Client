<template>
  <div class="profile-view h100">
    <div class="d-flex justify-between align-center mt-8 mb-24">
      <h1 class="ml-8">Medalhas</h1>
      <el-button type="primary" icon="el-icon-medal" @click="newMedal">
        Criar nova medalha
      </el-button>
    </div>
    <el-card class="pl-8 pr-8">
      <el-row v-if="medals.length" :gutter="28" class="mt-12 mb-12">
        <el-col v-for="m in medals" :key="m.id" :span="6" class="mb-28">
          <div class="d-flex">
            <MedalTemplate :medal="m" />
            <div class="mt-24 ml-12 mb-24">
              <div class="d-flex flex-column justify-between h100">
                <span>
                  Nome: {{ m.name }} <br>
                  Descrição: {{ m.description }} <br>
                  Categoria: {{ m.category }} <br>
                  Criação: {{ m.name }} <br>
                </span>
                <span>
                  <el-button type="primary" size="mini" @click="editMedal(m)">
                    Editar
                  </el-button>
                  <el-button type="danger" size="mini" @click="removeMedal(m)">
                    Excluir
                  </el-button>
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-else class="h100 d-flex justify-center align-center">
        <p class="text-center">
          Ainda não existem medalhas. <br>
          <el-link type="primary" @click="newMedal">Crie a primeira!</el-link>
        </p>
      </div>
    </el-card>
    <MedalNew :visible.sync="dialogVisible" :medal="medal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MedalTemplate from '@/components/Medal/MedalTemplate'
import MedalNew from '@/components/Medal/MedalNew'

export default {
  components: { MedalTemplate, MedalNew },
  data () {
    return {
      medal: {},
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'medals',
      'loading'
    ])
  },
  methods: {
    newMedal () {
      this.medal = {
        name: '',
        description: '',
        category: '',
        picture: ''
      }
      this.dialogVisible = true
    },
    createMedal () {
      this.$refs.medal.validate(valid => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          this.$store.dispatch('saveMedal', this.medal)
            .then(() => {
              this.$notify({
                title: 'Pronto!',
                message: 'Medalha salva com sucesso',
                type: 'success',
                position: 'bottom-right'
              })
            })
            .catch(err => this.$throwError(err))
            .finally(() => {
              this.dialogVisible = true
              this.$store.commit('HIDE_LOADING')
            })
        }
      })
    },
    editMedal (medal) {
      this.medal = { ...medal }
      this.dialogVisible = true
    },
    removeMedal (medal) {
      this.$confirm('Tem certeza que deseja excluir?', 'Excluir medalha', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        this.$store.commit('SHOW_LOADING')
        this.$store.dispatch('removeMedal', medal)
          .then(() => {
            this.$notify({
              title: 'Pronto!',
              message: 'Medalha excluída com sucesso',
              type: 'success',
              position: 'bottom-right'
            })
          })
          .catch(err => this.$throwError(err))
          .finally(() => this.$store.commit('HIDE_LOADING'))
      })
    },
    changePhoto (file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) this.$message.error('Imagem deve estar no formato JPG ou PNG.')
      if (!isLt2M) this.$message.error('Imagem não pode exceder 2 MB.')
      if (isJPG && isLt2M) {
        const reader = new FileReader()
        reader.onload = e => { this.medal.picture = e.target.result }
        reader.readAsDataURL(file.raw)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss">
.profile-view {
  padding: 20px;
  h1 {
    color: #606266;
    font-size: 1.8rem;
    font-weight: 500;
  }
  p, p * {
    line-height: 2rem;
    font-size: 1.2rem;
  }
  .el-card {
    height: calc(100% - 74px);
  }
  .el-card__body {
    height: calc(100% - 40px);
  }
}
</style>
