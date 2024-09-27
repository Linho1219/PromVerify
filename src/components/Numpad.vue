<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import emitter from "../mitt";
const numBtn = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "X"];
let current = ref("");

const emit = defineEmits<{
  (event: "search", id: string): void;
}>();
function numkey(key: string) {
  if (key === "C") current.value = "";
  else if (current.value.length < 6) current.value += key;
  else current.value = "";
  emit("search", current.value);
}
const handleOrderSearch = (order: string) => {
  current.value = order;
  emit("search", order);
};

onMounted(() => {
  emitter.on("on-search-order", handleOrderSearch);
});

onUnmounted(() => {
  emitter.off("on-search-order", handleOrderSearch);
});
</script>

<template>
  <div id="numpad">
    <div id="current">
      {{ current.padStart(6, "-") }}
    </div>
    <div id="numkeys">
      <button v-for="caption in numBtn" class="keys" @click="numkey(caption)">
        {{ caption }}
      </button>
    </div>
  </div>
</template>

<style>
#numpad {
  flex-grow: 0;
  width: 340px;
  display: flex;
  flex-direction: column;
}

#current {
  display: block;
  height: 80px;
  margin: 10px 20px 20px 20px;
  width: 300px;
  line-height: 80px;
  font-size: 50px;
  text-align: center;
  font-family: monospace;
  letter-spacing: 5px;
  border-radius: 10px;
  background: #1f1f1f;
}
#numkeys {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  padding: 0 10px;
}

.keys {
  height: 80px;
  width: 80px;
  margin: 10px;
  margin-bottom: 20px;

  border-radius: 10px;
  background: #333;
  color: white;
  font-size: 25px;
  border: none;
}
</style>
