<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input :value="node.name" :disabled="true" placeholder="节点名称" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签 (系统标签请谨慎修改) </span>
        <span><el-button type="" size="mini" icon="el-icon-plus" circle @click="addLabel" /></span>
      </div>
      <template v-for="(item,objindex) in labels">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="item.key" placeholder="标签key" />
          </el-form-item>
          <el-form-item label="=">
            <el-input v-model="item.value" placeholder="标签值" />

          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmLabel(objindex)" />
          </el-form-item>
        </el-form>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>污点 </span>
        <span><el-button type="" size="mini" icon="el-icon-plus" circle @click="addTaint" /></span>
      </div>
      <template v-for="(item,objindex) in taints">
        <el-form :inline="true">
          <el-form-item label="键">
            <el-input v-model="item.key" placeholder="key" />
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="item.value" placeholder="值" />
          </el-form-item>
          <el-form-item label="影响">
            <el-select v-model="item.effect">
              <el-option label="不调度" value="NoSchedule" />
              <el-option label="尽量不调度" value="PreferNoSchedule" />
              <el-option label="不调度+驱逐" value="NoExecute" />
            </el-select>

          </el-form-item>
          <el-form-item>
            <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmTaint(objindex)" />
          </el-form-item>
        </el-form>
      </template>
    </el-card>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="saveNodeData">保存</el-button>
    </div>
  </div>

</template>
<script>
import { showNode, updateNode } from '@/api/node'
export default {
  data() {
    return {
      node: {},
      nodeName: '',
      labels: [],
      taints: []
    }
  },
  mounted() {
    this.nodeName = this.$route.query.name
    if (this.nodeName) {
      showNode(this.nodeName).then(rsp => {
        this.node = rsp.data.data
        for (const key in this.node.labels) {
          this.labels.push({ key: key, value: this.node.labels[key] })
        }
        if (this.node.taints !== null) {
          this.node.taints.forEach(item => {
            this.taints.push({ key: item.key, value: item.value, effect: item.effect })
          })
        }
        this.$forceUpdate()
      })
    }
  },
  methods: {
    addLabel() {
      this.labels.unshift({ key: '', value: '' })
    },
    addTaint() {
      this.taints.unshift({ key: '', value: '', effect: '' })
    },
    rmLabel(objindex) {
      this.labels.forEach((item, itemindex) => {
        if (itemindex === objindex) {
          this.labels.splice(objindex, 1)
        }
      })
    },
    rmTaint(objindex) {
      this.taints.forEach((item, itemindex) => {
        if (itemindex === objindex) {
          this.taints.splice(objindex, 1)
        }
      })
    },
    saveNodeData() {
      const postLabels = {}
      this.labels.forEach(item => {
        postLabels[item.key] = item.value
      })
      const node = { labels: postLabels, taints: this.taints }
      updateNode(this.nodeName, node)
        .then((rsp) => {
          this.$router.push({
            path: `nodes`
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
