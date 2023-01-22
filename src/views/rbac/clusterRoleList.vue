<template>
  <div class="app-container">
    <p>ClusterRole总数: {{ countClusterRole }}</p>
    <p>
      <span><router-link to='clusterrole-create'><el-button>创建</el-button></router-link></span>
    </p>
    <el-table
      v-loading="listLoading"
      :data="getClusterRoleList"
      element-loading-text="Loading"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <router-link :to='"clusterrole-show?name=" + scope.row.name'><el-link type="primary">{{ scope.row.name }}</el-link></router-link>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="handleMore">
            <el-button type="text" size="mini">
              更多<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="countClusterRole"
      :page-size="10"
      :current-page.sync="pages"
      :hide-on-single-page="true"
      @current-change="(current)=>changePage(current)"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getClusterRoleList, deleteClusterRole } from '@/api/clusterRole'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      wsClient: null,
      listLoading: true,
      clusterRoleList: null,
      pages: 1
    }
  },
  created() {
    this.listLoading = true
    getClusterRoleList(1).then(response => {
      this.clusterRoleList = response.data.data
      this.listLoading = false
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'clusterRoles') {
          this.pages = 1
          this.clusterRoleList = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getClusterRoleList() {
      if (typeof (this.clusterRoleList) === undefined || this.clusterRoleList == null) {
        return null
      }
      return this.clusterRoleList.items
    },
    countClusterRole() {
      if (typeof (this.clusterRoleList) === undefined || this.clusterRoleList == null) {
        return 0
      }
      return this.clusterRoleList.page.extend.count
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        deleteClusterRole(command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
    changePage(page) {
      this.loadClusterRoles(page)
    },
    loadClusterRoles(page) {
      getClusterRoleList(page).then(response => {
        this.clusterRoleList = response.data.data
      })
    }
  }
}
</script>
