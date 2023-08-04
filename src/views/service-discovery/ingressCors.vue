<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>跨域配置</span>
      </div>
      <div>
        <el-form :model="corsConfig" label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="corsConfig.enable_cors" />
          </el-form-item>
          <el-form-item label="允许来源">
            <el-input v-model="corsConfig.cors_allow_origin" style="width:150px" />
          </el-form-item>
          <el-form-item label="请求方法">
            <el-input v-model="corsConfig.cors_allow_methods" style="width:450px" />
          </el-form-item>
          <el-form-item label="允许头">
            <el-input v-model="corsConfig.cors_allow_headers" />
          </el-form-item>
          <el-form-item label="暴露头(js可访问)">
            <el-input v-model="corsConfig.cors_expose_headers" />
          </el-form-item>
          <el-form-item label="允许凭据">
            <el-switch v-model="corsConfig.cors_allow_credentials" />
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
      corsConfig: {
        cors_allow_origin: '*',
        enable_cors: false,
        cors_allow_methods: 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        cors_allow_headers: 'Content-Type,AccessToken,X-CSRF-Token,Authorization,Token',
        cors_expose_headers: '',
        cors_allow_credentials: false
      }
    }
  },
  methods: {
    output() {
      const result = {}
      if (this.corsConfig.enable_cors) {
        for (const key in this.corsConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.corsConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.corsConfig[key].toString()
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
      for (const mykey in this.corsConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.corsConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
