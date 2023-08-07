<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>流量复制</span>
      </div>
      <div>
        <el-form :model="mirrorConfig" label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="mirrorConfig.mirror_enable" />
          </el-form-item>
          <el-form-item label="目标地址">
            <el-input v-model="mirrorConfig.mirror_target" placeholder="如 http://服务名/request_uri" />
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
      mirrorConfig: {
        mirror_enable: false,
        mirror_target: ''
      }
    }
  },
  methods: {
    output() {
      const result = {}
      if (this.mirrorConfig.mirror_enable) {
        for (const key in this.mirrorConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.mirrorConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.mirrorConfig[key].toString()
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
      for (const mykey in this.mirrorConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.mirrorConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
