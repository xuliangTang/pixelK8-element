<template>
  <div>
    <div style="padding-left: 20px;padding-top:30px;padding-bottom: 10px">
      容器: <el-select v-model="selectedContainer" placeholder="选择容器" @change="containerChange">
        <el-option
          v-for="c in containers "
          :label="c.name"
          :value="c.name"
        />
      </el-select>
    </div>
    <div id="terminal" ref="terminal" />
  </div>
</template>
<script>
import { getPodContainers } from '@/api/pod'
import { Terminal } from 'xterm'
import { NewPodContainerClient } from '@/utils/ws'
import 'xterm/css/xterm.css'

export default {
  data() {
    return {
      ns: '',
      podName: '',
      containers: [],
      selectedContainer: '',

      rows: 40,
      cols: 100,
      term: null, // 终端对象
      ws: null, // ws 客户端
      wsInited: false // 是否初始化完毕
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
      this.ws = NewPodContainerClient(this.ns, this.podName, this.selectedContainer)
      this.ws.onmessage = (e) => {
        this.wsInited = true
        this.term.write(e.data)
      }

      const term = new Terminal({
        rendererType: 'canvas', // 渲染类型
        rows: parseInt(this.rows), // 行数
        cols: parseInt(this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, // 启用时，光标将设置为下一行的开头
        disableStdin: false, // 是否应禁用输入
        cursorStyle: 'underline', // 光标样式
        cursorBlink: true, // 光标闪烁
        theme: {
          foreground: '#7e9192', // 字体
          background: '#002833', // 背景色
          cursor: 'help', // 设置光标
          lineHeight: 16
        }
      })

      // 创建terminal实例
      term.open(this.$refs['terminal'])
      term.prompt = () => {
        term.writeln('\n\n Connecting to ' + this.selectedContainer)
        term.writeln('\n 正在初始化终端')
      }
      term.prompt()

      term.onData((key) => {
        if (this.wsInited) {
          this.ws.send(key)
        }
      })

      this.term = term
    }
  }
}
</script>
