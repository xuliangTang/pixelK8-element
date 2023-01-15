<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="Name" />
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资源授权</span>
        <el-form v-for="(rule,ruleindex) in rules" :inline="true" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="rule.groupversion"
              filterable
              default-first-option
              placeholder="Api组"
              @change="(v)=>selectChanged(v,ruleindex)"
            >
              <el-option-group
                v-for="(group,index) in resources"
                :key="group.group+index"
                :label="group.group"
                :value="group.group"
              >
                <el-option
                  v-for="item in group.resources"
                  :key="item.name+index"
                  :label="item.name"
                  :value="group.group+':'+item.name"
                />
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select
              v-model="rule.verbs"
              style="width: 600px"
              multiple
              placeholder="权限"
            >
              <el-option
                v-for="v in rule.verbscopy"
                :label="v"
                :value="v"
              />
            </el-select>
          </el-form-item>

          <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmRule(ruleindex)" />
        </el-form>

      </div>

      <el-button type="primary" icon="el-icon-plus" @click="addRole">添加配置</el-button>
      <el-button type="primary" @click="saveRole">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getNsList } from '@/api/namespace'
import { getResources } from '@/api/resource'
import { createRole } from '@/api/role'

export default {
  data() {
    return {
      Name: '',
      NameSpace: '',
      nslist: [],
      rules: [ // 前端所使用的rule
        { groupversion: '', verbs: [], verbscopy: [] }
      ],
      // 提交用的
      postRules: [],
      resources: [] // 从后端请求 /resources 得到所有group和资源列表
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
    })
    getResources().then(rsp => {
      this.resources = rsp.data.data
    })
  },
  methods: {
    addRole() {
      this.rules.unshift({ groupversion: '', verbs: [] })
    },
    selectChanged(v, index) {
      // v包含了group和resource name, 需要拆开, 然后去resource对象中寻找verbs
      const gv = v.split(':')
      let verbs = []
      this.resources.forEach((item) => {
        if (item.group === gv[0]) {
          item.resources.forEach((res) => {
            if (res.name === gv[1]) {
              verbs = res.verbs
            }
          })
        }
      })

      this.rules[index].verbs = []
      this.rules[index].verbscopy = verbs
    },
    rmRule(index) {
      this.rules.splice(index, 1)
    },
    // 拼接
    concatRules() {
      // 合并成这样: {apiGroups:[],resources:[],verbs:[]}
      this.postRules = []
      this.rules.forEach((rule) => {
        // 切割第一段group 第二段 resourcename，如果碰到是core ，则就是空字符串
        const gv = rule.groupversion.split(':')
        let g = gv[0]
        const v = gv[1]
        if (g === 'core') {
          g = ''
        }
        this.postRules.push({ apiGroups: [g], resources: [v], verbs: rule.verbs })
      })
    },
    saveRole() {
      this.concatRules()
      const postData = { metadata: { name: this.Name, namespace: this.NameSpace }, rules: this.postRules }
      createRole(postData).then(rsp => {
        this.$router.push({
          path: `roles`
        })
      }).catch((error) => {
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
