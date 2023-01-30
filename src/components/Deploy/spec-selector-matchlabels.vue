<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>标签选择器(matchLabels) <i class="ii el-icon-circle-plus" @click="addSlice" />  </span>
    </div>
    <span v-show="tips" class="is-gray">匹配pod的标签,用于选择和管理对应的pods</span>
    <el-form v-for="(item,index) in matchLabels_array" :inline="true" style="margin-top: 10px">
      <el-form-item>
        <el-input v-model="item.key" placeholder="填写key" style="width: 250px" @input="parseSlice" />
      </el-form-item>
      <el-form-item>
        -
      </el-form-item>
      <el-form-item>
        <el-input v-model="item.value" placeholder="填写value" style="width: 250px" @input="parseSlice" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="matchLabels_array.splice(index,1);parseSlice()" />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  props: ['data', 'tips'],
  data() {
    return {
      matchLabels: {},
      matchLabels_array: [] // [{key:'xx',value:''}]
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        this.matchLabels = newVal
        this.unParseSlice()
      },
      deep: true
    },
    matchLabels: {
      handler(newVal, oldVal) {
        this.$emit('update:data', newVal)
      },
      deep: true
    }
  },
  created() {
    this.matchLabels = this.data
    this.unParseSlice()
  },
  methods: {
    addSlice() {
      this.matchLabels_array.push({ key: '', value: '' })
      // this.parseSlice()
    },
    parseSlice() { // 把数据解析为对象
      this.matchLabels = {}
      this.matchLabels_array.forEach(item => {
        if (item.key !== '') {
          this.matchLabels[item.key] = item.value
        }
      })
    },
    unParseSlice() { // 把对象 解析为数组， 常用于编辑状态
      this.matchLabels_array = []
      for (const key in this.matchLabels) {
        this.matchLabels_array.push({ key, value: this.matchLabels[key] })
      }
    }
  }
}
</script>
