<template>
  <el-form-item>
    <el-form style="width: 100%;margin-left: 10px;border:solid 1px #ddd;padding:10px">
      <el-form-item :label="title">
        <el-switch
          v-model="enable"
          active-text="开启"
          inactive-text="关闭"
        />
      </el-form-item>
      <el-form-item v-show="enable" label="" style="width: 100%;margin-bottom: 10px">
        <el-tabs v-model="mod" @tab-click="tabChange">
          <el-tab-pane label="Exec模式" name="exec">
            <LivenessExec ref="exec" :tips="tips" :data.sync="store.exec" />
          </el-tab-pane>
          <el-tab-pane label="Http模式" name="http">
            <LivenessHttp ref="http" :tips="tips" :data.sync="store.httpGet" />
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <el-form-item v-show="enable" label="延迟探测" style="width: 100%;margin-bottom: 10px">
        <el-input-number v-model="livenessProbe.initialDelaySeconds" :min="0" />
        <span v-show="tips" class="is-gray li">执行第一次探测前应该等待的秒数</span>
      </el-form-item>
      <el-form-item v-show="enable" label="探测周期" style="width: 100%;margin-bottom: 10px">
        <el-input-number v-model="livenessProbe.periodSeconds" :min="0" />
        <span v-show="tips" class="is-gray li">每多少秒执行一次存活探测</span>
      </el-form-item>
      <el-form-item v-show="enable" label="探测超时" style="width: 100%;margin-bottom: 10px">
        <el-input-number v-model="livenessProbe.timeoutSeconds" :min="1" />
        <span v-show="tips" class="is-gray li">探测超时时间，默认1秒，最小1</span>
      </el-form-item>
    </el-form>
  </el-form-item>
</template>
<script>
import { isEmptyObject } from '@/utils/helper'

export default {
  components: {
    LivenessExec: () => import('@/components/Deploy/container-liveness-exec'),
    LivenessHttp: () => import('@/components/Deploy/container-liveness-http')
  },
  props: ['data', 'tips', 'title'],
  data() {
    return {
      livenessProbe: {
        initialDelaySeconds: 0,
        periodSeconds: 0
      },
      store: { exec: {}, httpGet: {}},
      mod: 'exec',
      enable: false
    }
  },
  watch: {
    enable(n, o) {
      if (!n) {
        this.$emit('update:data', {})
      } else {
        this.initData(this.data)
      }
    },
    store: {
      handler(newVal, oldVal) {
        this.setParenetData()
      },
      deep: true
    },
    livenessProbe: {
      handler(newVal, oldVal) {
        this.setParenetData()
      },
      deep: true
    }
  },
  created() {
    this.initData(this.data)
  },
  methods: {
    setParenetData() {
      if (!this.enable) {
        this.$emit('update:data', {})
        return
      }
      const { initialDelaySeconds, periodSeconds } = this.livenessProbe
      if (this.mod === 'exec') {
        this.$emit('update:data', { exec: this.store.exec, initialDelaySeconds, periodSeconds })
      } else if (this.mod === 'http') {
        this.$emit('update:data', { httpGet: this.store.httpGet, initialDelaySeconds, periodSeconds })
      }
    },
    tabChange() {
      this.setParenetData()
    },
    initData(data) {
      this.livenessProbe = data
      if (this.livenessProbe === undefined) {
        this.livenessProbe = {}
      }
      // 把livenessProbe的exec或httpGet赋值给store
      if (!isEmptyObject(this.livenessProbe.exec)) {
        this.mod = 'exec' // 切成exec模式
        this.store.exec = this.livenessProbe.exec
        this.enable = true
        return
      }
      if (!isEmptyObject(this.livenessProbe.httpGet)) {
        this.mod = 'http' // 默认切成http模式
        this.store.httpGet = this.livenessProbe.httpGet
        this.enable = true
      }
    }
  }
}
</script>
