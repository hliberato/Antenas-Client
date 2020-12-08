<template>
  <div class="profile-view h100">
    <el-card class="">
      <div class="d-flex justify-between align-center mb-44">
        <h1>Medalhas</h1>
        <div>
          <el-select
            v-model="categoryFilter"
            clearable
            placeholder="Filtrar por categoria"
            style="width: 300px;"
          >
            <el-option
              v-for="(category, index) in medalsCategories"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-medal"
            class="ml-12"
            @click="newMedal"
          >
            Criar nova medalha
          </el-button>
        </div>
      </div>
      <el-row v-if="filteredMedals.length" :gutter="16" class="mt-12 mb-12">
        <el-col
          v-for="m in filteredMedals"
          :key="m.id"
          :md="12"
          :lg="8"
          class="mb-28"
        >
          <div class="d-flex">
            <MedalTemplate :medal="m" />
            <div class="mt-12 ml-12 mb-12">
              <div class="d-flex flex-column justify-between h100">
                <span class="info">
                  <div>Nome: <strong>{{ m.name }}</strong></div>
                  <div>Descrição: <strong>{{ m.description }}</strong></div>
                  <div>Categoria: <strong>{{ m.category }}</strong></div>
                  <div>Criação: <strong>{{ m.creationDate | moment('DD/MM/YY') }}</strong></div>
                </span>
                <span>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editMedal(m)"
                  >
                    Editar
                  </el-button>
                  <!-- <el-button type="danger" size="mini" @click="removeMedal(m)">
                    Excluir
                  </el-button> -->
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-else class="empty">
        <span v-if="filteredMedals">
          Não foram encontrados resultados para o filtro selecionado.
        </span>
        <span v-else>
          Ainda não existem medalhas. <br>
          <el-link type="primary" @click="newMedal">Crie a primeira!</el-link>
        </span>
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
      dialogVisible: false,
      categoryFilter: ''
    }
  },
  computed: {
    ...mapGetters([
      'medals',
      'medalsCategories',
      'loading'
    ]),
    filteredMedals () {
      return this.categoryFilter ? this.medals.filter(m => m.category === this.categoryFilter) : this.medals
    }
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
    position: relative;
    height: 100%;
  }
  .info div {
    margin-bottom: 5px;
  }
  .empty {
    position: absolute;
    left: 0;
    top: 112px;
    right: 0;
    bottom: 112px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  strong {
    font-weight: 500;
  }
}
</style>
