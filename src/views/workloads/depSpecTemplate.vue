<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>POD模板 <Expand :expand.sync="expand" />  </span>
      </div>
      <div v-show="expand">
        <el-form>
          <el-form-item v-show="!fastmod">
            <MetaData labels="true" :data.sync="template.metadata" :tips="tips" />
          </el-form-item>
          <el-form-item v-show="!fastmod">
            <span v-show="tips" class="is-gray">Init 容器是一种特殊容器，在 Pod 内的应用容器启动之前运行</span>
            <Container defaultname="init" title="Init容器" :data.sync="template.spec.initContainers" :tips="tips" />
          </el-form-item>
          <el-form-item>
            <Container :fastmod="fastmod" defaultname="container" title="业务容器" :data.sync="template.spec.containers" :tips="tips" />
          </el-form-item>
          <el-form-item v-show="!fastmod">
            <span v-show="tips" class="is-gray">调度设置，包含了节点名称、节点标签选择、节点亲和性等</span>
            <Scheduler :nodeName.sync="template.spec.nodeName" :tips="tips" :nodeSelector.sync="template.spec.nodeSelector" />
          </el-form-item>
        </el-form>
      </div>

    </el-card>
  </div>
</template>
<script>
export default {
  components: {
    Expand: () => import('./cardExpand.vue'),
    MetaData: () => import('./depMetadata.vue'),
    Container: () => import('./depSpecTemplateContainer.vue'),
    Scheduler: () => import('./depSpecTemplateScheduler.vue')
  },
  props: ['data', 'tips', 'fastmod'],
  data() {
    return {
      template: { metadata: {}, spec: { containers: [] }},
      expand: true
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.template = newVal
      },
      deep: true
    },
    template: {
      handler: function(newVal, oldVal) {
        this.$emit('update:data', newVal)
      },
      deep: true
    }
  },
  created() {

  },
  methods: {

  }

}
</script>
