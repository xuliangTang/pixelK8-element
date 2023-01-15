<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择角色</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="绑定名称">
          <el-input v-model="metadata.name" />
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="metadata.namespace" @change="changeNs">
            <el-option
              v-for="ns in nslist "
              :label="ns.name"
              :value="ns.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择角色">
          <el-select v-model="roleRef.name">
            <el-option
              v-for="role in rolelist "
              :label="role.name"
              :value="role.name"
            />
          </el-select>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择用户</span>
        <el-form v-for="(sub,subindex) in subjects" :inline="true" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="sub.kind"
              placeholder="用户类型"
            >
              <el-option
                label="User"
                value="User"
              />
              <el-option
                label="ServiceAccount"
                value="ServiceAccount"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="sub.name" placeholder="输入用户名" />
          </el-form-item>

          <el-button v-show="subindex>0" type="danger" size="mini" icon="el-icon-minus" circle @click="rmSubject(subindex)" />
        </el-form>
      </div>

      <el-button type="primary" icon="el-icon-plus" @click="addSubject">添加配置</el-button>
      <el-button type="primary" @click="saveRoleBinding">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getNsList } from '@/api/namespace'
import { getRoleAll } from '@/api/role'
import { createRoleBinding } from '@/api/roleBinding'

const apiGroup = 'rbac.authorization.k8s.io'
export default {
  data() {
    return {
      metadata: { name: '', namespace: 'default' },
      nslist: [],
      rolelist: [], // 切换ns后填充角色列表
      roleRef: { kind: 'Role', name: '' },
      subjects: [ // 前端所使用的rule
        { kind: 'User', name: '' }
      ]
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
      this.loadRoleList()
    })
  },
  methods: {
    changeNs(ns) {
      this.roleRef.name = ''
      this.loadRoleList()
    },
    loadRoleList() {
      getRoleAll(this.metadata.namespace).then(rsp => {
        this.rolelist = rsp.data.data
        console.log(this.rolelist)
      })
    },
    addSubject() {
      this.subjects.unshift({ kind: 'User', name: '' })
    },

    rmSubject(index) {
      this.subjects.splice(index, 1)
    },

    saveRoleBinding() {
      const postData = { metadata: this.metadata, subjects: this.subjects, roleRef: this.roleRef }
      createRoleBinding(postData).then(rsp => {
        this.$router.push({
          path: `rolebindings`
        })
      }).catch((error) => {
        if (error.response) {
          this.$message.error(error.response.data.error)
        } else {
          this.$message.error(error.message)
        }
      })
    }
  }

}

</script>
<style>
.ii{font-size: 18px}
</style>
