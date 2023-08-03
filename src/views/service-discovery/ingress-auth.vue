<template>
  <div>
    <el-form :model="authConfig" label-width="80px">
      <el-form-item label="启用">
        <el-switch v-model="authConfig.auth_enable" />
      </el-form-item>
      <el-form-item label="选择类型">
        <el-select v-model="authConfig.auth_type">
          <el-option label="basic认证" value="basic" />
        </el-select>
      </el-form-item>
      <el-form-item label="密文类型">
        <el-select v-model="authConfig.auth_secret_type">
          <el-option label="auth-file" value="auth-file" />
          <el-option label="auth-map" value="auth-map" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择密文">
        <el-select v-model="authConfig.auth_secret">
          <el-option
            v-for="secret in secretList"
            :label="secret.name"
            :value="secret.name"
          />
        </el-select>
        <span><el-link type="primary" @click="showFastAuth=!showFastAuth">快捷创建</el-link></span>
      </el-form-item>
    </el-form>
    <el-card v-show="showFastAuth" class="box-card">
      <div slot="header" class="clearfix">
        <span>快捷生成用户名和密码</span>
      </div>
      <el-form :inline="true" :model="genAuth" label-width="80px">
        <el-form-item label="密文名称">
          <el-input v-model="genAuth.secret_name" style="width: 100px" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="genAuth.user_name" style="width: 100px" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="genAuth.user_pass" style="width: 100px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fastGenAuth">保存</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>
<script>
import { getSecretList } from '@/api/secret'
import { genAuthFile } from '@/api/ingress'

export default {
  props: {
    ns: {
      type: String,
      default() {
        return 'default'
      }
    }
  },
  data() {
    return {
      show: false,
      secretList: [],
      authConfig: {
        auth_enable: false,
        auth_type: 'basic',
        auth_secret: '',
        auth_secret_type: 'auth-file'
      },
      showFastAuth: false,
      genAuth: {
        ns: '',
        secret_name: '', // 密文名称
        user_name: '', // 用户名
        user_pass: '', // 用户密码
        auth_type: 'auth-file'
      }
    }
  },
  watch: {
    ns(val, oldVal) {
      getSecretList(this.$props.ns, 1, 100).then(rsp => {
        this.secretList = rsp.data.data.items
      })
    }
  },
  created() {
    getSecretList(this.$props.ns, 1, 100).then(rsp => {
      this.secretList = rsp.data.data.items
    })
  },

  methods: {
    // 快捷生成basic认证密文
    fastGenAuth() {
      this.genAuth.ns = this.$props.ns
      this.genAuth.auth_type = this.authConfig.auth_secret_type
      genAuthFile(this.genAuth).then(rsp => {
        window.setTimeout(() => {
          getSecretList(this.$props.ns, 1, 100).then(rsp => {
            this.secretList = rsp.data.data.items
            this.$notify({
              title: '提醒',
              message: '密文创建成功',
              type: 'success'
            })
            this.genAuth.sname = ''
            this.genAuth.uname = ''
            this.genAuth.upwd = ''
          })
        }, 1000)
      }).catch((error) => {
        this.$message.error(error.response.data.error)
      })
    },
    output() {
      const prefix = 'nginx.ingress.kubernetes.io'
      let result = ''

      if (this.authConfig.auth_enable) {
        for (const key in this.authConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.authConfig[key] !== '') {
            result += prefix + '/' + newKey + ':' + this.authConfig[key] + ';'
          }
        }
        return result
      }

      return ''
    }
  }
}
</script>
