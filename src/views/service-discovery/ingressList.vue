<template>
  <div class="app-container">
    <p>Ingress总数: {{ countIng() }}</p>
    <p>
      <span><router-link to='ingress-create'><el-button>创建</el-button></router-link></span>
    </p>
    <el-container v-for="item in nslist">
      <el-header>命名空间：{{ item.name }}</el-header>
      <el-main>
        <el-table
          ref="itemSelect"
          :data="getIngList(item.name)"
          stripe
          fit
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <router-link :to='"ingress-create?mode=edit&ns=" + scope.row.namespace + "&name=" + scope.row.name'><el-link type="primary">{{ scope.row.name }}</el-link></router-link>
            </template>
          </el-table-column>
          <el-table-column label="Hosts">
            <template slot-scope="scope">
              <p v-for="host in scope.row.hosts"><el-link type="primary"><a :href="'http://'+host" target="_blank"> http://{{ host }} </a></el-link></p>
            </template>
          </el-table-column>
          <el-table-column
            label="配置"
            prop="tag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <span v-if="scope.row.opt.cors_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >跨域</el-tag>
              </span>
              <span v-if="scope.row.opt.rewrite_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >路径重写</el-tag>
              </span>
              <span v-if="scope.row.opt.auth_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >身份认证</el-tag>
              </span>
              <span v-if="scope.row.opt.limit_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >限流</el-tag>
              </span>
              <span v-if="scope.row.opt.canary_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >灰度</el-tag>
              </span>
              <span v-if="scope.row.opt.mirror_enable">
                <el-tag
                  type="success"
                  disable-transitions
                >流量复制</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown trigger="click" @command="handleMore">
                <el-button type="text" size="mini">
                  更多<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><router-link :to='"ingress-yaml?ns=" + item.name + "&name=" + scope.row.name'>查看YAML</router-link></el-dropdown-item>
                  <el-dropdown-item :command="['drop', scope.row]" class="clearfix">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
import { getIngressList, deleteIngress } from '@/api/ingress'
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
    }
  },
  methods: {
    handleMore(command) {
      if (command[0] === 'drop') {
        deleteIngress(command[1].namespace, command[1].name).catch((err) => {
          if (err.response) {
            this.$message.error(err.response.data.error)
          } else {
            this.$message.error(err.message)
          }
        })
      }
    },
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
