<template>
  <div class="academic-info">
    <el-form
      ref="form"
      v-loading="$store.getters.loading"
      :model="form"
      class="login-form"
      label-position="top"
      label-width="130px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Instituição" prop="institution">
            <el-input v-model="form.institution" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Curso" prop="course">
            <el-input v-model="form.course" />
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
      <el-button type="primary" @click="update">
        Salvar
      </el-button>
    </el-form>
    <el-table
      :data="user.academicInfos"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <p><strong>Data inicial:</strong>  {{ props.row.start | moment("DD/MM/YYYY") }}</p>
          <p><strong>Data final:</strong> {{ props.row.end | moment("DD/MM/YYYY") }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Instituição"
        prop="institution"
      />
      <el-table-column
        label="Curso"
        prop="course"
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
  name: 'ProfessionalInfo',
  components: {
  },
  props: {
    user: {
      type: Object,
      default () {
        return {
          institution: '',
          course: '',
          start: '',
          end: ''
        }
      }
    }
  },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }]
    return {
      form: {
        id: 0,
        institution: '',
        course: '',
        start: '',
        end: ''
      },
      rules: {
        cominstitutionpany: required,
        course: required,
        start: required,
        end: required
      }
    }
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')

      const index = this.user.academicInfos.findIndex(item => item.id === this.form.id)
      if (this.form.institution && index === -1) {
        if (!this.user.academicInfos) {
          this.user.academicInfos = []
        }
        this.user.academicInfos.push(this.form)
      }

      UserService.updateUser(this.user)
        // .then((res) => this.$emit('update:user'))
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    deleteRow (row) {
      this.user.academicInfos = this.user.academicInfos.filter(info => {
        return info !== row
      })
      this.update()
    },
    edit (row) {
      this.form = row
    }
  }
}
</script>

<style lang="scss">
.academic-info {
  .el-date-editor {
      width: 100%;
  }
}
</style>
