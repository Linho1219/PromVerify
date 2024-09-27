<script setup lang="ts">
import Numpad from "@/components/Numpad.vue";
import Card from "@/components/InfoCard.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import _ from "lodash";
import emitter from "../mitt";

onMounted(() => {
  emitter.emit("on-toogle-info", true);
});
onUnmounted(() => {
  emitter.emit("on-toogle-info", false);
});

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

let current = ref(""),
  connectionCheck = false,
  connectionRetry = 0,
  connectionLost = false,
  heartbeatTimer: number;

let ws: WebSocket;
const HREF = window.location.href.match(/^https?:\/\/(.+)\/(index\.html)?/)![1];
const DataLink = `//${HREF}/data`;

const getRemoteData = () => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", DataLink, false);
  xhr.send(null);
  if (xhr.status === 200) return JSON.parse(xhr.responseText);
  else {
    throw xhr.status;
  }
};
let table = ref<Array<Person>>(getRemoteData());

emitter.emit("on-refresh-counter", {
  inCount: table.value.filter((person) => person.isIn).length,
  outCount: table.value.filter((person) => !person.isIn).length,
});
const displayTable = computed(() =>
  table.value.filter(
    ({ id, phone, order }) =>
      id.match(current.value) !== null ||
      phone.match(current.value) !== null ||
      order.match(current.value) !== null
  )
);

function setUpWs() {
  ws = new WebSocket(`ws://${HREF}/socket`);

  ws.onmessage = (e) => {
    let msg = e.data;
    console.log("收到服务器响应", msg);
    if (msg === "%HEARTBEAT_CHECK") ws.send("%HEARTBEAT_REPLY");
    else if (msg === "%REFRESH_DATA") table.value = getRemoteData();
    else {
      msg = JSON.parse(msg);
      if (typeof msg.delay === "number") {
        emitter.emit("on-refresh-delay", msg.delay % 999);
      } else {
        getPersonById(msg.id).isIn = msg.isIn;
      }
    }
    connectionCheck = true;
    connectionRetry = 0;
  };

  if (typeof heartbeatTimer === "undefined")
    heartbeatTimer = setTimeout(() => {
      console.log("心跳计时器启动");
      setInterval(() => {
        if (!connectionLost) {
          if (!connectionCheck) {
            if (++connectionRetry <= 1) {
              emitter.emit("on-refresh-delay", 999);
              console.log("服务器连接丢失，重试次数", connectionRetry);
            } else {
              connectionLost = true;
              connectionRetry = 0;
              console.log(
                "服务器连接丢失，尝试重新建立连接，重试次数",
                connectionRetry++
              );
              emitter.emit("on-refresh-delay", -1);
              setUpWs();
            }
          }
          connectionCheck = false;
        } else {
          console.log(
            "服务器连接丢失，尝试重新建立连接，重试次数",
            connectionRetry++
          );
          setUpWs();
        }
      }, 5000);
    }, 2500);

  ws.onopen = () => {
    if (connectionLost) {
      connectionLost = false;
      table.value = getRemoteData();
    }
    connectionCheck = true;
    connectionRetry = 0;
  };
}
setUpWs();

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
  emitter.emit("on-refresh-counter", {
    inCount: table.value.filter((person) => person.isIn).length,
    outCount: table.value.filter((person) => !person.isIn).length,
  });
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
