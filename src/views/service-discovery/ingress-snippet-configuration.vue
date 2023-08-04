<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="启用">
        <el-switch v-model="subConfig.configuration_snippet_enable" />
      </el-form-item>
      <el-form-item>
        <textarea ref="myeditor" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/nginx/nginx'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/lint/lint'

export default {
  data() {
    return {
      editor: null, // 编辑器对象
      subConfig: {
        configuration_snippet_enable: false,
        configuration_snippet: ''
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      // 初始化 yaml 编辑器
      this.editor = CodeMirror.fromTextArea(this.$refs.myeditor, {
        mode: 'nginx', // 语法model
        theme: 'monokai', // 编辑器主题
        tabSize: 2 // 缩进格式
      })

      this.editor.setValue(this.subConfig.configuration_snippet)
      this.editor.on('change', (editor, changes) => {
        this.subConfig.configuration_snippet = this.editor.getValue()
      })
    },
    output() {
      const prefix = 'nginx.ingress.kubernetes.io'
      const result = {}

      if (this.subConfig.configuration_snippet_enable) {
        for (const key in this.subConfig) {
          const newKey = key.replace(/_/g, '-')
          if (this.subConfig[key] !== '') {
            result[prefix + '/' + newKey] = this.subConfig[key].toString()
          }
        }
      }

      return result
    }
  }
}
</script>
