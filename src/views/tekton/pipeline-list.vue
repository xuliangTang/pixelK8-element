<template>
  <div class="app-container">
    <div style="padding: 20px">
      选择命名空间:
      <el-select v-model="namespace" placeholder="选择命名空间" @change="changeNs">
        <el-option
          v-for="ns in nslist "
          :label="ns.name"
          :value="ns.name"
        />
      </el-select>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="名称" width="350">
        <template slot-scope="scope">

          {{ scope.row.metadata.name }}

        </template>
      </el-table-column>
      <el-table-column label="命名空间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.metadata.namespace }}</span>
        </template>
      </el-table-column>

      <!--//程序员在囧途(www.jtthink.com)咨询群：98514334-->
      <el-table-column label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.metadata.creationTimestamp }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <router-link :to="{name:'Createpipeline',params:{ns:scope.row.metadata.namespace,name:scope.row.metadata.name}}"><i class="el-icon-edit" style="font-size: 18px" /></router-link>
          <i class="el-icon-delete " style="cursor:pointer;font-size: 18px;margin-left: 10px" @click="()=>rmPipeline(scope.row.metadata.namespace,scope.row.metadata.name )" />

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPipelineList, deletePipeline } from '@/api/tekton'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'
export default {
  data() {
    return {
      namespace: 'default',
      list: null,
      listLoading: true,
      wsClient: null,
      nslist: []
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
      this.fetchData()
    })
  },
  methods: {
    rmPipeline(ns, name) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deletePipeline(ns, name)
      })
    },
    changeNs(ns) {
      getPipelineList(this.namespace).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      // 通过rest api 获取
      getPipelineList(this.namespace).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'pipeline' && object.result.ns === this.namespace) {
            this.list = object.result.data
            this.$forceUpdate()
          }
        }
      }
    }

  }

}
</script>
<style>
  .red{color: #d20000
  }
  .green{color:green}
</style>
