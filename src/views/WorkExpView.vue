<script setup lang="ts">

import WelcomeItem from "@/components/WelcomeItem.vue";
import DocumentationIcon from '@/components/icons/IconDocumentation.vue'
import ToolingIcon from '@/components/icons/IconTooling.vue'
import EcosystemIcon from '@/components/icons/IconEcosystem.vue'
import CommunityIcon from '@/components/icons/IconCommunity.vue'
import SupportIcon from '@/components/icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

defineProps<{
  skills: string
}>()

</script>

<template>
  <main>
    <WelcomeItem>
      <template #icon>
        <i class="pi pi-search" style="font-size: 1.3rem" ></i>
      </template>
      <template #heading>2018 - 2023 <a href="http://www.33bus.com" target="_blank">搜众网络科技有限公司</a></template>
      <span style="color: gray;">主导公司 SaaS 平台核心项目开发，基于 PHP7.4 和 thinkphp6 开发，覆盖建站、小程序、视频号商城等 6 大产品。
        <br />
        支撑企业用户互联网工具需求，负责主站功能迭代与数据库维护，通过性能优化保障数据安全性与系统稳定性，提升用户体验。
        <br />
        独立开发小程序管理后台，涵盖电商运营、用户管理、营销活动、数据统计等核心模块，助力业务高效拓展。</span>
      <br />
      
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <i class="pi pi-desktop" style="font-size: 1.3rem" ></i>
      </template>
      <template #heading>2017 - 2018 <a>科大网络有限公司</a></template>
      <span style="color: gray;">独立负责 外包项目的后端全流程开发，涵盖 CIC 项目、到会平台、师任堂网站等核心业务场景。
        <br />
        基于 Laravel 框架搭建高可用后台管理系统及标准化 RESTful API 接口。
        <br />
        主导数据库设计与技术架构搭建，梳理业务逻辑并转化为高效数据模型，全程把控项目进度、质量与风险，确保所有项目按时交付，且核心功能精准满足客户业务需求。</span>
      <br />
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <i class="pi pi-car" style="font-size: 1.3rem" ></i>
      </template>
      <template #heading>2015 - 2017 <a>小将军童车实业有限公司</a></template>
      <span style="color: gray;">负责公司网站的后台管理，确保系统稳定运行，并进行日常维护，优化性能，提高用户体验。
        <br/>
        设计和实现公司网站的 API 接口，确保数据的准确传输和高效交互，支持前端应用的开发和用户数据的处理。</span>
      <br />
    </WelcomeItem>

  </main>

</template>
