<template>
  <div>
    <span v-show="tips" class="is-gray">
      元数据，包含name、namespace、labels(标签)等设置
    </span>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>metadata设置 <Expand :expand.sync="expand" /></span>
      </div>
      <div v-show="expand">
        <el-form v-show="!this.labels" :inline="true">
          <el-form-item label="名称">
            <el-input v-model="metadata.name" placeholder="deployment名称" />
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="metadata.namespace">
              <el-option
                v-for="ns in nslist "
                :label="ns.name"
                :value="ns.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-card class="box-card" v-show="!fastmod">
          <div slot="header" class="clearfix">
            <span>标签 <i class="ii el-icon-circle-plus" @click="addLabel" />  </span>
          </div>
          <el-form v-for="(label,index) in store.labels" :inline="true" style="margin-top: 10px">
            <el-form-item>
              <el-input v-model="label.key" placeholder="填写key" style="width: 250px" @input="parseLabel" />
            </el-form-item>
            <el-form-item>
              -
            </el-form-item>
            <el-form-item>
              <el-input v-model="label.value" placeholder="填写value" style="width: 250px" @input="parseLabel" />
            </el-form-item>
            <el-form-item>
              <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmLabel(index)" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getNsList } from '@/api/namespace'
export default {
  components: {
    Expand: () => import('./cardExpand')
  },
  props: ['data', 'tips', 'labels', 'fastmod'],
  data() {
    return {
      metadata: { name: '', namespace: 'default', labels: {}},
      store: { labels: [] },
      expand: true,
      nslist: [] // ns列表
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.metadata = newVal
        this.unParseLabel()
      },
      deep: true
    },
    metadata: {
      handler: function(newVal, oldVal) {
        if (this.labels) { // 只显示标签
          delete newVal.name
          delete newVal.namespace
        }
        this.$emit('update:data', newVal)
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    getNsList().then(rsp => {
      this.nslist = rsp.data.data
    })
  },
  methods: {
    checkProp() { // 对于一些自定的属性要做初始化检查
      if (this.metadata.labels === undefined) {
        this.metadata.labels = {}
      }
    },
    addLabel() {
      this.checkProp()
      this.store.labels.push({ key: '', value: '' })
    },
    rmLabel(index) {
      this.store.labels.splice(index, 1)
      this.parseLabel()
    },
    unParseLabel() {
      // 编辑状态下 需要解析 labels对象 为 _labels数组
      this.checkProp()
      this.store.labels = []
      for (const key in this.metadata.labels) {
        this.store.labels.push({ key, value: this.metadata.labels[key] })
      }
    },
    parseLabel() {
      // 把_labels数组解析为 label对象
      this.checkProp()
      this.metadata.labels = {} // 清空
      for (let i = 0; i < this.store.labels.length; i++) {
        if (this.store.labels[i].key === '') continue
        this.metadata.labels[this.store.labels[i].key] = this.store.labels[i].value
      }
    },
    output() {
      return ''
    }
  }

}
</script>
