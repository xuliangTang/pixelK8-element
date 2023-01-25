<template>
  <div>
    <div id="terminal" ref="terminal" />
  </div>
</template>
<script>

import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

export default {
  data() {
    return {
      nodeName: '',

      rows: 30,
      cols: 100,
      term: null, // 终端对象
      ws: null, // ws 客户端
      wsInited: false // 是否初始化完毕
    }
  },
  mounted() {
    this.nodeName = this.$route.query.name
    if (this.nodeName) {
      this.initShell()
    }
  },
  methods: {
    initShell() {
      const ws = new WebSocket('ws://localhost:8081/v1/ws/node/' + this.nodeName + '/terminal')
      ws.onopen = function() {
        console.log('open')
      }
      ws.onmessage = (e) => {
        this.wsInited = true // 初始化完毕了
        this.term.write(e.data)
      }
      ws.onclose = function(e) {
        console.log('close')
      }
      ws.onerror = function(e) {
        console.log(e)
      }
      this.ws = ws

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
        term.writeln('\n\n Connecting to ' + this.nodeName)
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
