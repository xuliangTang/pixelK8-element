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
        <!--<el-upload multiple class="upload" action="" :on-change="fileChange" ref="files"><el-button icon="el-icon-tickets">从文件读取</el-button></el-upload>-->
        <el-button icon="el-icon-tickets" onclick="document.formInput.files.click()">从文件读取</el-button>
        <el-button type="primary" icon="el-icon-success" @click="Save">保存</el-button>
        <form name="formInput" style="display:none">
          <input
            id="files"
            ref="files"
            type="file"
            multiple
            @change="fileChange"
          >
        </form>
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
    fileChange() {
      const files = this.$refs['files'].files
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader()
          reader.readAsText(files[i], 'UTF-8')
          reader.filename = files[i].name
          reader.onload = (e) => {
            if (this.kvs.length === 1 && this.kvs[0].key === '') {
              this.kvs[0].key = e.target.filename
              this.kvs[0].value = e.target.result
            } else {
              this.kvs.push(
                { key: e.target.filename, value: e.target.result }
              )
            }
          }
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
