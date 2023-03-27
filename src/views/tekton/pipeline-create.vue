<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form :inline="true">
          <el-form-item label="流水线名称">
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
        <el-form :inline="true">
          <el-form-item class="container" label="任务设置" style="width: 100%">
            <PipelineTasks :data.sync="spec.tasks" :ns="metadata.namespace" />
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" @click="savePipeline">保存</el-button>
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
import { getPipeline, savePipeline, updatePipeline } from '@/api/tekton'

export default {
  components: {
    DeployYaml,
    PipelineTasks: () => import('@/views/tekton/pipeline-tasks.vue')
  },
  data() {
    return {
      metadata: { name: '', namespace: 'default' },
      nslist: [],
      spec: { steps: [] },
      isEdit: false
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data

      if (this.$route.params.ns !== undefined && this.$route.params.name !== undefined) {
        const ns = this.$route.params.ns
        const name = this.$route.params.name
        getPipeline(ns, name).then(rsp => {
          this.isEdit = true
          this.metadata = rsp.data.data.metadata
          this.spec = rsp.data.data.spec
        })
      }
    })
  },
  methods: {
    savePipeline() {
      const operatorFunc = this.isEdit ? updatePipeline : savePipeline
      operatorFunc({ metadata: this.metadata, spec: this.spec }).then(rsp => {
        alert('成功')
        this.$router.push({ name: 'Pipelinelist' })
      })
    }
  }
}

</script>
<style>
.container .el-card{min-width: 800px}
</style>
