<template>
  <el-input v-model="text" :style="'width:'+input_width" placeholder="多个值请用逗号分隔" />
</template>
<script>
export default {
  props: ['data', 'input_width'],
  data() {
    return {
      text: ''
    }
  },
  watch: {
    text: {
      handler(newVal, oldVal) {
        this.$emit('update:data', this.text.split(','))
      }
    }
  },
  created() {
    if (this.data !== undefined && this.data != null) {
      this.text = this.data.join(',')
    }
  }
}
</script>
