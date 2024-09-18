<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue";
defineProps<{
  union: boolean;
  isIn: boolean;
}>();
</script>
<template>
  <div class="personDiv">
    <span class="logo icon">{{ union ? "\uF168" : "\uE136" }}</span>
    <span class="go" :class="isIn ? 'in' : 'out'"
      ><i class="icon">&#xE17C;</i></span
    >
    <span class="name personInfo">林洪平</span>
    <span v-if="union" class="unionInfo in">
      <span class="unionName">张诗涵</span>
    </span>
    <span class="pinyin personInfo">
      <span class="gender">Mr </span>
      linhongping</span
    >
    <span class="school personInfo">福州一中</span>
    <span class="phone personInfo">15859103180</span>
    <span class="id personInfo">350102200512190114</span>
    <span class="order personInfo">011234</span>
  </div>
</template>
<style scoped>
.personDiv {
  margin: 10px;
  padding: 15px 15px 15px 60px;
  position: relative;
  flex-grow: 1;
	min-width: 150px;

  border-radius: 10px;
  background: #1f1f1f;
  border: #444 3px solid;

  transition: border 0.15s;
}

.personDiv.in {
  border-color: var(--greenA);
}

.personDiv.out {
  border-color: var(--redA);
}

.personDiv .logo {
  position: absolute;
  left: 15px;

  font-size: 30px;
}

.personDiv .go {
  display: block;
  position: absolute;
  left: 15px;
  bottom: 15px;
  width: 30px;

  font-size: 20px;
  transition: color 0.15s;
}

.personDiv .go.in i {
  color: var(--green);
}

.personDiv .go.out i {
  color: var(--red);
}

.personDiv .go::before,
.personDiv .go::after {
  content: "";
  position: absolute;

  height: 30px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  transform: rotate(53deg) translate(-3px, -1px);
  transition: background 0.15s;
}

.personDiv .go::before {
  width: 6px;
  background: #1f1f1f;
}

.personDiv .go::after {
  width: 2px;
  background: var(--red);
  border-radius: 2px;
}

.personDiv .go.in::before,
.personDiv .go.in::after {
  background: transparent;
}

.personDiv .personInfo {
  display: block;
  text-align: left;
  color: #fffa;
  font-size: 16px;
}

.personInfo.name {
  font-size: 22px;
  font-weight: 500;
  color: white;
  line-height: 30px;
}

.personDiv .unionInfo {
  position: absolute;
  top: 15px;
  right: 15px;
  display: inline-flex;
  flex-direction: column;
  height: 30px;
  width: 50px;
  text-align: right;
  font-weight: normal;
}

.personDiv .unionInfo::before {
  content: "\F126";
  position: absolute;
  left: -10px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  font-family: SegoeIcons;
  font-size: 8px;
  height: 8px;
  line-height: 8px;
}

.personDiv .unionInfo.out::before {
  color: var(--red);
}

.personDiv .unionInfo.in::before {
  content: "\F127";
  color: var(--green);
}

.personDiv .unionInfo .unionName {
  font-size: 15px;
  /* line-height: 15px; */
  line-height: 30px;
}

/* .personDiv .unionInfo .unionId {
  font-family: monospace;
  font-size: 13px;
  line-height: 18px;
  color:#fffa
} */

.personInfo mark {
  padding: 0 1px;
  margin: 0 -1px;
  background: #ff05;
  box-shadow: #ff08 0 0 0 2px;
  color: white;
  font-weight: bold;
  border-radius: 3px;
}

.personInfo::before {
  display: inline-block;
  position: relative;
  font-family: SegoeIcons;
  margin-right: 4px;
  top: 2px;
}

.personInfo.pinyin {
  position: relative;
  margin-bottom: 3px;
  font-size: 14px;
  color: #eee;
}

.personInfo.pinyin .gender {
  font-weight: bold;
}

.personInfo.school::before {
  content: "\E821";
}

.personInfo.phone::before {
  content: "\E717";
}
.personInfo.id::before {
  content: "\E963";
}
.personInfo.order::before {
  content: "\EC5A";
}

.personInfo.id,
.personInfo.phone,
.personInfo.order {
  font-family: monospace;
}
</style>