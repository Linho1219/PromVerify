<script setup lang="ts">
import Numpad from "@/components/Numpad.vue";
import Card from "@/components/InfoCard.vue";
import { ref } from "vue";
export interface Person {
  name: string; //姓名
  id: string; //身份证号-主值
  phone: string; //手机号
  school: string; //学校
  union: boolean; //是否联票
  isIn: boolean; //是否入场
  unionId?: string; //联票另一个人的ID
  order: string; //单号
}

let array: Array<Person> = [
  {
    name: "林洪平",
    id: "350102200512190114",
    phone: "15859103180",
    school: "福州一中",
    union: true,
    isIn: true,
    unionId: "350102200566666666",
    order: "123456",
  },
  {
    name: "夏展鸿",
    id: "350102200566666666",
    phone: "15659103180",
    school: "福州一中",
    union: true,
    isIn: false,
    unionId: "350102200512190114",
    order: "123456",
  },
  {
    name: "张三",
    id: "666666666666666666",
    phone: "13600952018",
    school: "福州一中",
    union: false,
    isIn: false,
    order: "666666",
  },
];
</script>

<template>
  <div id="infoView">
    <div id="infoDisplay">
      <Card :person="array[0]" :unionPerson="array[1]" highlight="0318"></Card>
      <Card :person="array[1]" :unionPerson="array[0]"></Card>
      <Card :person="array[2]"></Card>
    </div>
    <Numpad></Numpad>
  </div>
</template>

<style>
#infoView {
  display: flex;
  height: 100%;
}
#infoDisplay{
  flex-grow: 1;
  padding: 0 15px 15px 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  overflow: scroll;
}
</style>
