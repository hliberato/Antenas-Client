<template>
  <div>
    <div>
      <h3>
        Adicione um local e as datas possíveis para a reunião
      </h3>
      <el-form
        ref="form"
        v-loading="$store.getters.loading"
        class="login-form"
        :rules="rules"
        label-position="top"
        label-width="130px"
      >
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item label="Local" prop="place">
              <el-input
                v-model="address.place"
                type="text"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="CEP" prop="zipCode">
              <el-input
                v-model="address.zipCode"
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
                v-model="address.city"
                type="text"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bairro" prop="neighborhood">
              <el-input
                v-model="address.neighborhood"
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
                v-model="address.street"
                type="text"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Número" prop="number">
              <el-input-number
                v-model="address.number"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Data e hora da reunião" prop="date">
          <el-date-picker
            v-model="newMeetingDate"
            type="datetime"
            @change="addPossibleDate()"
          />
        </el-form-item>
        <div class="tag-group">
          <h3> Datas cadastradas </h3>
          <el-tag
            v-for="date in dates"
            :key="date.dateTime"
            closable
            effect="plain"
            @close="handleClose(date)"
          >
            {{ date.dateTime | moment("DD/MM/YYYY HH:mm") }}
          </el-tag>
        </div>
        <div class="justify-end d-flex">
          <el-button
            plain
            type="success"
            :disabled="buttonDisabled()"
            @click="update()"
          >
            Salvar
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import $ from 'jQuery'

export default {
  directives: { mask },
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
      newMeetingDate: '',
      address: {
        id: '',
        place: '',
        number: '',
        street: '',
        neighborhood: '',
        city: '',
        zipCode: ''
      },
      dates: [],
      rules: {
        place: required,
        number: required,
        street: required,
        neighborhood: required,
        city: required,
        zipCode: required
      }
    }
  },
  mounted () {
    this.address = this.project.meeting.address
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')
      this.project.meeting.address = this.address
      this.project.meeting.possibleDate = this.dates
      this.$store.dispatch('updateProject', this.project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    },
    findAddressByCep () {
      const cep = this.address.zipCode
      let address
      if (/^[0-9]{5}-[0-9]{3}$/.test(cep) || /^[0-9]{5}[0-9]{3}$/.test(cep)) {
        $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (res) {
          address = res
        }).then(() => {
          this.address.city = address.localidade
          this.address.street = address.logradouro
          this.address.neighborhood = address.bairro
          this.address.zipCode = address.cep
        })
      }
    },
    buttonDisabled () {
      return !(this.address.place && this.address.number &&
      this.address.street && this.address.neighborhood &&
      this.address.city && this.address.zipCode &&
      this.dates.length > 0)
    },
    addPossibleDate () {
      this.dates.push({ dateTime: this.newMeetingDate })
      this.newMeetingDate = ''
    },
    handleClose (tag) {
      this.dates.splice(this.dates.indexOf(tag), 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}
</style>
