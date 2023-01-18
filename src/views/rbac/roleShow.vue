<template>
  <div>
    <el-card class="box-card">
      <div class="header">
        <h1>
          <router-link to="roles" class="primary">Role</router-link>
        </h1>
        <h1>: {{ name }}</h1>
        <h1><router-link :to='"role-create?mode=edit&ns=" + ns + "&name=" + name'><el-button size="mini" icon="el-icon-edit" circle /></router-link></h1>
      </div>
      <div class="sub-header">
        <span>命名空间: {{ ns }}</span>
        <span>创建时间: {{ data.created_at }}</span>
      </div>
      <div class="tab-container">
        <el-form v-for="(rule) in rules" :inline="true" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="rule.groupversion"
              filterable
              default-first-option
              placeholder="Api组"
              disabled
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
              disabled
              placeholder="权限"
            >
              <el-option
                v-for="v in rule.verbscopy"
                :label="v"
                :value="v"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>

</template>
<script>
import { showRole } from '@/api/role'
import { getResources } from '@/api/resource'
const defaultVerbs = ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch', 'deletecollection']
export default {
  data() {
    return {
      cmData: [],
      resources:[],
      ns: '',
      name: '',
      rules: [],
      data: {}
    }
  },
  created() {
    this.ns = this.$route.query.ns
    this.name = this.$route.query.name
    if (this.ns && this.name) {
      getResources().then(rsp => {
        this.resources = rsp.data.data
        this.loadDetail()
      })
    }
  },
  methods: {
    loadDetail() {
      showRole(this.ns, this.name).then(rsp => {
        this.data = rsp.data.data
        this.data.rules.forEach(rule => {
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
                const rule_verbs = rule.verbs.filter(function(v) {
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
    }
  }
}
</script>
