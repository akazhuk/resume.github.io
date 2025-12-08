<template>
  <div class="code-block">
    <!-- 新增：行号栏 -->
    <div class="line-numbers" v-if="showLineNumbers">
      <span v-for="i in lineCount" :key="i">{{ i }}</span>
    </div>
    <pre class="code-pre">
      <code :class="`language-${lang}`" v-html="highlightedCode"></code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Prism from 'prismjs'
import prettier from 'prettier'

// 引入需要的语言高亮（按需引入，减小体积）
// import 'prismjs/components/prism-javascript'
// import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-java'

// 引入样式
import 'prismjs/themes/prism-tomorrow.css'


const props = defineProps({
  // 代码内容
  code: {
    type: String,
    required: true
  },
  // 代码语言（如 js、vue、html）
  lang: {
    type: String,
    default: 'javascript'
  },
  // 新增：是否显示行号（默认开启）
  showLineNumbers: {
    type: Boolean,
    default: true
  }
})

// 1. 自动格式化代码（核心优化）
const formatCode = (code: string, lang: string) => {
  // 先统一清理原代码的多余空行（核心：过滤全空白的行）
  const cleanCode = code
    .split('\n')
    .map(line => line.trim()) // 去掉每行前后空格
    .filter(line => line !== '') // 过滤完全空白的行
    .join('\n'); // 重新拼接成无多余空行的代码

  // 针对自定义语法（你的咖啡代码）做缩进处理
  if (lang === 'java') { // 给你的自定义语法设个lang="custom"
    let indentLevel = 0;
    const indent = '  ';
    return cleanCode
      .split('\n')
      .map(line => {
        // 右大括号减少缩进
        if (line.startsWith('}')) {
          indentLevel--;
        }
        const indentedLine = indent.repeat(indentLevel) + line;
        // 左大括号增加缩进
        if (line.endsWith('{')) {
          indentLevel++;
        }
        return indentedLine;
      })
      .join('\n');
  }
}
// 2. 先格式化再高亮
const formattedCode = computed(() => {
  const result = formatCode(props.code, props.lang);
  console.log('格式化后代码：', result); // 检查控制台输出是否有缩进
  return result;
});
const highlightedCode = computed(() => {
  // 高亮处理
  return Prism.highlight(
    props.code,
    Prism.languages[props.lang],
    props.lang
  )
})

// 3. 计算行数（用于行号显示）
const lineCount = computed(() => {
  return formattedCode.value.split('\n').length
})

// 监听代码变化重新高亮
watch(() => props.code, () => {
  highlightedCode.value = Prism.highlight(
    formatCode(props.code, props.lang),
    Prism.languages[props.lang] || Prism.languages.markup,
    props.lang
  )
})
</script>

<style scoped>

/* 新增：行号栏样式 */
.line-numbers {
  padding: 8px 0;
  background: #181818; /* 行号栏背景稍暗，区分代码区 */
  text-align: right;
}
.line-numbers span {
  display: block;
  padding: 0 8px;
  color: #888; /* 行号颜色弱化 */
  font-size: 12px;
  line-height: 1.4;
}

.code-block {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
  /* 新增：flex 布局适配行号 */
  display: flex;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 新增：轻微阴影提升层次感 */
}
.code-pre {
  margin: 0;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  flex: 1; /* 自适应剩余宽度 */
}
</style>