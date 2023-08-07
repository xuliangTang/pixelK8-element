<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input v-model="name" placeholder="ingress名称" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="namespace" :disabled="isEdit" @change="changeNs">
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
        <span>注解设置</span>
        <span style="margin-left: 30px">
          <el-checkbox v-model="annoComponents.cors">跨域</el-checkbox>
          <el-checkbox v-model="annoComponents.rewrite">重写</el-checkbox>
          <el-checkbox v-model="annoComponents.auth">身份认证</el-checkbox>
          <el-checkbox v-model="annoComponents.rateLimit">限流</el-checkbox>
          <el-checkbox v-model="annoComponents.canary">灰度</el-checkbox>
          <el-checkbox v-model="annoComponents.mirror">流量复制</el-checkbox>
          <el-checkbox v-model="annoComponents.serverSnippet">server-snippet</el-checkbox>
          <el-checkbox v-model="annoComponents.configurationSnippet">configuration-snippet</el-checkbox>
          <el-checkbox v-model="annoComponents.other">其他</el-checkbox>
        </span>
      </div>
      <Cors v-show="annoComponents.cors" ref="cors" :show.sync="annoComponents.cors" @pop="popAnnotation" />
      <Rewrite v-show="annoComponents.rewrite" ref="rewrite" :show.sync="annoComponents.rewrite" @pop="popAnnotation" />
      <BasicAuth v-show="annoComponents.auth" ref="basicAuth" :show.sync="annoComponents.auth" @pop="popAnnotation" />
      <RateLimit v-show="annoComponents.rateLimit" ref="rateLimit" :show.sync="annoComponents.rateLimit" @pop="popAnnotation" />
      <Canary v-show="annoComponents.canary" ref="canary" :show.sync="annoComponents.canary" @pop="popAnnotation" />
      <Mirror v-show="annoComponents.mirror" ref="mirror" :show.sync="annoComponents.mirror" @pop="popAnnotation" />
      <ServerSnippet v-show="annoComponents.serverSnippet" ref="serverSnippet" :show.sync="annoComponents.serverSnippet" @pop="popAnnotation" />
      <ConfigurationSnippet v-show="annoComponents.configurationSnippet" ref="configurationSnippet" :show.sync="annoComponents.configurationSnippet" @pop="popAnnotation" />
      <!--<div v-show="annoComponents.other">
        <el-input
          v-model="annotations"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="格式: key:value;"
        />
      </div>-->
      <el-card v-show="annoComponents.other" class="box-card">
        <div slot="header" class="clearfix">
          <span>其他配置</span>
        </div>
        <div>
          <el-form v-for="(item,itemindex) in orgin_annotations_list" :inline="true" label-width="80px">
            <el-form-item label="key">
              <el-input v-model="item.key" />
            </el-form-item>
            <el-form-item label="value">
              <el-input v-model="item.value" type="textarea" style="width: 600px" />
            </el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-minus" circle @click="rmOrginAnnotation(itemindex)" />
          </el-form>
          <el-button type="primary" icon="el-icon-plus" @click="addOrginAnnotation">添加配置</el-button>
        </div>
      </el-card>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>规则</span>
      </div>
      <el-form v-for="(rule,ruleindex) in rules" v-model="rules">
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

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>TLS设置 <i class="el-icon-circle-plus-outline" style="cursor:pointer" @click="tls.push({hosts:[],secretName:'',hosts_str:''})" /> </span>
      </div>
      <el-form v-for="(tlsitem,tlsindex) in tls" style="border-bottom: dashed 1px #ddd;padding-bottom: 10px">
        <el-form :inline="true">
          <el-form-item label="域名">
            <el-input v-model="tlsitem.hosts_str" placeholder="填写域名，多个请用逗号分隔" style="width: 300px" />
          </el-form-item>
          <el-form-item label="选择密文">
            <el-select v-model="tlsitem.secretName">
              <el-option
                v-for="secret in secretList"
                :label="secret.name"
                :value="secret.name"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="tls.splice(tlsindex,1)">-</el-button>
        </el-form>
      </el-form>
    </el-card>

    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="postNew()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { postIngress, getIngressInfo } from '@/api/ingress'
