<template>
  <div class="app-container">
    <p>Secret总数: {{ countSec() }}</p>
    <el-container v-for="item in nslist">
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getSecList(item.name)"
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
          <el-table-column label="类型">
            <template slot-scope="scope">
              <p>{{ scope.row.type[0] }}</p>
              <p class="is-gray">{{ scope.row.type[1] }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown @command="handleMore">
                <el-button type="text" size="mini">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item :command="['drop', scope.row]">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="getSecTotal(item.name)"
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
import { getSecretList } from '@/api/secret'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      secList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadSecrets(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'secrets') {
          this.pages[data.result.ns] = 1
          this.secList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getSecList(ns) {
      return (ns) => {
        if (typeof (this.secList[ns]) === undefined || this.secList[ns] == null) {
          return null
        }
        return this.secList[ns].items
      }
    },
    getSecTotal(ns) {
      return (ns) => {
        if (typeof (this.secList[ns]) === undefined || this.secList[ns] == null) {
          return 0
        }
        return this.secList[ns].page.extend.count
      }
    },
    countSec() {
      return () => {
        let num = 0
        for (const ns in this.secList) {
          if (typeof (this.secList[ns]) !== undefined && this.secList[ns] !== null) {
            num += this.secList[ns].page.extend.count
          }
        }
        return num
      }
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        console.log('删除')
      }
    },
    changePage(ns, page) {
      this.loadSecrets(ns, page)
    },
    loadSecrets(ns, page) {
      getSecretList(ns, page).then(response => {
        this.$set(this.secList, ns, response.data.data)
      })
    }
  }
}
</script>
