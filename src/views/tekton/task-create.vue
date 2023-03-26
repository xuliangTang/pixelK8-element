<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form :inline="true">
          <el-form-item label="任务名称">
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
          <el-form-item class="container" style="width: 100%">
            <Container tektontask="true" :data.sync="spec.steps" title="步骤设置(容器设置)" defaultname="step" />
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" @click="saveTask">保存</el-button>
      </div>
    </el-card>

    <div>
      <DeployYaml :deployment="{metadata,spec}" />
    </div>
  </div>
</template>
<!--//程序员在囧途(www.jtthink.com)咨询群：98514334-->
<script>
import DeployYaml from '@/views/workloads/depYaml.vue'
import { getNsList } from '@/api/namespace'
import { saveTask, deleteTask, getTask, updateTask } from '@/api/tekton'
import { clearEmptyObject, clearAll } from '@/utils/helper'
const stepExtProps = ['script', 'timeout', 'workspaces']
export default {
  components: {
    DeployYaml,
    Container: () => import('@/views/workloads/depSpecTemplateContainer.vue')
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
        getTask(ns, name).then(rsp => {
          this.isEdit = true
          this.metadata = rsp.data.data.metadata
          this.spec = rsp.data.data.spec
          this.unparseStep() // 合并属性
        })
      }
    })
  },
  methods: {
    unparseStep() {
      // 主要是 script，timeout，workspaces 三个属性。  如果有 要 合并到tektontask属性中
      for (var j = 0; j < this.spec.steps.length; j++) {
        for (var i = 0; i < stepExtProps.length; i++) {
          if (this.spec.steps[j][stepExtProps[i]]) {
            if (this.spec.steps[j].tektontask === undefined) {
              this.spec.steps[j].tektontask = {}
            }
            this.spec.steps[j].tektontask[stepExtProps[i]] = this.spec.steps[j][stepExtProps[i]]
            delete this.spec.steps[j][stepExtProps[i]]
          }
        }
      }
    },
    parseSteps() {
      this.spec.steps.forEach(step => {
        // 主要是 script，timeout，workspaces 三个属性。
        if (step['tektontask'] !== undefined) { // 这里要处理  额外的 属性
          for (var taskKey in step['tektontask']) {
            step[taskKey] = step['tektontask'][taskKey]
          }
          delete step['tektontask']
          if (step.script !== undefined && step.script !== '') {
            delete step.command
          }
        }
      })
    },
    saveTask() {
      this.parseSteps()
      const cleardObject = clearAll(this.spec)
      const operatorFunc = this.isEdit ? updateTask : saveTask
      operatorFunc({ metadata: this.metadata, spec: this.spec }).then(rsp => {
        alert('成功')
        this.$router.push({ name: 'Tasklist' })
      })
    }
  }
}

</script>
<style>
  .container .el-card{min-width: 800px}
</style>
