<template>
  <div v-if="$store.getters.isCadi">
    <div>
      <h3>
        Adicione mais informações ao projeto
      </h3>
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        class="step6-form"
        :rules="rules"
        label-position="top"
        label-width="130px"
      >
        <el-form-item label="Professor" prop="teacher">
          <el-select v-model="form.teacher" class="w100" prop="teacher">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="Curso" prop="course">
              <el-select v-model="form.course" class="w100">
                <el-option
                  v-for="course in courses"
                  :key="course"
                  :label="course"
                  :value="course"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Semestre" prop="semester">
              <el-input-number
                v-model="form.semester"
                :min="0"
                :max="6"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="justify-end d-flex">
          <el-button
            plain
            type="success"
            :disabled="buttonDisabled()"
            @click="update(false)"
          >
            Salvar
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  props: {
    project: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submmit' }]
    return {
      form: {
        teacher: '',
        semester: '',
        course: ''
      },
      courses: [
        'Análise e Desenvolvimento de Sistemas',
        'Banco de Dados',
        'Gestão da Produção Industrial',
        'Logística',
        'Manufatura Avançada',
        'Manutenção de Aeronaves',
        'Projetos de Estruturas Aeronáuticas'
      ],
      teacherList: [],
      rules: {
        teacher: required,
        semester: required,
        course: required
      }
    }
  },
  mounted () {
    UserService
      .getTeacherUsers()
      .then(res => {
        this.teacherList = res
        console.log(this.teacherList)
      })
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')
      this.project.course = this.form.course
      this.project.teacher = { id: this.form.teacher }
      this.project.semester = this.form.semester

      this.$store.dispatch('updateProject', this.project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    buttonDisabled () {
      return !(this.form.course && this.form.teacher && this.form.semester)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
