<template>
  <div>
    <el-form :model="ratelimitConfig">
      <el-form-item label="启用">
        <el-switch v-model="ratelimitConfig.limit_enable" />
      </el-form-item>
      <el-form-item label="每秒请求数">
        <el-input v-model="ratelimitConfig.limit_rps" style="width: 120px" />
      </el-form-item>
      <el-form-item label="突发请求数(倍数)">
        <el-input v-model="ratelimitConfig.limit_burst_multiplier" style="width: 120px" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ratelimitConfig: {
        limit_enable: false,
        limit_rps: '',
        limit_burst_multiplier: '5' // 突发请求数倍数。默认5
      }
    }
  },
  methods: {
    output() {
      const prefix = 'nginx.ingress.kubernetes.io'
      let result = ''

      if (this.ratelimitConfig.limit_enable) {
        for (const key in this.ratelimitConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.ratelimitConfig[key] !== '') {
            result += prefix + '/' + newKey + ':' + this.ratelimitConfig[key] + ';'
          }
        }
      }

      return result
    }
  }
}
</script>
