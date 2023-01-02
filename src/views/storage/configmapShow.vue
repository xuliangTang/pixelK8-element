<template>
  <div>
    <el-card class="box-card">
      <div class="header">
        <h1>
          <router-link to="configmaps" class="primary">配置映射</router-link>
        </h1>
        <h1>: {{ name }}</h1>
      </div>
      <div class="sub-header">
        <span>命名空间: {{ ns }}</span>
        <span>创建时间: {{ data.created_at }}</span>
      </div>
      <div class="tab-container">
        <el-form v-for="item in cmData">
          <el-form-item :label="item.key">
            <el-input type="textarea" autosize :value="item.value" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

</template>
<script>
import { showConfigmap } from '@/api/configmap'
export default {
  data() {
    return {
      cmData: [],
      ns: '',
      name: '',
      data: {}
    }
  },
  created() {
    this.ns = this.$route.query.ns
    this.name = this.$route.query.name
    showConfigmap(this.ns, this.name).then(rsp => {
      this.data = rsp.data.data
      for (const key in rsp.data.data.data) {
        this.cmData.push(
          { key, value: rsp.data.data.data[key] }
        )
      }
    })
  }
}
</script>
