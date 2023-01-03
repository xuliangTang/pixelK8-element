<template>
  <div class="app-container">
    <p>Service总数: {{ countSvc() }}</p>
    <el-container v-for="item in nslist">
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getSvcList(item.name)"
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
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="目标">
            <template slot-scope="scope">
              <p v-for="t in scope.row.target"> {{ t }} </p>
            </template>
          </el-table-column>
          <el-table-column label="选择器">
            <template slot-scope="scope">
              <p v-for="s in scope.row.selector"> {{ s }} </p>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70">
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
          :total="getSvcTotal(item.name)"
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
import { getServiceList } from '@/api/service'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      svcList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadServices(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'services') {
          this.pages[data.result.ns] = 1
          this.svcList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getSvcList(ns) {
      return (ns) => {
        if (typeof (this.svcList[ns]) === undefined || this.svcList[ns] == null) {
          return null
        }
        return this.svcList[ns].items
      }
    },
    getSvcTotal(ns) {
      return (ns) => {
        if (typeof (this.svcList[ns]) === undefined || this.svcList[ns] == null) {
          return 0
        }
        return this.svcList[ns].page.extend.count
      }
    },
    countSvc() {
      return () => {
        let num = 0
        for (const ns in this.svcList) {
          if (typeof (this.svcList[ns]) !== undefined && this.svcList[ns] !== null) {
            num += this.svcList[ns].page.extend.count
          }
        }
        return num
      }
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
      }
    },
    changePage(ns, page) {
      this.loadServices(ns, page)
    },
    loadServices(ns, page) {
      getServiceList(ns, page).then(response => {
        this.$set(this.svcList, ns, response.data.data)
      })
    }
  }
}
</script>
