<template>
  <div>
    <el-container v-for="item in nslist" >
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          :data="podList[item.name]"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="阶段">
            <template slot-scope="scope">
              <p>{{ scope.row.phase }}</p>
              <p class="is-red">{{scope.row.message}}</p>
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <p>{{ scope.row.name }}</p>
              <p class="is-gray">{{ scope.row.ip[1] }}</p>
            </template>
          </el-table-column>
          <el-table-column label="镜像">
            <template slot-scope="scope">
              <p>{{ scope.row.images }}</p>
            </template>
          </el-table-column>
          <el-table-column label="主机">
            <template slot-scope="scope">
              <p>{{ scope.row.node_name }}</p>
              <p class="is-gray">{{ scope.row.ip[1] }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>

</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getNsList } from '@/api/namespace'
// eslint-disable-next-line no-unused-vars
import { getPodList } from '@/api/pod'

export default {
  data() {
    return {
      nslist: null,
      podList: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.loadPods(ns.name)
      })
    })
  },
  methods: {
    loadPods(ns) {
      getPodList(ns).then(response => {
        // this.podList[ns] = response.data.data
        this.$set(this.podList, ns, response.data.data)
      })
    }
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
.is-gray {
  color: gray;
}
.is-red {
  color: red;
}
</style>
