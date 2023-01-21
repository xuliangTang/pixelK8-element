<template>
  <div class="app-container">
    <p>ServiceAccount总数: {{ countSa() }}</p>
    <p>
      <span><router-link to='role-create'><el-button>创建</el-button></router-link></span>
    </p>
    <el-container v-for="item in nslist">
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getSaList(item.name)"
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
              <router-link :to='"role-show?ns=" + scope.row.namespace + "&name=" + scope.row.name'><el-link type="primary">{{ scope.row.name }}</el-link></router-link>
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
                  <el-dropdown-item :command="['showToken', scope.row]" class="clearfix">查看Token</el-dropdown-item>
                  <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="getSaTotal(item.name)"
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
import { getServiceAccountList, deleteServiceAccount } from '@/api/serviceAccount'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'
import {showSecret} from "@/api/secret"

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      saList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadSa(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'serviceAccounts') {
          this.pages[data.result.ns] = 1
          this.saList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getSaList(ns) {
      return (ns) => {
        if (typeof (this.saList[ns]) === undefined || this.saList[ns] == null) {
          return null
        }
        return this.saList[ns].items
      }
    },
    getSaTotal(ns) {
      return (ns) => {
        if (typeof (this.saList[ns]) === undefined || this.saList[ns] == null) {
          return 0
        }
        return this.saList[ns].page.extend.count
      }
    },
    countSa() {
      return () => {
        let num = 0
        for (const ns in this.saList) {
          if (typeof (this.saList[ns]) !== undefined && this.saList[ns] !== null) {
            num += this.saList[ns].page.extend.count
          }
        }
        return num
      }
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'showToken') {
        const secretName = command[1].secrets[0].name
        showSecret(command[1].namespace, secretName).then(rsp => {
          const token = rsp.data.data.data['token']
          this.$alert('<textarea style="width: 100%" rows="10">' + window.atob(token) + '</textarea>', secretName, {
            dangerouslyUseHTMLString: true
          })
        })
      } else if (command[0] === 'drop') {
        deleteServiceAccount(command[1].namespace, command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
    changePage(ns, page) {
      this.loadSa(ns, page)
    },
    loadSa(ns, page) {
      getServiceAccountList(ns, page).then(response => {
        this.$set(this.saList, ns, response.data.data)
      })
    }
  }
}
</script>
