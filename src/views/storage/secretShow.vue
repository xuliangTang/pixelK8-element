<template>
  <div>
    <el-card class="box-card">
      <div class="header">
        <h1>
          <router-link to="secrets" class="primary">密文</router-link>
        </h1>
        <h1>: {{ name }}</h1>
      </div>
      <div class="sub-header">
        <span>类型：{{ data.type[1] }} ({{ data.type[0] }})</span>
        <span>命名空间: {{ ns }}</span>
        <span>创建时间: {{ data.created_at }}</span>
      </div>
      <div class="tab-container">
        <el-form v-for="item in secretData">
          <el-form-item :label="item.key">
            <el-input type="textarea" autosize :value="item.value" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

</template>
<script>
import { showSecret } from '@/api/secret'
export default {
  data() {
    return {
      secretData: [],
      ns: '',
      name: '',
      data: {}
    }
  },
  created() {
    this.ns = this.$route.query.ns
    this.name = this.$route.query.name
    showSecret(this.ns, this.name).then(rsp => {
      this.data = rsp.data.data
      for (const key in rsp.data.data.data) {
        this.secretData.push(
          { key, value: decodeURIComponent(atob(rsp.data.data.data[key])) }
        )
      }
    })
    console.log(this.secretData)
  }
}
</script>
