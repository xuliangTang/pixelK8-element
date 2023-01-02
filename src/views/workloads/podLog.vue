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
    </div>
    <div class="logs">
      {{ logs }}
    </div>
  </div>
</template>
<script>
import { getPodContainers, getPodLogs } from "@/api/pod";

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
      getPodLogs(this.ns, this.podName, this.selectedContainer)
        .then(rsp => {
          this.logs = rsp.data.data
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
  max-height: 800px;
  border: solid 1px black;
  background-color: #454545;
  padding: 10px;

  color:#27aa5e;
  line-height: 21pt;
  white-space: pre;

}
</style>
