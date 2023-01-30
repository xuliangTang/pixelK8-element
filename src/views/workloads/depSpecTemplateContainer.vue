<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ title }}
          <i class="ii el-icon-circle-plus" @click="containers.push({name:getDefaultName(1),image:'',ports:[]})" />
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
                <el-form-item label="端口设置" style="width: 100%">
                  <el-form-item>
                    <i
                      class="ii el-icon-circle-plus"
                      @click="containers[cindex].ports.push({name:getDefaultName(2, cindex),containerPort:80})"
                    />
                  </el-form-item>
                  <el-form v-for="(port,portindex) in item.ports">
                    <el-form-item label="名称">
                      <el-input v-model="port.name" />
                    </el-form-item>
                    <el-form-item label="容器端口">
                      <el-input-number v-model="port.containerPort" />
                      <span v-show="tips">一般填程序监听的端口</span>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="item.ports.splice(portindex,1)" />
                    </el-form-item>
                  </el-form>
                </el-form-item>

                <el-form-item label="入口(command)" style="width: 100%;margin-top: 20px">
                  <el-form label="入口(command)">
                    <ArrayInput split=" " :data.sync="item.command" input_width="400px" />
                  </el-form>
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
import ArrayInput from '@/components/Common/ArrayInput.vue'

export default {
  components: {
    ArrayInput,
    Expand: () => import('./cardExpand.vue')
  },
  props: ['data', 'tips', 'title', 'defaultname'],
  data() {
    return {
      containers: [], // { name: '', image: '', ports: [] }
      expand: true
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.containers = newVal
      },
      deep: true
    },
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
    getDefaultName(t, cindex) {
      if (t === 1) { // 代表是容器 ,这不考虑cindex
        return this.defaultname + this.containers.length
      } else {
        return this.defaultname + 'port' + this.containers[cindex].ports.length
      }
    }
  }
}
</script>
