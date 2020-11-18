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
        label-position="top"
        label-width="130px"
      >
        <el-form-item label="Local" prop="place">
          <el-input
            v-model="address.place"
            type="text"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="CEP" prop="zipCode">
          <el-input
            v-model="address.zipCode"
            type="text"
            maxlength="9"
            show-word-limit
          />
        </el-form-item>
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
                :max="9999"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="justify-end d-flex">
          <el-button
            plain
            type="success"
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
    return {
      address: {
        place: '',
        number: '',
        street: '',
        neighborhood: '',
        city: '',
        zipCode: ''
      }
    }
  },
  methods: {
    update () {
      this.$store.commit('SHOW_LOADING')
      this.project.completeDescription = this.form.completeDescription
      this.project.technologyDescription = this.form.technologyDescription
      this.$store.dispatch('updateProject', this.project)
        .catch(err => this.$throwError(err))
        .finally(() => this.$store.commit('HIDE_LOADING'))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
