<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>灰度发布</span>
      </div>
      <div>
        <el-form :model="canaryConfig" label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="canaryConfig.canary" />
          </el-form-item>
          <el-form-item label="基于header">
            <el-input v-model="canaryConfig.canary_by_header" placeholder="key" style="width: 200px" />
            -
            <el-input v-model="canaryConfig.canary_by_header_value" placeholder="value" style="width: 200px" />
          </el-form-item>
          <el-form-item label="基于权重">
            <el-input v-model="canaryConfig.canary_weight" style="width: 200px" />
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
      canaryConfig: {
        canary: false,
        canary_by_header: '',
        canary_by_header_value: '',
        canary_weight: 0
      }
    }
  },
  methods: {
    output() {
      const result = {}
      if (this.canaryConfig.canary) {
        for (const key in this.canaryConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.canaryConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.canaryConfig[key].toString()
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
      for (const mykey in this.canaryConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.canaryConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
