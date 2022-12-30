<template>
  <div class="app-container">
    <p>Pod总数: {{ getPodsNum(false) }} 就绪：{{ getPodsNum(true) }}</p>
    <el-container v-for="item in nslist" >
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getPodsList(item.name)"
          stripe
          fit
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
        <el-pagination
          background
          layout="prev, pager, next"
          :total="getPodsTotal(item.name)"
          :page-size="5"
          :current-page.sync="pages[item.name]"
          :hide-on-single-page="true"
          @current-change="(current)=>changePage(item.name,current)"
        >
        </el-pagination>
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
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadPods(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'pods') {
          this.pages[data.result.ns] = 1
          this.$set(this.podList, data.result.ns, data.result.data)
        }
      }
    }
  },
  computed: {
    // 获取PODS总数
    getPodsNum(ready) {
      return (ready) => {
        let num = 0
        for (const ns in this.podList) {
          if (typeof (this.podList[ns]) !== undefined && this.podList[ns] !== null) {
            if (ready) {
              num += this.podList[ns].page.extend.count_ready
            } else {
              num += this.podList[ns].page.extend.count
            }
          }
        }
        return num
      }
    },
    // 新增计算属性，因为有的ns下没有pods 因此要做处理
    getPodsList(ns) {
      return (ns) => {
        if (typeof (this.podList[ns]) === undefined || this.podList[ns] == null) {
          return null
        }
        return this.podList[ns].items
      }
    },
    // 计算属性，给分页组件用的。用于显示Total (后端直接传了)
    getPodsTotal(ns) {
      return (ns) => {
        if (typeof (this.podList[ns]) === undefined || this.podList[ns] == null) {
          return 0
        }
        return this.podList[ns].page.extend.count
      }
    }
  },
  methods: {
    changePage(ns, page) {
      this.loadPods(ns, page)
    },
    loadPods(ns, page) {
      getPodList(ns, page).then(response => {
        // this.podList[ns] = response.data.data
        // this.$forceUpdate()
        this.$set(this.podList, ns, response.data.data)
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
    }
  }
}

</script>
