<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>容器配置
          <i class="ii el-icon-circle-plus" @click="containers.push({name:'',image:'',ports:[]})" />
          <Expand class="li" :expand.sync="expand" />
        </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form>
            <el-form-item>
              <el-form v-for="(item,cindex) in containers" style="margin-bottom: 20px" :inline="true">
                <el-form-item label="容器名">
                  <el-input v-model="item.name" />
                </el-form-item>
                <el-form-item label="镜像">
                  <el-input v-model="item.image" placeholder="如nginx:1.18-alpine" />
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="containers.splice(cindex,1)" />
                </el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  components: {
    Expand: () => import('./cardExpand.vue'),
    MetaData: () => import('./depMetadata.vue')
  },
  props: ['data', 'tips'],
  data() {
    return {
      containers: [{ name: '', image: '', ports: [] }], //
      expand: true
    }
  },
  watch: {
    containers: {
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
