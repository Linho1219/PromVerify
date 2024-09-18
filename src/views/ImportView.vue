<script setup lang="ts">
import { RouterLink } from "vue-router";
import Icon from "../components/tiny/FluentIcon.vue"
let rawText:string;
</script>

<template>
  <textarea v-model.trim="rawText" id="uploadTextbox"></textarea>
  <div class="uploadBtns">
    <button id="uploadConfirm" class="uploadBtn">
      <Icon>&#xF78C;</Icon> 添加配置
    </button>
    <button id="uploadCover" class="uploadBtn">
      <Icon>&#xE822;</Icon> 覆盖配置
    </button>
    <button id="uploadCancel" class="uploadBtn">
      <Icon>&#xF78A;</Icon> 
    </button>
  </div>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/info">About</RouterLink>
    <RouterLink to="/import">import</RouterLink>
  </nav>
</template>

<style></style>
