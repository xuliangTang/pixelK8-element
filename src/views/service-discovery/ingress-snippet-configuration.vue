<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自定义配置(location)</span>
      </div>
      <div>
        <el-form label-width="150px">
          <el-form-item label="启用">
            <el-switch v-model="subConfig.configuration_snippet_enable" />
          </el-form-item>
          <el-form-item>
            <textarea ref="myeditor" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/nginx/nginx'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/lint/lint'
const prefix = 'nginx.ingress.kubernetes.io'
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
    },
    setAnnotations(data) {
      this.parseData(data)

      this.editor.setValue(this.subConfig.configuration_snippet)
      setTimeout(() => {
        this.editor.refresh()
      }, 50)
    },
    // 编辑状态下进行annotations的解析
    parseData(data) {
      if (data !== undefined && data !== null) {
        for (const key in data) {
          this.setIfExists(key, data[key])
        }
      }
    },
    // parseData函数的辅助函数，判断传递过来的annotation中的属性在自身的对象中是否存在
    setIfExists(key, value) {
      value = value === 'true' ? true : value
      for (const mykey in this.subConfig) {
        if (key.replace(/-/g, '_') === prefix + '/' + mykey) {
          this.$set(this.subConfig, mykey, value)
          this.$emit('pop', key)
          this.$emit('update:show', true)
        }
      }
    }
  }
}
</script>
