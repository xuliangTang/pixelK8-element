<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="Name" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="NameSpace" :disabled="isEdit">
            <el-option
              v-for="ns in nslist "
              :label="ns.name"
              :value="ns.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <Component :is="currentCom" :name="Name" :name-space="NameSpace"/>
  </div>
</template>

<script>
import { getNsList } from '@/api/namespace'
export default {
  components: {
    Literal: () => import('./configmapCreateLiteral')
  },
  data() {
    return {
      Name: '',
      NameSpace: '',
      nslist: [],
      currentCom: 'Literal',
      isEdit: false
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
    })
  },
  methods: {
    childSet(ns, name) {
      this.NameSpace = ns
      this.Name = name
      this.isEdit = true
    }
  }
}
</script>
