<template>
  <div>
    <el-card class="box-card">
      <div class="header">
        <h1>
          <router-link to="nodes" class="primary">节点</router-link>
        </h1>
        <h1>: {{ name }}</h1>
        <h1><router-link :to='"node-edit?name=" + name'><el-button size="mini" icon="el-icon-edit" circle></el-button></router-link></h1>
      </div>
      <div class="sub-header">
        <span>内网 IP: {{ ip }}</span>
        <span>版本: {{ kubeletVersion }}</span>
        <span>操作系统: {{ osImage }}</span>
        <span>创建时间: {{ data.created_at }}</span>
      </div>
      <div class="sub-header">
        <span>标签：<el-tag type="success" v-for="label in labelData"> {{ label.key }}={{ label.value }} </el-tag></span>
      </div>
      <div class="sub-header">
        <span>污点：<el-tag type="danger" v-for="taint in data.taints"> {{ taint.key }}={{ taint.value }}:{{ taint.effect }} </el-tag></span>
      </div>
    </el-card>
  </div>

</template>
<script>
import { showNode } from '@/api/node'
export default {
  data() {
    return {
      name: '',
      ip: '',
      kubeletVersion: '',
      osImage: '',
      labelData: [],
      taintData: [],
      data: {}
    }
  },
  created() {
    this.name = this.$route.query.name
    showNode(this.name).then(rsp => {
      this.data = rsp.data.data
      this.ip = this.data.ip
      this.kubeletVersion = this.data.info.kubeletVersion
      this.osImage = this.data.info.osImage
      for (const key in rsp.data.data.labels) {
        this.labelData.push(
          { key, value: rsp.data.data.labels[key] }
        )
      }
    })
  }
}
</script>
