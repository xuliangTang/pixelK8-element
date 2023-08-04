<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>重写配置</span>
      </div>
      <div>
        <el-form :model="rewriteConfig" label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="rewriteConfig.rewrite_enable" />
          </el-form-item>
          <el-form-item label="重写配置">
            <el-input v-model="rewriteConfig.rewrite_target" />
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
      rewriteConfig: {
        rewrite_enable: false,
        rewrite_target: ''
      }
    }
  },
  methods: {
    output() {
      const result = {}
      if (this.rewriteConfig.rewrite_enable) {
        for (const key in this.rewriteConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.rewriteConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.rewriteConfig[key].toString()
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
      for (const mykey in this.rewriteConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.rewriteConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
