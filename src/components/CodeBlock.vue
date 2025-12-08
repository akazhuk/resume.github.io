<template>
    <div class="code-block">
        <!-- 新增：行号栏 -->
        <div class="line-numbers" v-if="showLineNumbers">
            <span v-for="i in lineCount" :key="i">{{ i }}</span>
        </div>
        <pre class="code-pre">
      <code :class="`language-${lang}`" v-html="highlightedCodeWithCursor"></code>
    </pre>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Prism from 'prismjs'
import prettier from 'prettier'

// 引入需要的语言高亮（按需引入，减小体积）
import 'prismjs/components/prism-javascript'

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
    },
    // 新增：打字机配置
    typingSpeed: { // 每个字符的打字速度（毫秒）
        type: Number,
        default: 100
    },
    loopTyping: { // 是否循环打字
        type: Boolean,
        default: false
    }
})

// 1. 自动格式化代码（核心优化）
const formatCode = (code: string, lang: string) => {
    try {
        const formatOptions = {
            plugins: [parserBabel],
            tabWidth: 2,
            printWidth: 80,
            singleQuote: true,
            trailingComma: 'es5',
            bracketSpacing: true
        }
        return prettier.format(code, formatOptions)
    } catch (e) {
        console.warn(`[${lang}] 格式化失败：`, e)
        return code
    }
}

// 2. 打字机核心状态
const formattedFullCode = ref('') // 格式化后的完整代码
const currentCode = ref('') // 当前已打出的代码
const typingIndex = ref(0) // 当前打字的字符索引
const cursorVisible = ref(true) // 光标是否可见
let typingTimer: NodeJS.Timeout | null = null // 打字定时器
let cursorTimer: NodeJS.Timeout | null = null // 光标闪烁定时器

// 计算行数（适配行号）
const lineCount = computed(() => currentCode.value.split('\n').length)

// 高亮当前已打出的代码 + 光标
const highlightedCodeWithCursor = computed(() => {
    // 先高亮已打出的代码
    const highlighted = Prism.highlight(
        currentCode.value,
        Prism.languages[props.lang] || Prism.languages.markup,
        props.lang
    )
    // 添加光标（用<span>模拟，加闪烁动画）
    return highlighted + '<span class="typing-cursor" v-if="cursorVisible">|</span>'
})

// 3. 打字机逻辑
const startTyping = () => {
    // 重置状态
    typingIndex.value = 0
    currentCode.value = ''
    // 逐字符打字
    typingTimer = setInterval(() => {
        if (typingIndex.value >= formattedFullCode.value.length) {
            clearInterval(typingTimer!)
            // 若开启循环，延迟1秒后重新开始
            if (props.loopTyping) {
                setTimeout(startTyping, 1000)
            }
            return
        }
        // 拼接当前字符（保留换行/空格，保证格式）
        currentCode.value += formattedFullCode.value[typingIndex.value]
        typingIndex.value++
    }, props.typingSpeed)
}

// 4. 光标闪烁逻辑
const startCursorBlink = () => {
    cursorTimer = setInterval(() => {
        cursorVisible.value = !cursorVisible.value
    }, 500)
}

// 5. 监听props变化，重新格式化+启动打字
watch(
    () => [props.code, props.lang],
    () => {
        // 清除旧定时器
        if (typingTimer) clearInterval(typingTimer)
        // 重新格式化代码
        formattedFullCode.value = formatCode(props.code, props.lang)
        // 启动打字
        startTyping()
    },
    { immediate: true }
);

// 6. 生命周期：启动/销毁定时器
onMounted(() => {
    startCursorBlink() // 启动光标闪烁
})

onUnmounted(() => {
    if (typingTimer) clearInterval(typingTimer)
    if (cursorTimer) clearInterval(cursorTimer)
})

</script>

<style scoped>
/* 行号容器 + 代码容器：统一基础样式 */
.code-block {
  margin: 8px 0;
  border-radius: 6px;
  overflow: hidden;
  background: #1e1e1e;
  max-width: 600px;
  max-height: 300px;
  display: flex;
  align-items: flex-start; /* 顶部对齐，避免容器错位 */
  font-family: "Consolas", "Monaco", monospace; /* 统一等宽字体（代码场景必用） */
  font-size: 16px; /* 统一字号 */
}

/* 行号容器：与代码容器的padding完全匹配 */
.line-numbers {
  padding: 8px 0; /* 和代码容器的padding-top/padding-bottom一致 */
  background: #181818;
  text-align: right;
  padding-right: 8px; /* 行号右侧留间距 */
}

/* 行号单个数字：与代码行的行高、基线完全对齐 */
.line-numbers span {
  display: block; /* 每个行号占一行，确保和代码行一一对应 */
  padding: 0 4px;
  color: #888;
  line-height: 1.5; /* 与代码行的line-height完全一致 */
  height: 1.5em; /* 强制行高=高度，避免空白偏差 */
  box-sizing: border-box;
}

/* 代码容器：与行号容器的padding、行高统一 */
.code-pre {
  margin: 0;
  padding: 8px 12px; /* 顶部/底部padding和行号容器一致 */
  color: #fff;
  line-height: 1.5; /* 与行号的line-height完全一致 */
  overflow-x: auto;
  flex: 1;
  box-sizing: border-box;
}
</style>