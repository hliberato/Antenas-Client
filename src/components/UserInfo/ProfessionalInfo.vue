<template>
  <div class="professional-info">
    <el-row>
      <el-col :span="12">
        <h2>Informações profissionais</h2>
      </el-col>
      <el-col :span="12">
        <div class="d-flex justify-end">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="showDialog = true"
          >
            Adicionar
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="Cadastrar empresa" :visible.sync="showDialog">
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        :model="form"
        class="login-form"
        label-position="top"
        label-width="130px"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Empresa" prop="company">
              <el-input v-model="form.company" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cargo" prop="role">
              <el-input v-model="form.role" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Data inicial" prop="startDate">
              <el-date-picker
                v-model="form.start"
                format="dd/MM/yyyy"
                prop="start"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Data final" prop="endDate">
              <el-date-picker
                v-model="form.end"
                format="dd/MM/yyyy"
                prop="end"
                label="Data de início"
                type="date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Atividades realizadas" prop="activitiesPerformed">
          <el-input v-model="form.activitiesPerformed" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">
          Cancelar
        </el-button>
        <el-button type="primary" @click="update">
          Salvar
        </el-button>
      </span>
    </el-dialog>
    <el-table :data="user.professionalInfos">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p><strong>Atividades exercidas:</strong> {{ props.row.activitiesPerformed }} </p>
          <p><strong>Data inicial:</strong> {{ props.row.start | moment("DD/MM/YYYY") }} </p>
          <p><strong>Data final:</strong> {{ props.row.end | moment("DD/MM/YYYY") }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Empresa"
        prop="company"
      />
      <el-table-column
        label="Cargo"
        prop="role"
      />
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            Editar
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteRow(scope.row)"
          >
            Excluir
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  components: {
  },
  props: {
    user: {
      type: Object,
      default () {
        return {
          company: '',
          activitiesPerformed: '',
          start: '',
          end: ''
        }
      }
    }
  },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    return {
      showDialog: false,
      form: {
        id: 0,
        company: '',
        activitiesPerformed: '',
        start: '',
        end: ''
      },
      rules: {
        company: required,
        activitiesPerformed: required,
        start: required,
        end: required
      }
    }
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')

      const index = this.user.professionalInfos.findIndex(item => item.id === this.form.id)

      if (this.form.company && index === -1) {
        if (!this.user.professionalInfos) {
          this.user.professionalInfos = []
        }
        this.user.professionalInfos.push(this.form)
      }

      UserService.updateUser(this.user)
        .catch(err => this.$throwError(err))
        .finally(() => {
          this.$store.commit('HIDE_LOADING')
          this.showDialog = false
        })
    },
    deleteRow (row) {
      this.user.professionalInfos = this.user.professionalInfos.filter(info => {
        return info !== row
      })
      this.update()
    },
    edit (row) {
      this.form = row
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss">
@import '@/plugins/element/_colors.scss';

.professional-info {
  .el-date-editor {
      width: 100%;
  }

  h2 {
    color: $--color-primary;
    margin-bottom: 30px;
  }
}
</style>
