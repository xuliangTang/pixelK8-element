<template>
  <div>
    <div>
      <span>  <i class="ii el-icon-circle-plus" @click="pipelinetask.push({taskRef:{}})" />  </span>
    </div>
    <el-form v-for="(task,index) in pipelinetask" style="width: 80%;border: solid 1px #ddd;padding:20px;margin-top: 10px">
      <el-form-item label="引用名称">
        <el-input v-model="task.name" style="width: 200px" />
        <el-button type="primary" style="margin-left: 20px" @click="pipelinetask.splice(index,1)"><i class="el-icon-minus" /></el-button>

      </el-form-item>
      <el-form-item label="引用任务" style="margin-top: 10px;width: 100%">
        <el-form :inline="true">
          <el-form-item
            label="任务名称"
            style="width:80%;border:solid 1px #ddd;padding:20px;border-radius:5px"
          >
            <div>
              <el-select v-model="task.taskRef.name">
                <el-option v-for="item in taskList" :label="item.metadata.name" :value="item.metadata.name" />
              </el-select>
            </div>

          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item />

    </el-form>
  </div>
</template>
<script>
import { getTaskList } from '@/api/tekton'
export default {
  props: ['data', 'ns'],
  data() {
    return {
      pipelinetask: [],
      taskList: []
    }
  },
  watch: {
    ns: function(n, o) {
      this.initTask()
    },
    data: {
      handler: function(newVal, oldVal) {
        this.pipelinetask = newVal
        if (!this.pipelinetask) this.pipelinetask = []
      },
      deep: true
    },
    pipelinetask: {
      handler: function(newVal, oldVal) {
        this.$emit('update:data', newVal)
      },
      deep: true
    }
  },
  created() {
    this.initTask()
    this.pipelinetask = this.data
    if (!this.pipelinetask) this.pipelinetask = []
  },
  methods: {
    initTask() {
      getTaskList(this.ns).then(rsp => { // 加载任务列表
        this.taskList = rsp.data.data
      })
    }
  }
}

</script>
