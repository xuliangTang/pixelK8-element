<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>默认后端</span>
      </div>
      <div>
        <el-form :model="defaultBackendConfig" label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="defaultBackendConfig.default_backend_enable" />
          </el-form-item>
          <el-form-item label="服务名">
            <el-input v-model="defaultBackendConfig.default_backend" />
          </el-form-item>
          <el-form-item label="http错误码">
            <el-input v-model="defaultBackendConfig.custom_http_errors" placeholder="多个用逗号分隔，如404,503" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
const prefix = 'nginx.ingress.kubernetes.io'
export default {
  data() {
    return {
      show: false,
      defaultBackendConfig: {
        default_backend_enable: false,
        default_backend: '',
        custom_http_errors: ''
      }
    }
  },
  methods: {
    output() {
      const result = {}
      if (this.defaultBackendConfig.default_backend_enable) {
        for (const key in this.defaultBackendConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.defaultBackendConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.defaultBackendConfig[key].toString()
          }
        }
      }

      return result
    },
    setAnnotations(data) {
      this.parseData(data)
    },
    // 编辑状态下进行annotations的解析
    parseData(data) {
      if (data !== undefined && data !== null) {
        for (const key in data) {
          this.setIfExists(key, data[key])
        }
      }
    },
    // parseData函数的辅助函数，判断传递过来的annotation中的属性在自身的对象中是否存在
    setIfExists(key, value) {
      value = value === 'true' ? true : value
      for (const mykey in this.defaultBackendConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.defaultBackendConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
