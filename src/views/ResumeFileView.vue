<template>
    <main>
        <div class="resume-btns-container">
            <!-- 在线预览按钮 -->
            <button class="resume-btn preview-btn" @click="previewResume">
                在线预览
            </button>
            <!-- 下载按钮 -->
            <button class="resume-btn download-btn" @click="downloadResume">
                下载简历附件
            </button>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';

// PDF文件路径（public目录下，纯英文命名！）
const resumePdfUrl = '/src/file/谭柱坤-简历.pdf';

// 在线预览：打开新标签页（浏览器自带PDF预览）
const previewResume = () => {
    try {
        // 打开新标签页预览PDF
        const previewWindow = window.open(resumePdfUrl, '_blank');
        // 兜底：新标签页被拦截时提示
        if (!previewWindow) {
            alert('预览窗口被浏览器拦截，请允许弹窗后重试！');
        }
    } catch (error) {
        console.error('预览失败：', error);
        alert('预览失败，可直接下载查看！');
    }
};

// 下载简历（复用之前的逻辑）
const downloadResume = () => {
    const link = document.createElement('a');
    link.href = resumePdfUrl;
    link.download = '谭柱坤-简历.pdf'; // 自定义下载文件名
    link.click();
    URL.revokeObjectURL(link.href);
};
</script>

<style scoped>
/* 按钮容器：并排显示，适配移动端 */
.resume-btns-container {
    display: flex;
    gap: 12px;
    margin: 20px;
    flex-wrap: wrap;
    /* 移动端自动换行 */
}

/* 通用按钮样式（咖啡色系） */
.resume-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    color: #fff;
}

.download-btn {
    padding: 8px 16px;
    background-color: #8B4513;
    /* 咖啡棕，可替换为你的配色 */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    /* a标签去掉下划线 */
}

.download-btn:hover {
    background-color: #A8643C;
    /* 摩卡棕，hover变色 */
}

/* 预览按钮样式（浅咖啡，区分下载） */
.preview-btn {
    background-color: #E6CCB3;
    /* 奶咖色 */
    color: #654321;
    /* 咖啡渣色（文字） */
}

.preview-btn:hover {
    background-color: #F1E0CC;
    /* 卡布奇诺色 */
    box-shadow: 0 2px 8px rgba(230, 204, 179, 0.3);
}

/* 响应式适配：移动端按钮占满宽度 */
@media (max-width: 768px) {
    .resume-btn {
        flex: 1;
        min-width: 120px;
    }
}
</style>
