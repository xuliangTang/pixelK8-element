<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置
          <el-switch
            v-model="tips"
            class="li"
          /><span class="is-gray li">tips</span></span>
        <el-switch
          v-model="fastmod"
          style="margin-left: 50px"
          active-text="快捷模式"
          inactive-text="详细模式"
        />
      </div>
      <MetaDataConfig :fastmod="fastmod" :data.sync="deployment.metadata" :tips="tips" />
      <SpecConfig :fastmod="fastmod" :data.sync="deployment.spec" :tips="tips" />
    </el-card>
    <div>
      <DeployYaml :deployment="deployment" />
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="postDeploy">保存</el-button>
    </div>
  </div>
</template>
<script>
import DeployYaml from './depYaml'
import { showDeployment, createDeployment, updateDeployment } from '@/api/deployments'
import { clearEmptyObject } from '@/utils/helper'

export default {
  components: {
    DeployYaml,
    MetaDataConfig: () => import('./depMetadata'),
    SpecConfig: () => import('./depSpecdata')
  },
  data() {
    return {
      deployment: { apiVersion: 'apps/v1', Kind: 'Deployment', metadata: {}, spec: {}},
      tips: false,
      isUpdate: false,
      fastmod: false,
      ns: '',
      name: ''
    }
  },
  created() {
    this.ns = this.$route.query.ns
    this.name = this.$route.query.name
    if (this.$route.query.mode === 'edit' && this.ns && this.name) {
      showDeployment(this.ns, this.name).then(rsp => {
        const rspData = rsp.data.data
        if (rspData.metadata.labels === undefined) {
          rspData.metadata.labels = {}
        }

        this.deployment = rspData
        this.isUpdate = true

        /* this.$refs.metaData.setObject(this.deployment.metadata)
        this.$refs.specData.setObject(this.deployment.spec)*/
      })
    }
  },
  methods: {
    postDeploy() {
      if (this.isUpdate) {
        updateDeployment(this.ns, clearEmptyObject(this.deployment)).then(rsp => {
          this.$router.push({
            path: `deployments`
          })
        }).catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.error)
          } else {
            this.$message.error(error.message)
          }
        })
      } else {
        createDeployment(clearEmptyObject(this.deployment), this.fastmod).then(rsp => {
          this.$router.push({
            path: `deployments`
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
    /* UpdateObject(key, value) {
      this.$set(this.deployment, key, value)
    }*/
  }
}
</script>
