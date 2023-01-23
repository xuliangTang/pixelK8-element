<template>
  <div class="app-container">
    <p>ClusterRoleBinding总数: {{ countClusterRoleBinding }}</p>
    <p>
      <span><router-link to="clusterrolebinding-create"><el-button>创建</el-button></router-link></span>
    </p>
    <el-table
      v-loading="listLoading"
      :data="getClusterRoleBindingList"
      element-loading-text="Loading"
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
            <el-tag size="mini" class="li" v-for="sub in scope.row.subjects" closable type="info" @close="rmUserFromBinding(scope.row.name,sub.kind,sub.name)"><span class="el-tag-content"> {{ sub.kind }} / {{ sub.name }} <span v-if="sub.namespace">({{ sub.namespace }})</span></span> </el-tag>
            <span class="li"><el-button type="" size="mini" icon="el-icon-plus" circle @click="()=>showAdd(scope.$index,scope.row.name)" /></span>
          </p>

          <p v-show="addConfig.index === scope.$index">
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
      :total="countClusterRoleBinding"
      :page-size="10"
      :current-page.sync="pages"
      :hide-on-single-page="true"
      @current-change="(current)=>changePage(current)"
    />
  </div>
</template>

<script>
import { getClusterRoleBindingList, addUserToClusterRoleBinding, removeUserFromClusterRoleBinding, deleteClusterRoleBinding } from '@/api/clusterRoleBinding'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      wsClient: null,
      clusterRoleBindingList: null,
      pages: 1,
      addConfig: {
        index: -1,
        kind: 'User',
        name: '', // 用户名
        bindingname: '', // clusterRoleBinding名称
        ns: '' // 命名空间
      }
    }
  },
  computed: {
    getClusterRoleBindingList() {
      if (typeof (this.clusterRoleBindingList) === undefined || this.clusterRoleBindingList == null) {
        return null
      }
      return this.clusterRoleBindingList.items
    },
    countClusterRoleBinding() {
      if (typeof (this.clusterRoleBindingList) === undefined || this.clusterRoleBindingList == null) {
        return 0
      }
      return this.clusterRoleBindingList.page.extend.count
    }
  },
  created() {
    this.listLoading = true
    getClusterRoleBindingList(1).then(response => {
      this.clusterRoleBindingList = response.data.data
      this.listLoading = false
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'clusterRoleBindings') {
          this.pages = 1
          this.clusterRoleBindingList = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    showAdd(index, bdname) {
      this.addConfig.index = index
      this.addConfig.bindingname = bdname
    },
    appendUserToBinding() {
      const { bindingname, kind } = this.addConfig
      let { ns, name } = this.addConfig

      if (kind === 'ServiceAccount') {
        // clusterRoleBinding名称包含了namespace和name
        const g_name = name.split('/')
        if (g_name.length > 1) {
          name = g_name[1]
          ns = g_name[0]
        } else {
          name = g_name[0]
          ns = 'default'
        }
      }

      // 构建出一个subject
      addUserToClusterRoleBinding(bindingname, { namespace: ns, kind, name }).then(rsp => {
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
    rmUserFromBinding(bdname, kind, username) {
      this.$confirm('是否删除 ' + username, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        removeUserFromClusterRoleBinding(bdname, { kind, name: username }).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      })
    },
    handleMore(command) {
      if (command[0] === 'drop') {
        deleteClusterRoleBinding(command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
    changePage(page) {
      this.loadClusterRoleBindings(page)
    },
    loadClusterRoleBindings(page) {
      getClusterRoleBindingList(page).then(response => {
        this.clusterRoleBindingList = response.data.data
      })
    }
  }
}
</script>
