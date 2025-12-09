<template>
    <div class="code-block-wrapper">
        <div class="code-block">
            <!-- Run按钮 -->
            <button v-if="lang === 'javascript' || lang === 'js'" class="run-code-btn" @click="runJsCode"
                :disabled="isRunning">
                <!-- 加载动画：isRunning=true时显示 -->
                <span class="loading-spinner" v-if="isRunning"></span>
                <!-- 按钮文字：isRunning=false时显示 -->
                <span class="btn-text" v-else>Run</span>
            </button>
            <!-- 行号栏 -->
            <div class="line-numbers" v-if="showLineNumbers">
                <span v-for="i in lineCount" :key="i">{{ i }}</span>
            </div>
            <pre class="code-pre">
      <code :class="`language-${lang}`" v-html="highlightedCodeWithCursor"></code>
    </pre>
        </div>
        <!-- 终端风格输出区 -->
        <div class="terminal-output">
            <!-- 终端头部：模拟终端标题栏，强化区分 -->
            <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">输出</span>
            </div>
            <!-- 终端内容区：黑底白字 -->
            <pre class="terminal-content" :class="{ error: isError }">{{ outputText }}</pre>
        </div>
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
// 新增：运行相关状态
const isRunning = ref(false) // 是否正在运行
const outputVisible = ref(false) // 是否显示输出区
const outputText = ref('') // 运行结果/报错信息
const isError = ref(false) // 是否运行出错

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

// 核心：运行JS代码 + 捕获console.log输出
const runJsCode = () => {
    // 1. 重置状态
    isRunning.value = true
    outputVisible.value = true
    outputText.value = 'code running...' // 模拟代码编译效果
    isError.value = false

    // 重置打字机状态（确保使用最新的完整代码）
    typingIndex.value = formattedFullCode.value.length // 直接跳到最后（跳过打字动画，直接用完整代码）
    currentCode.value = formattedFullCode.value // 直接显示完整代码

    // 2. 备份原生console.log，替换为自定义输出
    const originalLog = console.log
    const logOutput: string[] = []

    console.log = (...args) => {
        logOutput.push(args.map(arg => JSON.stringify(arg, null, 2)).join(' '))
    }

    // 延迟10ms，确保清空先生效（视觉更明显）
    setTimeout(() => {
        try {
            // 3. 获取格式化后的完整JS代码（避免打字机未完成的部分）
            const jsCode = formattedFullCode.value
            // 安全处理：仅运行顶级代码（避免闭包/全局污染）
            const codeToRun = `(function() { ${jsCode} })()`
            // 执行代码
            eval(codeToRun) // 注意：仅运行可信代码！生产环境需严格校验
            // 4. 展示输出
            outputText.value = logOutput.length ? logOutput.join('\n') : '代码运行完成（无输出）'
        } catch (e: any) {
            // 5. 捕获报错
            isError.value = true
            outputText.value = `运行错误：${e.message}\n${e.stack?.split('\n').slice(0, 3).join('\n')}`
        } finally {
            // 6. 恢复原生console.log + 结束运行
            console.log = originalLog
            isRunning.value = false
        }
    }, 1500)
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
.code-block-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* 行号容器 + 代码容器：统一基础样式 */
.code-block {
    margin: 8px 0 0 0;
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    background: #1e1e1e;
    height: 150px;
    max-width: 600px;
    max-height: 300px;
    display: flex;
    align-items: flex-start;
    /* 顶部对齐，避免容器错位 */
    font-family: "Consolas", "Monaco", monospace;
    /* 统一等宽字体（代码场景必用） */
    font-size: 16px;
    /* 统一字号 */
    position: relative;
    /* 新增：关键！让按钮相对于代码块定位 */
}

/* 新增：Run按钮样式（右上角、简约风格） */
.run-code-btn {
    position: absolute;
    /* 绝对定位 */
    top: 4px;
    /* 距离顶部4px */
    right: 4px;
    /* 距离右侧4px */
    z-index: 10;
    /* 确保按钮在最上层，不被代码遮挡 */
    padding: 4px 10px; /* 微调padding，适配加载动画 */
    /* 小尺寸，适配右上角 */
    border: none;
    border-radius: 3px;
    /* 圆角，简约风格 */
    background: #42b983;
    /* 清新绿色，适配深色代码块 */
    color: #fff;
    cursor: pointer;
    font-size: 11px;
    /* 小字号，不占空间 */
    font-weight: 600;
    transition: background 0.2s;
    display: flex; /* 让动画和文字居中对齐 */
}

/* 按钮禁用/运行中样式 */
.run-code-btn:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.8;
}

