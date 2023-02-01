<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>调度设置 <Expand :expand.sync="expand" />  </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form :inline="true ">
            <el-form-item label="节点名称">
              <el-input v-model="getNodeName" />
              <span v-show="tips" class="is-gray">强制设置节点名称，属于强制匹配，跳过调度逻辑</span>
            </el-form-item>
            <el-form-item label="节点选择器" style="width: 100%">
              <NodeSelector ref="nodeSelector" :data.sync="getNodeSelector" />
              <span v-show="tips" class="is-gray">设置后会调度拥有这些标签的节点上</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { trim, isEmptyObject } from '@/utils/helper'
export default {
  components: {
    Expand: () => import('./cardExpand.vue'),
    NodeSelector: () => import('@/components/Common/MapMatch.vue')
  },
  props: ['nodeName', 'tips', 'nodeSelector'],
  data() {
    return {
      getNodeName: '',
      getNodeSelector: [],
      expand: false
    }
  },
  watch: {
    nodeName: function(n, o) {
      this.getNodeName = n
      if (n !== '') {
        this.expand = true
      }
    },
    nodeSelector: {
      handler: function(newVal, oldVal) {
        this.getNodeSelector = newVal
        if (!isEmptyObject(newVal)) {
          // this.$refs.nodeSelector.setData(newVal)
          this.expand = true
        }
      },
      deep: true
    },
    getNodeName: {
      handler: function(newVal, oldVal) {
        if (trim(newVal) === '') {
          this.$emit('update:nodeName', null) // null值的属性，保存时会自动清理
        } else {
          this.$emit('update:nodeName', newVal)
        }
      },
      deep: true
    },
    getNodeSelector: {
      handler: function(newVal, oldVal) {
        this.$emit('update:nodeSelector', newVal)
      },
      deep: true
    }
  },
  created() {

  },
  methods: {
    initData() {
      this.getNodeName = this.nodeName
      this.getNodeSelector = this.nodeSelector
    }
  }
}
</script>
