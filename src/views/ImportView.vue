<script setup lang="ts">
import { RouterLink } from "vue-router";
import Icon from "../components/tiny/FluentIcon.vue";
import UploadButton from "../components/UploadButton.vue";
let rawText: string;
</script>

<template>
  <textarea v-model.trim="rawText" id="uploadTextbox"></textarea>
  <div class="uploadBtns">
    <UploadButton color="green" icon="&#xF78C;"> 追加配置 </UploadButton>
    <UploadButton color="yellow" icon="&#xE822;"> 覆盖配置 </UploadButton>
    <RouterLink to="/"
      ><UploadButton color="red" icon="&#xF78A;">
        退出编辑
      </UploadButton></RouterLink
    >
  </div>
</template>

<style scoped>
textarea {
  display: block;
  position: absolute;
  top: 60px;
  left: 100px;
  right: 100px;
  bottom: 200px;
  padding: 15px;
  margin:0 auto;
  max-width: 1000px;
  background: none;
  border: #222 3px solid;
  background:#222;
  outline: none;
  resize: none;
  font-size: 18px;
  border-radius: 10px;
  cursor: text;
}
.uploadBtns {
  position: absolute;
  left:0;
  right:0;
  bottom:100px;
  width:600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  margin: auto;
}
</style>
