<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="Name"/>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="NameSpace">
            <el-option
              v-for="ns in nslist "
              :label="ns.name"
              :value="ns.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <Opaque v-bind:Name="Name" v-bind:NameSpace="NameSpace"/>
  </div>
</template>

<script>
import { getNsList } from '@/api/namespace'
export default {
  data() {
    return {
      Name: '',
      NameSpace: '',
      nslist: []
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
    })
  },
  components: {
    Opaque: () => import('./secretCreateOpaque')
  }
}
</script>
