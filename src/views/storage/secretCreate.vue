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
        <el-form-item label="类型">
          <el-select v-model="currentCom" :disabled="isEdit">
            <el-option
              v-for="com in comList "
              :label="com.name"
              :value="com.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <Component :is="currentCom" :ref="currentCom" :name="Name" :name-space="NameSpace" :is-edit="isEdit" :edit-data="editData"></Component>
  </div>
</template>

<script>
import { getNsList } from '@/api/namespace'
import { showSecret } from '@/api/secret'

export default {
  components: {
    Opaque: () => import('./secretCreateOpaque'),
    TLS: () => import('./secretCreateTls')
  },
  data() {
    return {
      Name: '',
      NameSpace: '',
      nslist: [],
      comList: [
        { name: '自定义 (Opaque)', value: 'Opaque' },
        { name: 'TLS凭据', value: 'TLS' }
      ],
      currentCom: 'Opaque',
      isEdit: false,
      comMap: {
        'kubernetes.io/tls': 'TLS',
        'Opaque': 'Opaque'
      },
      editData: {}
    }
  },
  created() {
    if (this.$route.query.mode === 'edit') {
      this.Name = this.$route.query.name
      this.NameSpace = this.$route.query.ns
      if (this.NameSpace && this.Name) {
        showSecret(this.NameSpace, this.Name).then(rsp => {
          if (rsp.data.data.name !== '' && this.comMap[rsp.data.data.type[0]] !== undefined) {
            this.currentCom = this.comMap[rsp.data.data.type[0]]
            this.isEdit = true
            this.editData = rsp.data.data.data
            // 默认的子组件会先于这一步执行，手动更新属性
            if (this.$refs[this.currentCom] !== undefined) {
              this.$refs[this.currentCom].updateEdit(this.isEdit, this.editData)
            }
          }
        })
      }
    }

    getNsList().then(rsp => {
      this.nslist = rsp.data.data
    })
  }
}
</script>
