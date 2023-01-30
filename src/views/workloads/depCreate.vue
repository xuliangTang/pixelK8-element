<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置<el-switch
          v-model="tips"
          class="li"
        >
        </el-switch><span class="is-gray li">tips</span></span>
      </div>
      <MetaDataConfig :data.sync="deployment.metadata" :tips="tips" />
      <SpecConfig :data.sync="deployment.spec" :tips="tips" />
    </el-card>
    <div>
      <DeployYaml :deployment="deployment" />
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
import DeployYaml from './depYaml'
import { showDeployment } from '@/api/deployments'

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
    /* UpdateObject(key, value) {
      this.$set(this.deployment, key, value)
    }*/
  }
}
</script>
