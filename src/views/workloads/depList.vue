<template>
  <div class="app-container">
    <p>Deployment总数: {{ countDep() }} 就绪：{{ countReadyDep() }}</p>
    <el-container v-for="item in nslist" >
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          :data="getDepList(item.name)"
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
        <el-pagination
          background
          layout="prev, pager, next"
          :total="getDepTotal(item.name)"
          :page-size="5"
          :current-page.sync="pages[item.name]"
          :hide-on-single-page="true"
          @current-change="(current)=>changePage(item.name,current)"
        >
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getDeploymentList } from '@/api/deployments'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wsClient: null,
      nslist: null,
      depList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadDeployments(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'deployments') {
          this.pages[data.result.ns] = 1
          this.depList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
    // this.fetchData()
  },
  computed: {
    getDepList(ns) {
      return (ns) => {
        if (typeof (this.depList[ns]) === undefined || this.depList[ns] == null) {
          return null
        }
        return this.depList[ns].items
      }
    },
    getDepTotal(ns) {
      return (ns) => {
        if (typeof (this.depList[ns]) === undefined || this.depList[ns] == null) {
          return 0
        }
        return this.depList[ns].page.extend.count
      }
    },
    countDep() {
      return () => {
        let num = 0
        for (const ns in this.depList) {
          if (typeof (this.depList[ns]) !== undefined && this.depList[ns] !== null) {
            num += this.depList[ns].page.extend.count
          }
        }
        return num
      }
    },
    countReadyDep() {
      return () => {
        let num = 0
        for (const ns in this.depList) {
          if (typeof (this.depList[ns]) !== undefined && this.depList[ns] !== null) {
            num += this.depList[ns].page.extend.count_ready
          }
        }
        return num
      }
    }
  },
  methods: {
    changePage(ns, page) {
      this.loadDeployments(ns, page)
    },
    loadDeployments(ns, page) {
      getDeploymentList(ns, page).then(response => {
        this.$set(this.depList, ns, response.data.data)
      })
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

.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.is-gray {color: gray}
.is-red {color: red}
.is-green {color: green}
</style>