<template>
  <div class="app-container">
    <p>Ingress总数: {{ countIng() }}</p>
    <p><router-link to='ingress-create'><el-button>创建</el-button></router-link></p>
    <el-container v-for="item in nslist" >
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          :data="getIngList(item.name)"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="60">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="getIngTotal(item.name)"
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
import { getIngressList } from '@/api/ingress'
import { NewClient } from '@/utils/ws'
import { getNsList } from '@/api/namespace'

export default {
  data() {
    return {
      wsClient: null,
      nslist: null,
      ingList: {},
      pages: {}
    }
  },
  created() {
    getNsList().then(response => {
      this.nslist = response.data.data
      this.nslist.forEach(ns => {
        this.pages[ns] = 1
        this.loadIngress(ns.name, 1)
      })
    })

    this.wsClient = NewClient()
    this.wsClient.onmessage = (e) => {
      if (e.data !== 'ping') {
        const data = JSON.parse(e.data)
        if (data.type === 'ingress') {
          this.pages[data.result.ns] = 1
          this.ingList[data.result.ns] = data.result.data
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    getIngList(ns) {
      return (ns) => {
        if (typeof (this.ingList[ns]) === undefined || this.ingList[ns] == null) {
          return null
        }
        return this.ingList[ns].items
      }
    },
    getIngTotal(ns) {
      return (ns) => {
        if (typeof (this.ingList[ns]) === undefined || this.ingList[ns] == null) {
          return 0
        }
        return this.ingList[ns].page.extend.count
      }
    },
    countIng() {
      return () => {
        let num = 0
        for (const ns in this.ingList) {
          if (typeof (this.ingList[ns]) !== undefined && this.ingList[ns] !== null) {
            num += this.ingList[ns].page.extend.count
          }
        }
        return num
      }
    },
  },
  methods: {
    changePage(ns, page) {
      this.loadIngress(ns, page)
    },
    loadIngress(ns, page) {
      getIngressList(ns, page).then(response => {
        this.$set(this.ingList, ns, response.data.data)
      })
    }
  }
}
</script>

<style>

.el-header, .el-footer {
  background-color: #f2f2f2;
  color: #6c6c76;
  text-align: center;
  line-height: 60px;
}
.is-gray {color: gray}
.is-red {color: red}
.is-green {color: green}
</style>
