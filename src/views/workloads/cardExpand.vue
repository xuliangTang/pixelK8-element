<template>
  <i :class="icon" @click="setExpand" />
</template>
<script>
export default {
  props: {
    expand: Boolean
  },
  data() {
    return {
      icon: 'el-icon-arrow-up',
      childExpand: this.expand
    }
  },
  watch: {
    childExpand: function(newValue, oldValue) {
      this.$emit('update:expand', newValue)
    }
  },
  mounted() {
    this.setIcon()// 设置图标
  },
  methods: {
    setIcon() {
      if (this.childExpand) {
        this.icon = 'el-icon-arrow-up'
      } else {
        this.icon = 'el-icon-arrow-down'
      }
    },
    setExpand() {
      this.childExpand = !this.childExpand
      this.setIcon()
    }
  }
}
</script>
