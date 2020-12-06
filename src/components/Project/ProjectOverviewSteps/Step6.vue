<template>
  <div v-if="$store.getters.isCadi" class="project-step-6">
    <div>
      <h3>
        Escolha o professor responsável pelo projeto
      </h3>
      <el-form
        ref="form"
        :model="form"
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
        <div class="justify-end d-flex mt-28">
          <el-button
            type="primary"
            @click="update()"
          >
            Escolher professor
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import UserService from '@/services/UserService.js'

export default {
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    return {
      form: {
        teacher: '',
        semester: 1,
        course: ''
      },
      rules: {
        teacher: required,
        semester: required,
        course: required
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
      teacherList: []
    }
  },
  mounted () {
    UserService
      .getTeacherUsers()
      .then(res => {
        this.teacherList = res
      })
  },
  methods: {
    update () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          const project = JSON.parse(JSON.stringify(this.$store.getters.selectedProject))
          project.course = this.form.course
          project.teacher = { id: this.form.teacher }
          project.semester = this.form.semester
          this.$store.dispatch('updateProject', project)
            .catch(err => this.$throwError(err))
            .finally(() => this.$store.commit('HIDE_LOADING'))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.project-step-6 {
  padding: 28px;
  border-radius: 4px;
  background-color: #f4f4f5;
}
</style>
