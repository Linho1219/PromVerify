<script setup lang="ts">
import Numpad from "@/components/Numpad.vue";
import Card from "@/components/InfoCard.vue";
import { ref, computed } from "vue";
import _ from "lodash";
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

function xhrGet(link: string): string {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", link, false);
  xhr.send(null);
  if (xhr.status === 200) return xhr.responseText;
  else {
    throw xhr.status;
  }
}

let current = ref(""),
  delay = ref(999),
  connectionCheck = false,
  connectionRetry = 0,
  connectionLost = ref(false);

let ws: WebSocket;
const HREF = window.location.href.match(/^https?:\/\/(.+)\/(index\.html)?/)![1];
const DataLink = `//${HREF}/data`;
let table = ref<Array<Person>>(JSON.parse(xhrGet(DataLink)));
const displayTable = computed(() =>
  table.value.filter(
    (person) =>
      person.id.match(current.value) !== null ||
      person.phone.match(current.value) !== null ||
      person.order.match(current.value) !== null
  )
);

function setUpWs() {
  ws = new WebSocket(`ws://${HREF}/socket`);

  ws.onmessage = (e) => {
    let msg = e.data;
    console.log("收到服务器响应", msg);
    if (msg === "%HEARTBEAT_CHECK") ws.send("%HEARTBEAT_REPLY");
    else if (msg === "%REFRESH_DATA") refreshData();
    else {
      msg = JSON.parse(msg);
      if (typeof msg.delay === "number") delay.value = msg.delay % 999;
      else {
        getPersonById(msg.id).isIn = msg.isIn;
        // this.search();
      }
    }
    connectionCheck = true;
    connectionRetry = 0;
  };
  ws.onopen = () => {
    if (connectionLost) {
      connectionLost.value = false;
      refreshData();
    }
    connectionCheck = true;
    connectionRetry = 0;
  };
}
setUpWs();
function refreshData() {
  table.value = JSON.parse(xhrGet(DataLink));
  // this.search();
}

const getUnion = (person: Person) =>
  person.union === false
    ? undefined
    : table.value.filter((item) => item.id === person.unionId)[0];

const getPersonById = (id: string) =>
  table.value.filter((item) => item.id === id)[0];

function handleToggle(id: string) {
  if (connectionRetry !== 0) return;
  let person = getPersonById(id);
  person.isIn = !person.isIn;
  ws.send(
    JSON.stringify({
      id: id,
      isIn: person.isIn,
    })
  );
  console.log("toggle:", person.id, person.isIn);
}
function handleSearch(key: string) {
  current.value = key;
}
</script>

<template>
  <div id="infoView">
    <div id="infoDisplay">
      <Card
        v-for="item of displayTable"
        :person="item"
        :unionPerson="getUnion(item)"
        :highlight="current"
        @toggleIn="handleToggle"
      ></Card>
    </div>
    <Numpad @search="handleSearch"></Numpad>
  </div>
</template>

<style>
#infoView {
  display: flex;
  height: 100%;
}
#infoDisplay {
  flex-grow: 1;
  padding: 0 15px 15px 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  overflow: scroll;
}
</style>
