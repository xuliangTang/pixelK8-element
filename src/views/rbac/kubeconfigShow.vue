<template>
  <div class="yaml-editor">
    <textarea ref="yamltext"></textarea>
  </div>
</template>
<script>
import { getKubeconfig } from '@/api/userAccount'
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'
window.jsyaml = require('js-yaml')
export default {
  data() {
    return {
      yaml_text: '',
      yamlEditor: null // 编辑器对象
    }
  },
  mounted() {
    const user = this.$route.query.cn
    if (user) {
      getKubeconfig(user).then(rsp => {
        this.yaml_text = rsp.data.data
        this.initYaml()
      })
    }
  },
  methods: {
    initYaml() {
      // 初始化 yaml 编辑器
      this.yamlEditor = CodeMirror.fromTextArea(this.$refs.yamltext, {
        lineNumbers: true, // 显示行号
        mode: 'text/x-yaml', // 语法model
        gutters: ['CodeMirror-lint-markers'], // 语法检查器
        theme: 'monokai', // 编辑器主题
        lint: true // 开启语法检查
      })

      this.yamlEditor.setValue(this.yaml_text) // 对编辑器设置值
    }
  }
}

</script>
