<template>
  <div class="app-container">
    <p>RoleBinding总数: {{ countRoleBinding() }}</p>
    <p>
      <span><router-link to="roleBinding-create"><el-button>创建</el-button></router-link></span>
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
            width="55"
          />
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
              <p>
                <el-tag class="li" v-for="sub in scope.row.subjects" closable type="info" @close="rmUserFromBinding(scope.row.namespace,scope.row.name,sub.kind,sub.name)"> {{ sub.kind }} / {{ sub.name }} </el-tag>
                <span class="li"><el-button type="" size="mini" icon="el-icon-plus" circle @click="()=>showAdd(scope.$index,scope.row.namespace,scope.row.name)" /></span>
              </p>

              <p v-show="addConfig.ns === scope.row.namespace && addConfig.index === scope.$index">
                <el-select size="mini" v-model="addConfig.kind" style="width:80px;height:30px!important;">
                  <el-option label="User" value="User" />
                  <el-option label="ServiceAccount" value="ServiceAccount" />
                </el-select>
                <el-input size="mini" v-model="addConfig.name" placeholder="输入用户名" style="width: 100px" />
                <el-link type="primary" @click="appendUserToBinding" class="li">保存</el-link>
                <el-link type="primary" @click="addConfig.index=-1" class="li">取消</el-link>
              </p>
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
                  更多<i class="el-icon-caret-bottom el-icon--right" />
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
        />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getRoleBindingList, deleteRoleBinding, addUserToRoleBinding, removeUserFromRoleBinding } from '@/api/roleBinding'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      roleBindingList: {},
      pages: {},
      addConfig: {
        index: -1,
        kind: 'User',
        name: '', // 用户名
        bindingname: '', // binding名称
        ns: '' // 命名空间
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
  methods: {
    showAdd(index, ns, bdname) {
      this.addConfig.index = index
      this.addConfig.ns = ns
      this.addConfig.bindingname = bdname
    },
    appendUserToBinding() {
      const { ns, bindingname, kind, name } = this.addConfig
      // 构建出一个subject
      addUserToRoleBinding(ns, bindingname, { kind, name }).then(rsp => {
        this.addConfig.index = -1
        this.addConfig.name = ''
      }).catch((err) => {
        if (err.response) {
          this.$message.error(err.response.data.error)
        } else {
          this.$message.error(err.message)
        }
      })
    },
    rmUserFromBinding(ns, bdname, kind, username) {
      this.$confirm('是否删除 ' + username, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeUserFromRoleBinding(ns, bdname, { kind, name: username })
      })
    },
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
