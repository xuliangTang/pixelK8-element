<template>
  <div>
    <el-form :model="rewriteConfig" label-width="80px">
      <el-form-item label="启用">
        <el-switch v-model="rewriteConfig.rewrite_enable" />
      </el-form-item>
      <el-form-item label="重写配置">
        <el-input v-model="rewriteConfig.rewrite_target" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
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
      const prefix = 'nginx.ingress.kubernetes.io'
      let result = ''
      if (this.rewriteConfig.rewrite_enable) {
        for (const key in this.rewriteConfig) {
          const newKey = key.replace('_', '-')
          if (this.rewriteConfig[key] !== '') {
            result += prefix + '/' + newKey + ':' + this.rewriteConfig[key] + ';'
          }
        }
        return result
      }

      return ''
    }
  }
}
</script>
