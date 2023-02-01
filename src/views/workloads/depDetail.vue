<template>
  <div>
    <el-card class="box-card">
      <div class="header">
        <h1>
          <router-link to="deployments" class="primary">Deployment</router-link>
        </h1>
        <h1>: {{ deployment.name }}</h1>
        <h1><router-link :to='"deployment-create?mode=edit&ns=" + deployment.namespace + "&name=" + deployment.name'><el-button size="mini" icon="el-icon-edit" circle></el-button></router-link></h1>
      </div>
      <div class="sub-header">
        <span>命名空间: {{ deployment.namespace }}</span>
        <span>镜像: {{ deployment.images }}</span>
        <span>Ready: {{ deployment.replicas[1] }} / {{ deployment.replicas[0] }}</span>
        <span>创建时间: {{ deployment.created_at }}</span>
      </div>
      <div>
        <el-input-number v-model="deployment.replicas[0]" :min="0" />
      </div>
    </el-card>

    <!-- pods 列表 -->
    <el-card class="box-card">
      <el-tabs v-model="dep_ref">
        <el-tab-pane label="Pods" name="pods">
          <el-table
            v-loading="listLoading"
            :data="podslist"
            element-loading-text="Loading"
            stripe
            fit
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column label="阶段 / 状态">
              <template slot-scope="scope">
                <p>
                  <span>{{ scope.row.phase }}</span> /
                  <span v-html="getStatus(scope.row.is_ready)"></span>
                </p>
                <p class="is-red" v-html="getMessage(scope.row)"></p>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <p>{{ scope.row.name }}</p>
                <p class="is-gray">{{ scope.row.ip[0] }}</p>
              </template>
            </el-table-column>
            <el-table-column label="镜像">
              <template slot-scope="scope">
                <p>{{ scope.row.images }}</p>
              </template>
            </el-table-column>
            <el-table-column label="主机" width="130">
              <template slot-scope="scope">
                <p>{{ scope.row.node_name }}</p>
                <p class="is-gray">{{ scope.row.ip[1] }}</p>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="160">
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
                    <el-dropdown-item><router-link :to='"pod-log?ns=" + scope.row.namespace + "&name=" + scope.row.name'>查看日志</router-link></el-dropdown-item>
                    <el-dropdown-item><router-link :to='"pod-terminal?ns=" + scope.row.namespace + "&name=" + scope.row.name'>进入终端</router-link></el-dropdown-item>
                    <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>

import { deploymentInfo, getDeploymentPods } from '@/api/deployments'
import { deletePod } from '@/api/pod'
export default {
  components: {

  },
  data() {
    return {
      deployment: { replicas: [0, 0, 0] },
      podslist: [],
      listLoading: false,
      dep_ref: 'pods'
    }
  },
  watch: {

  },
  created() {
    if (this.$route.query.ns !== undefined && this.$route.query.name !== undefined) {
      const ns = this.$route.query.ns
      const name = this.$route.query.name
      deploymentInfo(ns, name).then(rsp => {
        this.deployment = rsp.data.data
        // 加载pods列表
        getDeploymentPods(ns, name).then(rsp => {
          this.podslist = rsp.data.data
        })
      })
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        deletePod(command[1].namespace, command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
    getStatus(is_ready) {
      if (is_ready) {
        return 'Active'
      } else {
        return 'Waiting'
      }
    },
    getMessage(row) {
      if (!row.is_ready) {
        return row.message
      }
      return ''
    }
  }

}

</script>
<style>
  .el-card__header{
    padding-top:10px;
    padding-bottom: 10px;
  }
  .el-card__body{padding: 10px}
</style>
