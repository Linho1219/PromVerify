<script setup lang="ts">
import HomeButton from "../components/HomeButton.vue";
</script>

<template>
  <div class="homeBtns">
    <RouterLink to="/import"
      ><HomeButton color="green" icon="&#xE8F4;"
        >导入新数据</HomeButton
      ></RouterLink
    ><RouterLink to="/info"
      ><HomeButton color="blue" icon="&#xE78C;"
        >使用原数据</HomeButton
      ></RouterLink
    >
  </div>
</template>

<style>
.homeBtns{
  display:flex;justify-content: center; align-items:center;
  height:60%;
}
</style>
