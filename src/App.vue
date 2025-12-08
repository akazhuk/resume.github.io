<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Test from './components/Test.vue'

import { onMounted, ref } from "vue"
import { useSkillsStore } from "@/stores/skillsStore"
import axios from "axios"
import UserInfo from "@/components/UserInfo.vue"


const props = defineProps();
const avatar = ref();
const nickname = ref();
const mobile = ref();
const email = ref();
const desc = ref();
const gif = ref();

onMounted(async () => {
//   try {
//     const response = await axios.get(import.meta.env.VITE_BASE_URL + '/api/info');
//     console.log('response: ', response);
//     avatar.value = response.data.avatar;
//     nickname.value = response.data.nickname;
//     mobile.value = response.data.mobile;
//     email.value = response.data.email;
//     desc.value = response.data.desc;
//     gif.value = response.data.coding;

//   } catch (error) {
//     console.log('Erro fetching data: ', error);
//   }
})

</script>

<template>
  <header>
<!--    <img alt="Vue logo" class="logo" :src="avatar" width="125" height="125" />-->
    <div>
      <img alt="coding gif" class="logo" src="./images/coding.gif" width="125" height="125" />
    </div>
    <div class="wrapper">
      <UserInfo :nickname=nickname :mobile=mobile :email=email :desc=desc />
      <nav>
        <RouterLink to="/"> 主页 </RouterLink>
        <RouterLink to="/skills"> 技术栈 </RouterLink>
        <RouterLink to="/work_exp"> 工作经历 </RouterLink>
        <RouterLink to="/resume_file"> 简历附件 </RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  /* color: var(--color-text); */
  color: rgb(230, 204, 179);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
