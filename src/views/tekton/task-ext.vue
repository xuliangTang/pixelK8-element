<template>
  <el-form :inline="true">
    <el-form-item label="脚本" style="width: 100%;margin-top: 20px">
      <el-input  type="textarea" style="width:300px" v-model="ext.script" ></el-input>
      <span>设置该项后，将不能设置command。同时args也将作为参数的传递给script</span>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props:["data"],
    data(){
      return {
        ext:{},
      }
    },
    watch:{
      data:{
        handler:function(newVal,oldVal) {
          this.ext=newVal
        },
        deep: true
      },
      ext:{
        handler:function(newVal,oldVal) {

          this.$emit("update:data",newVal)
        },
        deep: true
      },
    },

  }
</script>
