<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>限流配置</span>
      </div>
      <div>
        <el-form :model="ratelimitConfig" label-width="150px">
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
    </el-card>
  </div>
</template>
<script>
const prefix = 'nginx.ingress.kubernetes.io'
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
      const result = {}
      if (this.ratelimitConfig.limit_enable) {
        for (const key in this.ratelimitConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.ratelimitConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.ratelimitConfig[key].toString()
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
      for (const mykey in this.ratelimitConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.ratelimitConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
