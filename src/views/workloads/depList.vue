<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p v-html="getStatus(scope.row)"></p>
          <p class="is-red">{{ getMessage(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="镜像">
        <template slot-scope="scope">
          {{ scope.row.images }}
        </template>
      </el-table-column>
      <el-table-column label="副本数">
        <template slot-scope="scope">
          <span>{{ scope.row.replicas[0] }}</span> /
          <span class="is-green">{{ scope.row.replicas[1] }}</span> /
          <span class="is-red">{{ scope.row.replicas[2] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
<!--      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/deployments'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wsClient: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList('default').then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const data = JSON.parse(e.data)
          if (data.type === 'deployments') {
            this.list = data.result.data
            this.$forceUpdate()
          }
        }
      }
    },
    getStatus(row) {
      if (row.is_completed) {
        return '<span class="is-green">Active</span>'
      }
      return '<span class="is-red">Waiting</span>'
    },
    getMessage(row) {
      if (!row.is_completed) {
        return row.message
      }
      return ''
    }
  }
}
</script>

<style>
.is-red {color: red}
.is-green {color: green}
</style>
