<script setup lang="ts">

import WelcomeItem from "@/components/WelcomeItem.vue";
import 'primeicons/primeicons.css'

import { onMounted, ref } from 'vue'
import axios from "axios";  // 引入 Store

const serverDevSkills = ref();
const clientDevSkills = ref();
const databaseSkills = ref();
const nosqlSkills = ref();
const serverSkills = ref();
const desc = ref();

// 在组件挂载后解析参数（确保路由已加载）
onMounted(async () => {
//   try {
//     const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/skills');
//     console.log('response: ', response);
//     serverDevSkills.value = response.data.server_dev_skills;
//     clientDevSkills.value = response.data.client_dev_skills;
//     databaseSkills.value = response.data.database_skills;
//     nosqlSkills.value = response.data.nosql_skills;
//     serverSkills.value = response.data.server_skills;
//     desc.value = response.data.desc;

//   } catch (error) {
//     console.log('Erro fetching data: ', error);
//   }
})

</script>

<template>
  <main>
    <WelcomeItem>
      <template #icon>
        <i class="pi pi-cog pi-spin" style="font-size: 2rem"></i>
      </template>
      <template #heading >后端技术栈</template>
      <!-- <h2>{{ serverDevSkills}}</h2> -->
       <h3 style="color: gray;">php7.4, thinkphp6, mysql, redis, nginx, linux</h3>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <i class="pi pi-sparkles" style="font-size: 2rem" ></i>
      </template>
      <template #heading>前端技术栈</template>
      <!-- <h2>{{ clientDevSkills }}</h2> -->
       <h3 style="color: gray;">html, js, css, vue, element-plus</h3>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <i class="pi pi-microchip-ai" style="font-size: 2rem"></i>
      </template>
      <template #heading>AI</template>
      <!-- <h2>{{ clientDevSkills }}</h2> -->
       <h3 style="color: gray;">python(pandas, numpy, sklearn)</h3>
       <h3 style="color: gray;">工具: cursor, copilot</h3>
    </WelcomeItem>

    <WelcomeItem>
      <template #icon>
        <i class="pi pi-align-justify" style="font-size: 2rem"></i>
      </template>
      <template #heading>其他</template>
      <!-- <h2>{{ desc }}</h2> -->
      <h3 style="color: gray;">遵循 PSR 代码规范，熟悉 RESTful API 设计风格。</h3>
      <h3 style="color: gray;">代码管理工具: git、svn</h3>
    </WelcomeItem>
  </main>

</template>