/* 加载动画核心样式 */
.loading-spinner {
  width: 12px; /* 动画尺寸，适配按钮大小 */
  height: 12px;
  border: 2px solid #fff; /* 白色边框（适配深色按钮） */
  border-top: 2px solid transparent; /* 顶部透明，形成缺口 */
  border-radius: 50%; /* 圆形 */
  animation: spin 0.8s linear infinite; /* 旋转动画 */
}

/* 旋转动画关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 鼠标悬浮样式 */
.run-code-btn:not(:disabled):hover {
    background: #359469;
}

/* 行号容器：与代码容器的padding完全匹配 */
.line-numbers {
    padding: 8px 0;
    /* 和代码容器的padding-top/padding-bottom一致 */
    background: #181818;
    text-align: right;
    padding-right: 8px;
    /* 行号右侧留间距 */
}

/* 行号单个数字：与代码行的行高、基线完全对齐 */
.line-numbers span {
    display: block;
    /* 每个行号占一行，确保和代码行一一对应 */
    padding: 0 4px;
    color: #888;
    line-height: 1.5;
    /* 与代码行的line-height完全一致 */
    height: 1.5em;
    /* 强制行高=高度，避免空白偏差 */
    box-sizing: border-box;
}

/* 代码容器：与行号容器的padding、行高统一 */
.code-pre {
    margin: 0;
    padding: 8px 12px;
    /* 顶部/底部padding和行号容器一致 */
    color: #fff;
    line-height: 1.5;
    /* 与行号的line-height完全一致 */
    overflow-x: auto;
    flex: 1;
    box-sizing: border-box;
}

/* 核心：终端样式输出区 */
.terminal-output {
    height: 65px;
    background: #000;
    /* 纯黑背景，终端核心风格 */
    border-radius: 0 0 6px 6px;
    /* 下圆角6px，和代码块上圆角呼应 */
    border-top: 1px solid #333;
    /* 顶部细边框，区分代码块和终端 */
    overflow: hidden;
    /* 裁剪内容，匹配圆角 */
    font-family: "Consolas", "Monaco", "Fira Code", monospace;
    /* 统一等宽字体 */
}

/* 终端头部：模拟Mac终端标题栏，强化区分 */
.terminal-header {
    padding: 4px 8px;
    background: #222;
    /* 浅黑背景，和纯黑内容区分 */
    display: flex;
    align-items: center;
    gap: 6px;
}

/* 终端关闭/最小化/最大化圆点 */
.terminal-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.terminal-dot.red {
    background: #ff5f56;
}

.terminal-dot.yellow {
    background: #ffbd2e;
}

.terminal-dot.green {
    background: #27c93f;
}

/* 终端标题 */
.terminal-title {
    color: #ccc;
    font-size: 11px;
    margin-left: 4px;
}

/* 终端内容区：黑底白字，适配报错样式 */
.terminal-content {
    margin: 0;
    padding: 8px 12px;
    color: #fff;
    /* 默认白字 */
    line-height: 1.5;
    /* 和代码块行高统一 */
    font-size: 14px;
    /* 和代码块字体大小统一 */
    white-space: pre-wrap;
    /* 保留换行 */
    overflow-x: auto;
    /* 横向滚动 */
}

/* 报错时文字变红，保留黑底 */
.terminal-content.error {
    color: #ff4444;
    /* 红色报错文字，终端风格 */
}
</style>