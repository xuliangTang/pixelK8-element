<template>
  <div>
    <el-form :model="ratelimitConfig" label-width="80px">
      <el-form-item label="每秒请求数" label-width="90px">
        <el-input v-model="ratelimitConfig.limit_rps" style="width: 120px" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ratelimitConfig: {
        limit_rps: ''
      }
    }
  },
  methods: {
    output() {
      const prefix = 'nginx.ingress.kubernetes.io'
      let result = ''

      for (const key in this.ratelimitConfig) {
        const newKey = key.replace('_', '-')
        if (this.ratelimitConfig[key] !== '') {
          result += prefix + '/' + newKey + ':' + this.ratelimitConfig[key] + ';'
        }
      }

      return result
    }
  }
}
</script>
