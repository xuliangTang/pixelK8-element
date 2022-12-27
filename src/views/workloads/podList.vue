<template>
  <div>
    <p>Pod总数: {{ this.countPods }} 就绪：{{ this.countReadyPods }}</p>
    <el-container v-for="item in nslist" >
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          :data="podList[item.name]"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="阶段 / 状态">
            <template slot-scope="scope">
              <p>
                <span>{{ scope.row.phase }}</span> /
                <span v-html="getStatus(scope.row.is_ready)"></span>
              </p>
              <p class="is-red" v-html="getMessage(scope.row)"></p>
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
          <el-table-column label="主机" width="130">
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
import { getNsList } from '@/api/namespace'
import { getPodList } from '@/api/pod'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      nslist: null,
      podList: {},
      countPods: 0,
      countReadyPods: 0
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.loadPods(ns.name)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'pods') {
          this.$set(this.podList, data.result.ns, data.result.data)
        }
      }
    }
  },
  methods: {
    loadPods(ns) {
      getPodList(ns).then(response => {
        // this.podList[ns] = response.data.data
        // this.$forceUpdate()
        this.$set(this.podList, ns, response.data.data)
        this.count(ns)
      })
    },
    getStatus(is_ready) {
      if (is_ready) {
        return 'Active'
      } else {
        return 'Waiting'
      }
    },
    getMessage(row) {
      if (!row.is_ready) {
        return row.message
      }
      return ''
    },
    count(ns) {
      this.podList[ns].forEach(item => {
        this.countPods++
        if (item.is_ready) {
          this.countReadyPods++
        }
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
