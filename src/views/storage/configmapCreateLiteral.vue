<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据</span>
      </div>
      <div>
        <el-form v-for="(item,itemindex) in kvs" label-width="80px">
          <el-form-item label="key">
            <el-input v-model="item.key" />
          </el-form-item>
          <el-form-item label="value">
            <el-input v-model="item.value" type="textarea" :autosize="{ minRows: 2}" />
          </el-form-item>
          <el-form-item>
            <el-button v-show="itemindex>0" type="primary" size="mini" icon="el-icon-minus" circle @click="rmKV(itemindex)" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addKV">添加配置</el-button>
        <el-button type="primary" icon="el-icon-success" @click="Save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { createConfigmap, showConfigmap } from '@/api/configmap'
export default {
  props: ['Name', 'NameSpace'],
  data() {
    return {
      kvs: [
        { key: '', value: '' }
      ],
      isEdit: false
    }
  },
  created() {
    if (this.$route.query.mode === 'edit') {
      const { ns, name } = this.$route.query
      if (ns && name) {
        showConfigmap(ns, name).then(rsp => {
          if (rsp.data.data.name !== '') {
            this.isEdit = true
            this.$parent.childSet(ns, name)
            this.kvs = []
            for (const key in rsp.data.data.data) {
              this.kvs.push({
                key, value: rsp.data.data.data[key]
              })
            }
          }
        })
      }
    }
  },
  methods: {
    addKV() {
      this.kvs.push({ key: '', value: '' })
    },
    rmKV(index) {
      this.kvs.splice(index, 1)
    },
    Save() {
      const postData = {}
      this.kvs.forEach((item) => {
        postData[item.key] = item.value
      })

      const postModel = {
        name: this.$props.Name,
        namespace: this.$props.NameSpace,
        data: postData,
        is_edit: this.isEdit
      }

      createConfigmap(postModel)
        .then(rsp => {
          this.$router.push({
            path: `configmaps`
          })
        })
        .catch((error) => {
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
