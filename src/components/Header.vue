<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue";
import emitter from "../mitt";
import { ref } from "vue";
import { delay } from "lodash";
// defineProps<{
//   personInCount: string;
//   personOutCount: string;
// }>();
let infoState = ref(false),
  statInfo = ref({
    inCount: 0,
    outCount: 0,
    delay: 0,
    delayDisplay: "",
    lost: false,
  });
emitter.on("on-toogle-info", (state: boolean) => {
  infoState.value = state;
});
emitter.on("on-refresh-counter", ({ inCount, outCount }) => {
  statInfo.value.inCount = inCount;
  statInfo.value.outCount = outCount;
});
emitter.on("on-refresh-delay", (delay) => {
  statInfo.value.delay = delay;
  statInfo.value.lost = delay === -1;
  statInfo.value.delayDisplay = statInfo.value.lost ? "LOST" : String(delay);
});
</script>

<template>
  <header id="uniHeader">
    <h1 id="uniTitle">
      <slot></slot>
    </h1>
    <template v-if="infoState">
      <span id="personIn">{{ statInfo.inCount }}</span>
      <span id="personOut">{{ statInfo.outCount }}</span>
      <span
        id="delayTime"
        :class="
          (statInfo.delay > 600 ? 'yellow' : 'blue') +
          (statInfo.lost ? ' lost' : '')
        "
      >
        {{ statInfo.delayDisplay }}
      </span>
      <RouterLink to="/">
        <button class="goHome">
          <Icon>&#xE80F;</Icon>
        </button>
      </RouterLink>
    </template>
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
  width: 80px;
  text-align: right;
  font-size: 20px;
  margin-top: 10px;
  margin-left: 10px;
  font-family: monospace;
  animation: fade 0.3s;
}

#personIn::after,
#personOut::after,
#delayTime::after {
  display: inline-block;
  color: white;
  font-weight: normal;
  font-size: 15px;
  margin-left: 3px;
  transform: translateY(-1px);
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

#delayTime.blue {
  color: var(--blue);
}

#delayTime.yellow {
  color: var(--yellow);
}

#delayTime.lost {
  color: var(--red) !important;
  animation: shine 1s infinite;
}

#delayTime.lost::after {
  content: "" !important;
}

#delayTime::after {
  content: "延迟";
}

.goHome {
  display: block;
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 40px;
  line-height: 40px;
  background: transparent;
  border: none;
  font-size: 18px;
  border-radius: 5px;
}

.goHome:hover {
  background: #444;
}

.goHome:active {
  background: #000;
}
</style>
