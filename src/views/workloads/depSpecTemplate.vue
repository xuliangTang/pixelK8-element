<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>POD模板 <Expand :expand.sync="expand" />  </span>
      </div>
      <div v-show="expand">
        <MetaData v-show="!fastmod" labels="true" :data.sync="template.metadata" :tips="tips" />
        <Container v-show="!fastmod" defaultname="init" title="Init容器" :data.sync="template.spec.initContainers" :tips="tips" />
        <Container :fastmod="fastmod" defaultname="container" title="业务容器" :data.sync="template.spec.containers" :tips="tips" />
      </div>

    </el-card>
  </div>
</template>
<script>
export default {
  components: {
    Expand: () => import('./cardExpand.vue'),
    MetaData: () => import('./depMetadata.vue'),
    Container: () => import('./depSpecTemplateContainer.vue')
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
