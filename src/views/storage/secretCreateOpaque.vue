<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自定义类型 (Opaque)</span>
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
        <el-button type="primary" icon="el-icon-plus" @click="addKV">添加密文</el-button>
        <el-button type="primary" icon="el-icon-success" @click="Save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { createSecret } from '@/api/secret'
export default {
  props: ['Name', 'NameSpace'],
  data() {
    return {
      kvs: [
        { key: '', value: '' }
      ],
      isEdit: false,
      editData: {}
    }
  },
  methods: {
    updateEdit(isEdit, editData) {
      this.isEdit = isEdit
      this.editData = editData
      if (this.isEdit && Object.keys(this.editData).length > 0) {
        this.kvs = []
        for (const key in this.editData) {
          this.kvs.push(
            { key: key, value: decodeURIComponent(atob(this.editData[key])) }
          )
        }
      }
    },
    addKV() {
      this.kvs.push({ key: '', value: '' })
    },
    rmKV(index) {
      this.kvs.splice(index, 1)
    },
    Save() {
      // 把kv数组整合成一个大对象
      const postData = {}
      this.kvs.forEach((item) => {
        postData[item.key] = item.value // 给对象赋值(key,value)
      })

      const postModel = {
        name: this.$props.Name,
        nameSpace: this.$props.NameSpace,
        type: 'Opaque',
        data: postData,
        is_edit: this.isEdit
      }

      createSecret(postModel)
        .then(rsp => {
          this.$router.push({
            path: `secrets`
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
