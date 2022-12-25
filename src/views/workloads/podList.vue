<template>
  <div>
    <el-container v-for="item in nslist" >
      <el-header>{{ item.name }}</el-header>
      <el-main>
        这里放表格
      </el-main>
    </el-container>
  </div>

</template>
<script>
import { getList } from '@/api/namespace';

export default {
  data() {
    return {
      nslist: null
    }
  },
  created() {
    getList().then(response => {
      this.nslist = response.data.data
    })
  }
}

</script>
<style>
.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;

}
</style>
