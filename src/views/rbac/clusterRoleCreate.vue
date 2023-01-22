<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="Name" :disabled="isEdit" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资源授权</span>
        <p class="is-gray">提示:对于group是*的，格式为 *:pods 这种形式</p>
        <el-form v-for="(rule,ruleindex) in rules" :inline="true" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="rule.groupversion"
              filterable
              allow-create
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
              filterable
              allow-create
              placeholder="权限"
            >
              <el-option
                v-for="v in rule.verbscopy"
                :label="v"
                :value="v"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmRule(ruleindex)" />
          </el-form-item>
        </el-form>

      </div>

      <el-button type="primary" icon="el-icon-plus" @click="addRole">添加配置</el-button>
      <el-button type="primary" @click="saveRole">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getResources } from '@/api/resource'
import { createClusterRole, showClusterRole, updateClusterRole } from '@/api/clusterRole'
const defaultVerbs = ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch', 'deletecollection']

export default {
  data() {
    return {
      isEdit: false,
      Name: '',
      rules: [ // 前端所使用的rule
        // { groupversion: '', verbs: [], verbscopy: [] }
      ],
      // 提交用的
      postRules: [],
      resources: [] // 从后端请求 /resources 得到所有group和资源列表
    }
  },
  created() {
    if (this.$route.query.mode === 'edit') {
      this.Name = this.$route.query.name
      if (this.Name) {
        this.isEdit = true
        getResources().then(rsp => {
          this.resources = rsp.data.data
          this.loadDetail()
        })
      }
    }
    getResources().then(rsp => {
      this.resources = rsp.data.data
    })
  },
  methods: {
    loadDetail() {
      showClusterRole(this.Name).then(rsp => {
        rsp.data.data.rules.forEach(rule => {
          if (rule.apiGroups !== undefined) {
            rule.apiGroups.forEach(group => {
              // 每一个group要去 this.resources 中遍历，得到对应的verbs, 防止前端创建时乱填
              rule.resources.forEach((res) => {
                if (group === '*') { // 如果是 *  代表全部，这不作处理 直接加
                  this.rules.push({
                    groupversion: '*:' + res,
                    verbs: rule.verbs,
                    verbscopy: defaultVerbs // 使用默认的全部权限列表
                  })
                  return
                }

                const getVerbs = this.getVerbsByGroupResource(group, res)
                if (getVerbs.length > 0) {
                  // 取到的verbs 要和资源本身的verbs进行求交集，防止创建时瞎写
                  const rule_verbs = rule.verbs.filter(function (v) {
                    return getVerbs.indexOf(v) !== -1
                  })
                  group = group === '' ? 'core' : group
                  this.rules.push({
                    groupversion: group + ':' + res,
                    verbs: rule_verbs,
                    verbscopy: getVerbs // 存到复制品种
                  })
                }
              })
            })
          }
        })
      })
    },
    // 根据group和resource名称，寻找verbs。如果找不到则跳过
    getVerbsByGroupResource(group, resource) {
      group = group.replace(/^\s+|\s+$/gm, '')
      group = (group === '' ? 'core' : group) // 这是我们故意把空字符显示为core .防止界面显示很奇怪
      let verbs = []
      this.resources.forEach(item => {
        if (item.group === group) {
          item.resources.forEach((res) => {
            if (res.name === resource) {
              verbs = res.verbs
            }
          })
        }
      })

      return verbs
    },
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
      const postData = { metadata: { name: this.Name }, rules: this.postRules }
      if (this.isEdit) {
        updateClusterRole(this.Name, postData).then(rsp => {
          this.$router.push({
            path: `cluster-roles`
          })
        }).catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.error)
          } else {
            this.$message.error(error.message)
          }
        })
      } else {
        createClusterRole(postData).then(rsp => {
          this.$router.push({
            path: `cluster-roles`
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
}
</script>
