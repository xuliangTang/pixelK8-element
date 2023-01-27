<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>metadata设置 </span>
      </div>
      <div>
        <el-form :inline="true">
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
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>标签 <i class="ii el-icon-circle-plus" @click="addLabel" />  </span>
          </div>
          <el-form v-for="(label,index) in metadata._labels" :inline="true" style="margin-top: 10px">
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
function copyObject(obj) {
  const str = JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  data() {
    return {
      metadata: { name: '', namespace: 'default', labels: {}, _labels: [] },
      store: { labels: [] },
      nslist: [] // ns列表
    }
  },
  watch: {
    metadata: {
      handler: function(newVal, oldVal) {
        this.$emit('Update', 'metadata', newVal)
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
      if (this.metadata._labels === undefined) { // 对于编辑数据，此项 没有值，因此要做处理
        this.$set(this.metadata, '_labels', [])
      }
      if (this.metadata.labels === undefined) this.metadata.labels = {}
    },
    addLabel() {
      this.checkProp()
      this.metadata._labels.push({ key: '', value: '' })
    },
    rmLabel(index) {
      this.metadata._labels.splice(index, 1)
      this.parseLabel()
    },
    unParseLabel() {
      // 编辑状态下 需要解析 labels对象 为 _labels数组
      this.checkProp()
      for (const key in this.metadata.labels) {
        this.metadata._labels.push({ key, value: this.metadata.labels[key] })
      }
    },
    parseLabel() {
      // 把_labels数组解析为 label对象
      this.checkProp()
      this.metadata.labels = {} // 清空
      for (let i = 0; i < this.metadata._labels.length; i++) {
        if (this.metadata._labels[i].key === '') continue
        this.metadata.labels[this.metadata._labels[i].key] = this.metadata._labels[i].value
      }
    },
    setObject(v) {
      this.metadata = copyObject(v)
      this.unParseLabel()
    },
    output() {
      return ''
    }
  }

}
</script>
