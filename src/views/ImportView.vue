<template>
  <textarea v-model.trim="rawText" id="uploadTextbox"></textarea>
  <div class="uploadBtns">
    <UploadButton @click="uploadConfirm(false)" color="green" icon="&#xF78C;"> 追加配置 </UploadButton>
    <UploadButton @click="uploadConfirm(true)" color="yellow" icon="&#xE822;"> 覆盖配置 </UploadButton>
    <RouterLink to="/"
      ><UploadButton color="red" icon="&#xF78A;">
        退出编辑
      </UploadButton></RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
// import Icon from "../components/tiny/FluentIcon.vue";
import UploadButton from "../components/UploadButton.vue";
let rawText = ref("");

// import $ from 'jquery';
const HREF = window.location.href.match(
  /^https?:\/\/([^\/]+)\/(index\.html)?/
)![1];
const DataLink = `//${HREF}/data`;

const PersonAttrNames = [
  "name",
  "id",
  "phone",
  "school",
  "union",
  "isIn",
  "unionName",
  "unionId",
  "order",
];

function xhrGet(link: string) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", link, false);
  xhr.send(null);
  if (xhr.status === 200) return xhr.responseText;
  else throw xhr.status;
}
function xhrPut(link: string, content: string) {
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", link, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(content);
  if (xhr.status === 200) return xhr.responseText;
  else throw xhr.status;
}
const noBrackets = (text: string) => text.replace(/（.+）/, "");

function excel2Obj(input: string) {
  let output = [];
  let NAME = -1,
    ID = -1,
    PHONE = -1,
    SCHOOL = -1,
    UNION = -1,
    NAME2 = -1,
    ID2 = -1,
    SCHOOL2 = -1,
    PHONE2 = -1,
    ORDER = -1;
  let arr: Array<string> = input.split("\n");
  for (let raw of arr) {
    let items: Array<string> = raw.split("\t");

    if (items[0] === "") continue;

    if (items[0] === "序号") {
      NAME = items.indexOf("购票人姓名");
      ID = items.indexOf("购票人身份证号");
      PHONE = items.indexOf("购票人手机号码");
      SCHOOL = items.indexOf("购票人毕业学校");
      UNION = items.indexOf("是否购买双人票？");
      NAME2 = items.indexOf("舞伴姓名");
      ID2 = items.indexOf("舞伴身份证号");
      PHONE2 = items.indexOf("舞伴手机号码");
      SCHOOL2 = items.indexOf("舞伴毕业学校");
      ORDER = items.indexOf("随机码");
      console.log("表头读取成功");
      continue;
    } else if (NAME === -1) continue;

    if (items[0].match("由麦客CRM提供技术支持") !== null) break;

    console.log("录入记录");
    if (items[UNION] === "购买单人票") {
      output.push({
        name: noBrackets(items[NAME]),
        id: items[ID].padEnd(18, "-"),
        phone: items[PHONE],
        school: noBrackets(items[SCHOOL]),
        union: false,
        unionName: null,
        unionId: null,
        order: items[ORDER],
        isIn: false,
      });
    } else {
      output.push({
        name: noBrackets(items[NAME]),
        id: items[ID].padEnd(18, "-"),
        phone: items[PHONE],
        school: noBrackets(items[SCHOOL]),
        union: true,
        unionName: noBrackets(items[NAME2]),
        unionId: items[ID2].padEnd(18, "-"),
        order: items[ORDER],
        isIn: false,
      });
      output.push({
        name: noBrackets(items[NAME2]),
        id: items[ID2].padEnd(18, "-"),
        phone: items[PHONE2],
        school:
          items[SCHOOL2] === "（同购票人学校）"
            ? noBrackets(items[SCHOOL])
            : noBrackets(items[SCHOOL2]),
        union: true,
        unionName: noBrackets(items[NAME]),
        unionId: items[ID].padEnd(18, "-"),
        order: items[ORDER],
        isIn: false,
      });
    }
  }
  console.log(output);
  return output;
}

function uploadConfirm(cover: boolean) {
  if (cover && !confirm("确定覆盖服务器全部配置？")) return;
  xhrPut(
    DataLink,
    JSON.stringify({
      config: {
        cover: cover ? true : false,
      },
      content: excel2Obj(rawText.value),
    })
  );
  rawText.value = "导入成功";
}
</script>

<style>
textarea {
  display: block;
  position: absolute;
  top: 60px;
  left: 100px;
  right: 100px;
  bottom: 200px;
  padding: 15px;
  margin: 0 auto;
  max-width: 1000px;
  background: none;
  border: #222 3px solid;
  background: #222;
  outline: none;
  resize: none;
  font-size: 18px;
  border-radius: 10px;
  cursor: text;
}
.uploadBtns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
  width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  margin: auto;
}
</style>
