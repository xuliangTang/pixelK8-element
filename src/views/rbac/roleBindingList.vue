<template>
  <div class="app-container">
    <p>RoleBinding总数: {{ countRoleBinding() }}</p>
    <p>
      <span><router-link to='roleBinding-create'><el-button>创建</el-button></router-link></span>
    </p>
    <el-container v-for="item in nslist">
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getRoleBindingList(item.name)"
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
          <el-table-column label="角色">
            <template slot-scope="scope">
              {{ scope.row.role_ref }}
            </template>
          </el-table-column>
          <el-table-column label="用户">
            <template slot-scope="scope">
              <el-tag closable type="info" v-for="sub in scope.row.subjects"> {{ sub.kind }} / {{ sub.name }} </el-tag>
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
          :total="getRoleBindingTotal(item.name)"
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
import { getRoleBindingList, deleteRoleBinding } from '@/api/roleBinding'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      roleBindingList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadRoleBindings(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'roleBindings') {
          this.pages[data.result.ns] = 1
          this.roleBindingList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getRoleBindingList(ns) {
      return (ns) => {
        if (typeof (this.roleBindingList[ns]) === undefined || this.roleBindingList[ns] == null) {
          return null
        }
        return this.roleBindingList[ns].items
      }
    },
    getRoleBindingTotal(ns) {
      return (ns) => {
        if (typeof (this.roleBindingList[ns]) === undefined || this.roleBindingList[ns] == null) {
          return 0
        }
        return this.roleBindingList[ns].page.extend.count
      }
    },
    countRoleBinding() {
      return () => {
        let num = 0
        for (const ns in this.roleBindingList) {
          if (typeof (this.roleBindingList[ns]) !== undefined && this.roleBindingList[ns] !== null) {
            num += this.roleBindingList[ns].page.extend.count
          }
        }
        return num
      }
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        deleteRoleBinding(command[1].namespace, command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
    changePage(ns, page) {
      this.loadRoleBindings(ns, page)
    },
    loadRoleBindings(ns, page) {
      getRoleBindingList(ns, page).then(response => {
        this.$set(this.roleBindingList, ns, response.data.data)
      })
    }
  }
}
</script>
