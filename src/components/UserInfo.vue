<script setup lang="ts">
defineProps<{
  nickname: string
  mobile: string
  email: string
  desc: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="latte">hello world!</h1>
  </div>
  <div>
    <h3>
      你好！欢迎访问我的个人网站
    </h3>
    <h3>
    可了解我的技术栈和工作经历
    </h3>
  </div>
  <div class="divider-line"></div>
  <div style="padding-right: 8px; padding-bottom: 8px;">
    <h4>个人信息：</h4>
    <h4>姓名：<span style="color: gray;">谭先生</span></h4>
    <h4>现居住地：<span style="color: gray;">广东佛山顺德大良</span></h4>
  </div>
  <div >
    <h4>联系方式：</h4>
    <h4>
      手机号：<span style="color: gray;">13288447064</span>
    </h4>
    <h4>
      邮箱：<span style="color: gray;">511979003@qq.com</span>
    </h4>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

/* 基础下划线样式 */
.divider-line {
  width: 100%; /* 宽度可自定义，比如 80% */
  height: 1px; /* 分割线粗细 */
  background-color: #8B4513; /* 咖啡色系，可替换为你的RGB/十六进制色 */
  margin: 16px 0; /* 上下间距，适配布局 */
}

</style>