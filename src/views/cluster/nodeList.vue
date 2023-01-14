<template>
  <div class="app-container">
    <p>Node总数: {{ getNodeTotal }} </p>
    <el-table
      v-loading="listLoading"
      :data="getNodeList"
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
          <p>{{ scope.row.name }}</p>
          <p><el-tag type="success" v-for="label in scope.row.labels"> {{ label }} </el-tag></p>
        </template>
      </el-table-column>
      <el-table-column label="内网 IP">
        <template slot-scope="scope">
          <p>{{ scope.row.ip }}</p>
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
              <el-dropdown-item><router-link :to='"node-terminal?name=" + scope.row.name'>进入终端</router-link></el-dropdown-item>
              <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="getNodeTotal"
      :page-size="10"
      :current-page.sync="pages"
      :hide-on-single-page="true"
      @current-change="(current)=>changePage(current)"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getNodeList } from '@/api/node'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wsClient: null,
      pages: 1
    }
  },
  created() {
    this.fetchData(1)
  },
  computed: {
    getNodeList() {
      if (typeof (this.list) === undefined || this.list == null) {
        return null
      }
      return this.list.items
    },
    getNodeTotal() {
      if (typeof (this.list) === undefined || this.list == null) {
        return 0
      }
      return this.list.page.extend.count
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {

      }
    },
    changePage(page) {
      this.loadNodes(page)
    },
    loadNodes(page) {
      getNodeList(page).then(response => {
        this.list = response.data.data
      })
    },
    fetchData(page) {
      this.listLoading = true
      getNodeList(page).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })

      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const data = JSON.parse(e.data)
          if (data.type === 'nodes') {
            this.pages = 1
            this.list = data.result.data
          }
        }
      }
    }
  }
}
</script>
