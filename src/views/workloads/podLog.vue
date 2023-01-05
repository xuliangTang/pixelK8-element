<template>
  <div>
    <div style="padding-left: 20px;padding-top:30px">
      容器: <el-select v-model="selectedContainer" placeholder="选择容器" @change="containerChange">
        <el-option
          v-for="c in containers "
          :label="c.name"
          :value="c.name"
        />
      </el-select>
      <el-button style="margin-left: 5px" @click="logs=''">清空</el-button>
    </div>
    <div class="logs" ref="logs">
      {{ logs }}
    </div>
  </div>
</template>
<script>
import { getPodContainers } from '@/api/pod'
import streamRequest from '@/utils/streamRequests'

export default {
  data() {
    return {
      ns: '',
      podName: '',
      containers: [],
      selectedContainer: '',
      logs: ''
    }
  },
  created() {
    this.ns = this.$route.query.ns
    this.podName = this.$route.query.name
    if (this.ns && this.podName) {
      getPodContainers(this.ns, this.podName).then(rsp => {
        this.containers = rsp.data.data
      })
    }
  },
  methods: {
    containerChange() {
      /* getPodLogs(this.ns, this.podName, this.selectedContainer)
        .then(rsp => {
          this.logs = rsp.data.data
        })*/
      streamRequest({
        url: '/v1/pod/' + this.ns + '/' + this.podName + '/logs?container_name=' + this.selectedContainer,
        method: 'GET',
        onDownloadProgress: e => {
          const dataChunk = e.currentTarget.response
          this.logs = dataChunk

          if (this.$refs['logs'] !== undefined && this.$refs['logs'].scrollTop !== undefined){
            this.$refs['logs'].scrollTop = this.$refs['logs'].scrollHeight
          }
        }
      }).catch(e => {
        this.$router.push({ name: 'pods' })
      })
    }
  }
}
</script>
<style>
.logs{
  overflow: auto;

  margin:10px auto;
  min-height: 200px;
  max-height: 680px;
  border: solid 1px black;
  background-color: #454545;
  padding: 10px;

  color:#27aa5e;
  line-height: 21pt;
  white-space: pre;

}
</style>
