<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue"
defineProps<{
  color: string;
  icon: string;
}>();
</script>

<template>
  <button class="uploadBtn" :class="color">
    <Icon>{{ icon }}</Icon>
    <slot>无标题按钮</slot>
  </button>
</template>

<style scoped>
@import url("../assets/button_color.css");

.uploadBtn {
  display: inline-block;
  padding:15px 30px;
  vertical-align: middle;
  font-size: 18px;
  color:white;
  background: var(--bkgColor);
  border: 3px solid var(--bdrColor);
  border-radius: 10px;
}

.uploadBtn .icon {
  display: inline-block;
  font-size: 20px;
  transform: translateY(2px);
}

.uploadBtn:hover {
  color: var(--btnColor);
  border-color: var(--btnColor);
}

.uploadBtn:hover:active {
  filter: brightness(0.5);
  border-color: var(--bdrColor);
}
</style>