<template>
  <el-form :inline="true" style="width: 100%;margin:10px auto">
    <el-form-item v-show="tips">
      <span class="is-gray">任何大于或等于 200 并且小于 400 的返回代码标示成功，其它返回代码都标示失败</span>
    </el-form-item>
    <el-form-item label="Host" style="width: 100%;margin-bottom: 10px">
      <el-input v-model="httpGetAction.host" placeholder="一般不用填" />
      <span v-show="tips" class="is-gray">默认会去请求pod ip</span>
    </el-form-item>
    <el-form-item label="Path" style="width: 100%;margin-bottom: 10px">
      <el-input v-model="httpGetAction.path" placeholder="如/healthz" />
      <span v-show="tips" class="is-gray">譬如/healthz ,/abc都行，只要你的api中有这个路由</span>
    </el-form-item>
    <el-form-item label="端口" style="width: 100%;margin-bottom: 10px">
      <el-input-number v-model="httpGetAction.port" :min="1" :max="65535" placeholder="填1 ~~ 65535以上端口" />
      <span v-show="tips" class="is-gray li">端口。一般填80或以上端口</span>
    </el-form-item>

    <el-form-item label="头设置" style="width: 100%;margin-bottom: 10px">
      <HttpHeader ref="httpHeader" :tips="tips" :data.sync="httpGetAction.httpHeaders" />
      <span v-show="tips" class="is-gray">支持头的传递，可以设置多个</span>
    </el-form-item>

  </el-form>

</template>
<script>
export default {
  components: {
    ArrayInput: () => import('@/components/Common/ArrayInput'),
    HttpHeader: () => import('@/components/Deploy/container-httpheader')
  },
  props: ['data', 'tips'],
  data() {
    return {
      httpGetAction: {}
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.initData(newVal)
      },
      deep: true
    },
    httpGetAction: {
      handler(newVal, oldVal) {
        this.$emit('update:data', newVal)
      },
      deep: true
    }
  },
  created() {
    this.initData(this.data)
  },
  methods: {
    clearHeader() {
      this.$refs.httpHeader.httpHeaders = []
    },
    initData(data) {
      this.httpGetAction = data
      if (this.httpGetAction === undefined) {
        this.httpGetAction = {}
      }
    }
  }
}
</script>
