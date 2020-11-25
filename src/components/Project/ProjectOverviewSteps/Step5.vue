<template>
  <div v-if="$store.getters.isCadi || $store.getters.isRepresentative" class="project-step-5">
    <div v-if="$store.getters.isCadi">
      <h3 class="mb-12">
        Adicione um local e as datas possíveis para a reunião
      </h3>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="130px"
      >
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="Local" prop="place">
              <el-input
                v-model="form.place"
                type="text"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="CEP" prop="zipCode">
              <el-input
                v-model="form.zipCode"
                v-mask="'#####-###'"
                type="text"
                maxlength="9"
                show-word-limit
                @blur="findAddressByCep()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Cidade" prop="city">
              <el-input
                v-model="form.city"
                type="text"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bairro" prop="neighborhood">
              <el-input
                v-model="form.neighborhood"
                type="text"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="Rua" prop="street">
              <el-input
                v-model="form.street"
                type="text"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Número" prop="number">
              <el-input
                v-model="form.number"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item label="* Data e hora da reunião" prop="dates">
              <el-date-picker
                v-model="newMeetingDate"
                type="datetime"
                @change="addPossibleDate()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <h4 v-if="form.dates.length" class="mt-24 mb-16">Data(s) cadastrada(s):</h4>
        <el-tag
          v-for="(date, index) in form.dates"
          :key="index"
          closable
          effect="plain"
          @close="handleClose(date)"
        >
          {{ date.dateTime | moment("DD/MM/YYYY HH:mm") }}
        </el-tag>
      </el-form>
    </div>
    <div v-else-if="$store.getters.isRepresentative">
      <h4>Selecione uma data para a reunião:</h4>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        label-width="130px"
      >
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item prop="chosenDate">
              <el-select v-model="form.chosenDate" class="w100 mt-20">
                <el-option
                  v-for="date in project.meeting.possibleDate"
                  :key="date.dateTime"
                  :value="date.dateTime"
                  :label="$moment(date.dateTime).format('DD/MM/YYYY HH:mm')"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="justify-end d-flex mt-28">
      <el-button type="primary" @click="update()">
        {{ $store.getters.isCadi ? 'Adicionar local e datas' : 'Selecionar' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import jsonp from 'jsonp'
import { mapGetters } from 'vuex'

export default {
  directives: { mask },
  data () {
    const required = [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
    const validateDates = (rule, value, callback) => {
      if (!this.form.dates.length) {
        callback(new Error('Campo obrigatório'))
      } else {
        callback()
      }
    }
    return {
      newMeetingDate: '',
      form: {
        place: '',
        number: '',
        street: '',
        neighborhood: '',
        city: '',
        zipCode: '',
        dates: [],
        chosenDate: ''
      },
      rules: {
        place: required,
        number: required,
        street: required,
        neighborhood: required,
        city: required,
        zipCode: required,
        dates: [{ validator: validateDates, trigger: 'submit' }],
        chosenDate: required
      }
    }
  },
  computed: {
    ...mapGetters({
      project: 'selectedProject'
    })
  },
  mounted () {
    this.form = this.project.meeting.address
    this.form.dates = this.project.meeting.possibleDate
  },
  methods: {
    update () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$store.commit('SHOW_LOADING')
          const project = JSON.parse(JSON.stringify(this.project))
          if (this.form.chosenDate) project.meeting.chosenDate = this.form.chosenDate
          else {
            project.meeting.address = this.form
            project.meeting.possibleDate = this.form.dates
          }
          this.$store.dispatch('updateProject', project)
            .catch(err => this.$throwError(err))
            .finally(() => this.$store.commit('HIDE_LOADING'))
        }
      })
    },
    findAddressByCep () {
      const self = this
      const cep = this.form.zipCode
      if (/^[0-9]{5}-[0-9]{3}$/.test(cep) || /^[0-9]{5}[0-9]{3}$/.test(cep)) {
        jsonp(`https://viacep.com.br/ws/${cep}/json/`, null, function (err, address) {
          if (err) this.$throwError(err)
          else {
            self.form.city = address.localidade
            self.form.street = address.logradouro
            self.form.neighborhood = address.bairro
            self.form.zipCode = address.cep
          }
        })
      }
    },
    addPossibleDate () {
      this.form.dates.push({ dateTime: this.newMeetingDate })
      this.newMeetingDate = ''
    },
    handleClose (tag) {
      this.form.dates.splice(this.form.dates.indexOf(tag), 1)
    }
  }
}
</script>

<style lang="scss">
.project-step-5 {
  .el-tag {
    margin: 0 12px 12px 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
}
</style>
