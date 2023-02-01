<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>标签选择器(matchExpressions) <i class="ii el-icon-circle-plus" @click="addEmptyObject" /> </span>
    </div>
    <span v-show="tips" class="is-gray">同上,支持In、NotIn、Exists 和 DoesNotExist</span>
    <el-form v-for="(item,index) in matchExpressions" :inline="true" style="margin-top: 10px">
      <el-form-item>
        <el-input v-model="item.key" placeholder="填写key" style="width: 250px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="item.operator">
          <el-option label="包含" value="In" />
          <el-option label="不包含" value="NotIn" />
          <el-option label="存在" value="Exists" />
          <el-option label="不存在" value="DoesNotExist" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <ArrayInput split="," :data.sync="item.values" input_width="250px" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="rmExpr(index)" />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  components: {
    ArrayInput: () => import('@/components/Common/ArrayInput.vue')
  },
  props: ['data', 'tips'],
  data() {
    return {
      matchExpressions: []
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.matchExpressions = newVal
      },
      deep: true
    },
    matchExpressions: {
      handler(newVal, oldVal) {
        this.$emit('update:data', newVal)
      },
      deep: true
    }
  },
  created() {
    this.matchExpressions = this.data
    if (this.matchExpressions === undefined || this.matchExpressions === null) {
      this.matchExpressions = []
    }
  },
  methods: {
    addEmptyObject() {
      if (this.matchExpressions === undefined || this.matchExpressions === null) {
        this.matchExpressions = []
      }
      this.matchExpressions.push({ key: '', operator: 'In', values: [] })
    },
    rmExpr(index) {
      this.matchExpressions.splice(index, 1)
      this.$forceUpdate()
    }
  }
}
</script>
