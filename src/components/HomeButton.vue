<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue";
defineProps<{
  color: string;
  icon: string;
}>();
</script>

<template>
  <button class="homeBtn" :class="color">
    <Icon>{{ icon }}</Icon>
    <slot>无标题按钮</slot>
  </button>
</template>

<style scoped>
@import url("../assets/button_color.css");

.homeBtn {
  display: inline-block;
  height: 200px;
  width: 300px;
  margin: 20px;
  font-size: 20px;
  color: white;
  background: var(--bkgColor);
  border: 3px solid var(--bdrColor);
  border-radius: 10px;
}
.homeBtn .icon {
  display: block;
  margin-bottom: 20px;
  font-size: 50px;
}

.homeBtn:hover {
  color: var(--btnColor);
  border-color: var(--btnColor);
}

.homeBtn:hover:active {
  filter: brightness(0.5);
  border-color: var(--bdrColor);
}
</style>