import { getNsList } from '@/api/namespace'
import { getServiceAll } from '@/api/service'
import { getSecretList } from '@/api/secret'
import Cors from './ingressCors'
import Rewrite from './ingressRewrite'
import BasicAuth from './ingress-auth'
import RateLimit from './ingress-ratelimit'
import ServerSnippet from './ingress-snippet-server.vue'
import ConfigurationSnippet from './ingress-snippet-configuration'
import Canary from './ingress-canary'
import Mirror from './ingress-mirror'
export default {
  components: {
    Cors, Rewrite, BasicAuth, RateLimit, ServerSnippet, ConfigurationSnippet, Canary, Mirror
  },
  data() {
    return {
      isEdit: false,
      name: '',
      namespace: 'default',
      rules: [
        { host: '', paths: [{ path: '/', svc_name: '', port: '80' }] }
      ],
      tls: [
        // {hosts:[],secretName:'',hosts_str:''}
      ],
      nsList: [],
      svcList: [],
      secretList: [],
      annotations: '',
      annoComponents: {
        cors: false, rewrite: false, auth: false, other: false, rateLimit: false, serverSnippet: false, configurationSnippet: false, canary: false, mirror: false
      },
      orgin_annotations: {}, // 编辑状态下原生对象是一个map[string]string
      orgin_annotations_list: [] // 原生对象注解的数组形式 [{key:'',value:''}] 为了方便解析
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nsList = rsp.data.data
    })
    getServiceAll(this.namespace).then(rsp => {
      this.svcList = rsp.data.data
    })
    getSecretList(this.namespace, 1, 100).then(rsp => {
      this.secretList = rsp.data.data.items
    })
    this.ns = this.$route.query.ns
    this.name = this.$route.query.name
    if (this.$route.query.mode === 'edit' && this.ns && this.name) {
      getIngressInfo(this.ns, this.name).then(rsp => {
        this.isEdit = true
        const getIng = rsp.data.data
        this.name = getIng.metadata.name
        this.namespace = getIng.metadata.namespace
        this.parseRules(getIng.spec.rules) // 解析rules
        this.parseTLS(getIng.spec.tls) // 解析tls
        this.orgin_annotations = getIng.metadata.annotations
        this.parseAnnotationsToList() // 把对象解析为数组，方便前端渲染
        for (const comp in this.$refs) {
          this.$refs[comp].setAnnotations(this.orgin_annotations)
        }
      })
    }
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
    // rules原生对象解析为组件对象
    parseRules(rules) {
      this.rules = [] // 先清空
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        const paths = []
        for (let j = 0; j < rule.http.paths.length; j++) {
          paths.push({
            path: rule.http.paths[j].path,
            svc_name: rule.http.paths[j].backend.service.name,
            port: rule.http.paths[j].backend.service.port.number.toString()
          })
        }
        this.rules.push({
          host: rule.host,
          paths
        })
      }
      if (this.rules.length === 0) { // 如果什么都没有，则加入一个默认的
        this.rules.push({ host: '', paths: [{ path: '/', svc_name: '', port: '80' }] })
      }
    },
    parseTLS(tls) {
      if (tls !== undefined && tls !== null) {
        this.tls = tls
      }
      this.tls.forEach(item => {
        item.hosts_str = item.hosts.join(',')
      })
    },
    unParseTLS() {
      // 把hosts_str要解析成数组,用逗号分开
      this.tls.forEach(item => {
        item.hosts = item.hosts_str.split(',')
      })
    },
    // 把原生注解对象解析成数组 方便前端渲染
    parseAnnotationsToList() {
      this.orgin_annotations_list = []
      for (const key in this.orgin_annotations) {
        this.orgin_annotations_list.push({ key, value: this.orgin_annotations[key] })
      }
    },
    // 把数组解析为原生注解对象
    unParseListToAnnotations() {
      this.orgin_annotations = {} // 清空
      this.orgin_annotations_list.forEach(item => {
        this.orgin_annotations[item.key] = item.value
      })
    },
    // 这些key被子组件取走解析掉了
    popAnnotation(key) {
      // 从orgin_annotations_list 删掉被解析过后的注解
      this.orgin_annotations_list.forEach((item, index) => {
        if (item.key === key) {
          this.orgin_annotations_list.splice(index, 1)
        }
      })
    },
    rmOrginAnnotation(index) {
      this.orgin_annotations_list.splice(index, 1)
    },
    addOrginAnnotation() {
      this.orgin_annotations_list.push({ key: '', value: '' })
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
            if (pathindex === pathIndex) {
              rule.paths.splice(pathindex, 1)
            }
          })
        }
      })
    },
    postNew() {
      this.unParseListToAnnotations() // 反解析原始的注解
      this.unParseTLS()
      let annotations = {}
      for (const ref in this.$refs) {
        annotations = Object.assign({}, annotations, this.$refs[ref].output())
      }
      annotations = Object.assign({}, annotations, this.orgin_annotations)

      const data = {
        name: this.name,
        namespace: this.namespace,
        rules: this.rules,
        annotations: annotations,
        tls: this.tls,
        is_update: this.isEdit
      }

      postIngress(data)
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
  }

}

</script>
