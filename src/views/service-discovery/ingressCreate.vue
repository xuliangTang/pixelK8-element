<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="name" placeholder="ingress名称" />
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select @change="changeNs" v-model="namespace">
            <el-option
              v-for="ns in nsList"
              :label="ns.name"
              :value="ns.name"
            />
          </el-select>
        </el-form-item>

      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签设置</span>
      </div>
      <el-collapse>
        <el-collapse-item title="跨域设置" name="1">
          <Cors ref="cors"></Cors>
        </el-collapse-item>
        <el-collapse-item title="自定义" name="2">
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="格式: key:value;"
              v-model="annotations">
            </el-input>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>规则</span>
      </div>
      <el-form v-model="rules" v-for="(rule,ruleindex) in rules">
        <el-form :inline="true">
          <el-form-item label="域名">
            <el-input v-model="rule.host" placeholder="填写域名" />
          </el-form-item>
          <el-button type="primary" @click="addPathCfg(ruleindex)">+</el-button>
        </el-form>
        <template v-for="(pathcfg,pathindex) in rule.paths">
          <el-form :inline="true">
            <el-form-item label="Path">
              <el-input v-model="pathcfg.path" placeholder="Path" />
            </el-form-item>
            <el-form-item label="服务名">
              <el-select v-model="pathcfg.svc_name">
                <el-option
                  v-for="svc in svcList"
                  :label="svc.name"
                  :value="svc.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="端口">
              <el-input v-model="pathcfg.port" placeholder="填写服务端口" />
            </el-form-item>
            <el-form-item>
              <el-button v-show="pathindex>0" type="primary" @click="rmPathCfg(ruleindex,pathindex)">-</el-button>
            </el-form-item>
          </el-form>
        </template>

      </el-form>

    </el-card>

    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="postNew()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { createIngress } from '@/api/ingress'
import { getNsList } from '@/api/namespace'
import { getServiceAll } from '@/api/service'
import Cors from './ingressCors'
export default {
  data() {
    return {
      name: '',
      namespace: '',
      rules: [
        { host: '', paths: [{ path: '/', svc_name: '', port: '80' }] }
      ],
      nsList: [],
      svcList: [],
      annotations: ''
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nsList = rsp.data.data
    })
  },
  methods: {
    // 清空选中的svc
    clearSelectSvc() {
      this.rules.forEach(rule => {
        rule.paths.forEach(cfg => {
          cfg.svc_name = ''
        })
      })
    },
    changeNs(ns) {
      this.clearSelectSvc()
      getServiceAll(ns).then(rsp => {
        this.svcList = rsp.data.data
      })
    },
    // 新增path 配置
    addPathCfg(index) {
      this.rules.forEach((rule, ruleIndex) => {
        if (ruleIndex === index) {
          rule.paths.push({ path: '/', svc_name: '', port: '80' })
        }
      })
    },
    // 删除path 配置
    rmPathCfg(ruleIndex, pathIndex) {
      this.rules.forEach((rule, ruleindex) => {
        if (ruleindex === ruleIndex) {
          rule.paths.forEach((path, pathindex) => {
            if (pathindex === pathIndex){
              rule.paths.splice(pathindex, 1)
            }
          })
        }
      })
    },
    postNew() {
      const annotations = this.annotations + this.$refs.cors.output()
      const data = {
        name: this.name,
        namespace: this.namespace,
        rules: this.rules,
        annotations: annotations
      }
      createIngress(data)
        .then((rsp) => {
          this.$router.push({
            path: `ingress`
          })
        }).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
    }
  },
  components: {
    Cors
  }

}

</script>
