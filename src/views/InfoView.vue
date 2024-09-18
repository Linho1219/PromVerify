<script setup lang="ts">
import Numpad from "@/components/Numpad.vue";
import InfoCard from "@/components/InfoCard.vue";
let value = "------";
</script>

<template>
  <div id="infoView">
    <div id="infoDisplay">
      <InfoCard :union="true" :isIn="true"></InfoCard>
    </div>
    <Numpad></Numpad>
  </div>
</template>

<style scoped>
#infoView{
  display:flex
}
</style>
