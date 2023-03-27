<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form :inline="true">
          <el-form-item label="流水线运行时名称">
            <el-input v-model="metadata.name" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="metadata.namespace" :disabled="isEdit">
              <el-option
                v-for="ns in nslist "
                :label="ns.name"
                :value="ns.name"
              />
            </el-select>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form>
          <el-form-item label="关联流水线" class="container" style="width: 100%">
            <el-select v-model="spec.pipelineRef.name">
              <el-option v-for="item in pipelineList" :label="item.metadata.name" :value="item.metadata.name" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" @click="savePipelineRun">保存</el-button>
      </div>
    </el-card>

    <div>
      <DeployYaml :deployment="{metadata,spec}" />
    </div>
  </div>
</template>

<script>
import DeployYaml from '@/views/workloads/depYaml.vue'
import { getNsList } from '@/api/namespace'
import { getPipelineList, savePipelineRun, getPipelineRun, updatePipelineRun } from '@/api/tekton'
import { clearAll } from '@/utils/helper'

export default {
  components: {
    DeployYaml,
  },
  data() {
    return {
      metadata: { name: '', namespace: 'default' },
      nslist: [],
      spec: { pipelineRef: {}}, // 目前 我们暂时只支持 关联的模式
      isEdit: false,
      pipelineList: []
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
      this.loadPipeLineList()
      if (this.$route.params.ns !== undefined && this.$route.params.name !== undefined) {
        const ns = this.$route.params.ns
        const name = this.$route.params.name
        getPipelineRun(ns, name).then(rsp => {
          this.isEdit = true
          this.metadata = rsp.data.data.metadata
          this.spec = rsp.data.data.spec
        })
      }
    })
  },
  methods: {
    loadPipeLineList() {
      getPipelineList(this.metadata.namespace).then(rsp => {
        this.pipelineList = rsp.data.data
      })
    },
    savePipelineRun() {
      const operatorFunc = this.isEdit ? updatePipelineRun : savePipelineRun
      operatorFunc({ metadata: this.metadata, spec: this.spec }).then(rsp => {
        alert('成功')
        this.$router.push({ name: 'Pipelinerunlist' })
      })
    }
  }
}

</script>
<style>
  .container .el-card{min-width: 800px}
</style>
