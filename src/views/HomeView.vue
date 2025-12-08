<template>
    <main>
        <!-- 单列图文容器 -->
        <div class="single-img-text">
            <!-- 图片区域：适配比例，防止拉伸 -->
            <div class="img-wrapper">
                <!-- 本地图片：public目录下（推荐） -->
                <img src="/src/images/espresso.jpg" alt="简历封面" class="content-img" loading="lazy">
                <!-- 若用assets目录图片：src="@/assets/resume-cover.png" -->
                <!-- 网络图片：src="https://xxx.com/resume-cover.png" -->
            </div>
            <!-- 文字区域：居中对齐 -->
            <!-- <div class="text-wrapper">
                <h3 class="text-title">意式浓缩</h3>
                <p class="text-desc">加水=美式，加牛奶=拿铁/卡布奇诺</p>
                <p class="text-desc">咖啡如此，人生亦如此，共勉！</p>
            </div> -->
            <!-- 代码块 -->
            <CodeBlock style="text-align: left;" lang="javascript" 
code="function helloWorld()
      {
        console.log('Hello World!')
      }
      helloWorld();"
/>
        </div>
    </main>
</template>

<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue'

</script>

<style scoped>
/* 单列容器：居中显示，适配最大宽度 */
.single-img-text {
    width: 100%;
    max-width: 400px;
    /* 限制最大宽度，避免拉伸 */
    margin: 20px auto;
    text-align: center;
}

/* 图片容器：固定比例，防止变形 */
.img-wrapper {
    width: 100%;
    aspect-ratio: 4/3;
    /* 图片比例（宽高比），可调整为16/9、1/1等 */
    overflow: hidden;
    border-radius: 8px;
    /* 圆角提升质感 */
    box-shadow: 0 2px 10px rgba(139, 69, 19, 0.1);
    /* 咖啡色系浅阴影 */
}

/* 图片样式：自适应+平滑过渡 */
.content-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 覆盖容器，保持比例 */
    transition: transform 0.3s ease;
}

.content-img:hover {
    transform: scale(1.02);
    /* hover轻微放大，提升交互 */
}

/* 文字区域：间距+配色 */
.text-wrapper {
    margin-top: 16px;
    padding: 0 10px;
}

.text-title {
    font-size: 18px;
    color: #8B4513;
    /* 深度咖啡棕 */
    margin: 0 0 8px 0;
    font-weight: 500;
}

.text-desc {
    font-size: 14px;
    color: #654321;
    /* 咖啡渣色 */
    line-height: 1.5;
    margin: 0;
}

/* 响应式：移动端调整比例和字体 */
@media (max-width: 768px) {
    .img-wrapper {
        aspect-ratio: 3/2;
        /* 移动端更适配的比例 */
    }

    .text-title {
        font-size: 16px;
    }

    .text-desc {
        font-size: 13px;
    }
}
</style>
