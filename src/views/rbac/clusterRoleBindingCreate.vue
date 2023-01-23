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
        <el-form-item label="选择角色">
          <el-select v-model="roleRef.name">
            <el-option
              v-for="clusterRole in clusterRoleList "
              :label="clusterRole.name"
              :value="clusterRole.name"
            />
          </el-select>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择用户</span>
        <p class="is-gray">提示:选择ServiceAccount时，格式为 namespace/name 这种形式</p>
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
      <el-button type="primary" @click="saveClusterRoleBinding">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getClusterRoleAll } from '@/api/clusterRole'
import { createClusterRoleBinding } from '@/api/clusterRoleBinding'

export default {
  data() {
    return {
      metadata: { name: '' },
      clusterRoleList: [],
      roleRef: { kind: 'ClusterRole', name: '' },
      subjects: [
        { kind: 'User', name: '' }
      ]
    }
  },
  created() {
    this.loadClusterRoleList()
  },
  methods: {
    loadClusterRoleList() {
      getClusterRoleAll().then(rsp => {
        this.clusterRoleList = rsp.data.data
      })
    },
    addSubject() {
      this.subjects.unshift({ kind: 'User', name: '' })
    },
    rmSubject(index) {
      this.subjects.splice(index, 1)
    },
    saveClusterRoleBinding() {
      // clusterRoleBinding名称包含了namespace和name
      const subjects = this.subjects
      for (const i in subjects) {
        if (subjects[i].kind === 'ServiceAccount') {
          const g_name = subjects[i].name.split('/')
          if (g_name.length > 1) {
            subjects[i].name = g_name[1]
            subjects[i].namespace = g_name[0]
          } else {
            subjects[i].name = g_name[0]
            subjects[i].namespace = 'default'
          }
        }
      }

      const postData = { metadata: this.metadata, roleRef: this.roleRef, subjects }
      createClusterRoleBinding(postData).then(rsp => {
        this.$router.push({
          path: `clusterrolebindings`
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
