<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>TLS凭据类型</span>
      </div>
      <div>
        <el-form label-width="80px">
          <el-form-item label="私钥Key">
            <el-input v-model="kvs[0].key" style="width:200px" />
          </el-form-item>
          <el-form-item label="私钥内容">
            <el-input v-model="kvs[0].value" placeholder="粘贴私钥，一般以-----BEGIN RSA PRIVATE KEY-----开头" type="textarea" :autosize="{ minRows: 2}" />
            <p>
              <a href="javascript:" class="file">从文件导入
                <input ref="filekey" type="file" accept=".txt,.pem,.key,.pkey" @change="()=>fileChange('filekey')" />
              </a>
            </p>
          </el-form-item>

          <el-form-item label="证书key">
            <el-input v-model="kvs[1].key" style="width:200px" />
          </el-form-item>
          <el-form-item label="证书内容">
            <el-input v-model="kvs[1].value" placeholder="粘贴证书，一般以-----BEGIN CERTIFICATE-----开头" type="textarea" :autosize="{ minRows: 2}" />
            <p>
              <a href="javascript:" class="file">从文件导入
                <input ref="filecrt" type="file" accept=".txt,.pem,.crt,.cert" @change="()=>fileChange('filecrt')" />
              </a>
            </p>
          </el-form-item>

        </el-form>

        <el-button type="primary" icon="el-icon-success" @click="Save">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { createSecret } from '@/api/secret'
export default {
  props: ['Name', 'NameSpace', 'isEdit', 'editData'],
  data() {
    return {
      kvs: [
        { key: 'tls.key', value: '' },
        { key: 'tls.crt', value: '' }
      ]
    }
  },
  mounted() {
    if (this.isEdit && Object.keys(this.editData).length === 2) {
      this.kvs = []
      for (const key in this.editData) {
        this.kvs.push(
          { key: key, value: decodeURIComponent(atob(this.editData[key])) }
        )
      }
    }
  },
  methods: {
    fileChange(fileName) {
      if (this.$refs[fileName].value !== '') {
        const reader = new FileReader()
        reader.readAsText(this.$refs[fileName].files[0], 'UTF-8')
        reader.onload = (e) => {
          if (fileName === 'filekey') { // 私钥
            this.kvs[0].value = e.target.result
          } else {
            this.kvs[1].value = e.target.result
          }
        }
      }
    },
    Save() {
      const postData = {}
      this.kvs.forEach((item) => {
        postData[item.key] = item.value
      })

      const postModel = {
        name: this.$props.Name,
        namespace: this.$props.NameSpace,
        type: 'kubernetes.io/tls',
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
<style>
  .file {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
  }
  .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }
</style>
