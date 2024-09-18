<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue";
defineProps<{
  personInCount: string;
  personOutCount: string;
}>();
</script>

<template>
  <header id="uniHeader">
    <h1 id="uniTitle">
      <slot></slot>
    </h1>
    <span id="personIn">{{ personInCount }}</span>
    <span id="personOut">{{ personOutCount }}</span>
    <span id="delayTime">{{ 123 }}</span>
    <RouterLink to="/">
      <button class="goHome">
        <Icon>&#xE80F;</Icon>
      </button>
    </RouterLink>
  </header>
</template>

<style scoped>
#uniHeader {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 80px;
  vertical-align: middle;
}

#uniTitle {
  height: 80px;
  line-height: 80px;
  display: inline-block;
  padding-left: 30px;
  font-size: 30px;
  color: white;
}

#personIn,
#personOut,
#delayTime {
  display: inline-block;
  line-height: 80px;
  width: 80px;
  text-align: right;
  font-size: 20px;
  margin-left: 10px;
  font-family: monospace;
}

#personIn::after,
#personOut::after,
#delayTime::after {
  color: white;
  font-weight: normal;
  font-size: 15px;
  margin-left: 3px;
}

#personIn {
  color: var(--green);
}

#personIn::after {
  content: "在场";
}

#personOut {
  color: var(--orange);
}

#personOut::after {
  content: "缺席";
}

.goHome {
  display: block;
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 40px;
  line-height: 40px;
  background:transparent;
  border:none;
  font-size:18px;
  border-radius: 5px;
}

.goHome:hover{
  background:#444;
}

.goHome:active{
  background:#000;
}
</style>
