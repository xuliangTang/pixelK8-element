<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>快捷创建</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="postUser.Name" placeholder="必填,同名用户会被覆盖" />
        </el-form-item>
        <el-form-item label="组">
          <el-input v-model="postUser.Group" placeholder="选填" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createUser">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <p>UserAccount总数: {{ countUserAccount }}</p>
    <el-table
      v-loading="listLoading"
      :data="getList"
      element-loading-text="Loading"
      stripe
      fit
      highlight-current-row
    >
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
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
              更多<i class="el-icon-caret-bottom el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="['kubeconfig', scope.row]" class="clearfix">查看kubeconfig</el-dropdown-item>
              <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="countUserAccount"
      :page-size="10"
      :current-page.sync="pages"
      :hide-on-single-page="true"
      @current-change="(current)=>changePage(current)"
    />
  </div>
</template>
<script>
import { getUserAccountList, createUserAccount, deleteUserAccount } from '@/api/userAccount'

export default {
  data() {
    return {
      pages: 1,
      list: null,
      listLoading: true,
      postUser: {
        Name: '', // cn
        Group: '' // o
      }
    }
  },
  computed: {
    getList() {
      if (typeof (this.list) === undefined || this.list == null) {
        return null
      }
      return this.list.items
    },
    countUserAccount() {
      if (typeof (this.list) === undefined || this.list == null) {
        return 0
      }
      return this.list.page.extend.count
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        this.$confirm('删除用户将会删除证书', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteUserAccount(command[1].name).then(rsp => {
            this.fetchData()
          })
        }).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      } else if (command[0] === 'kubeconfig') {
        this.$router.push({
          path: `kubeconfig-show?cn=` + command[1].name
        })
      }
    },
    changePage(page) {
      this.loadUserAccounts(page)
    },
    createUser() {
      createUserAccount({ cn: this.postUser.Name, o: this.postUser.Group }).then(rsp => {
        this.fetchData()
        this.postUser.Name = ''
        this.postUser.Group = ''
      })
    },
    loadUserAccounts(page) {
      getUserAccountList(page).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    fetchData() {
      this.listLoading = true
      getUserAccountList(1).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    }
  }
}
</script>
