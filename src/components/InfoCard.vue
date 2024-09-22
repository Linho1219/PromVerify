<script setup lang="ts">
import Icon from "./tiny/FluentIcon.vue";
import type { Person } from "@/views/InfoView.vue";
import { pinyin } from "pinyin-pro";
const props = defineProps<{
  person: Person;
  unionPerson?: Person;
  highlight?: string;
}>();
const emit = defineEmits<{
  (event: "toggleIn", id: string): void;
}>();
function handleClick() {
  console.log('emit')
  emit("toggleIn", props.person.id);
}
function markProp(input: string) {
  if (typeof props.highlight === "undefined" || props.highlight === "")
    return input;
  else return input.replace(props.highlight, `<mark>${props.highlight}</mark>`);
}
function getGenderFromId(id: string) {
  let digit = parseInt(id.charAt(16));
  if (isNaN(digit)) return "?";
  else return digit === 1 ? "Mr" : "Ms";
}
</script>
<template>
  <div
    class="personDiv"
    :class="person.isIn ? 'in' : 'out'"
    @click="handleClick"
  >
    <span class="logo icon">
      <Icon>{{ person.union ? "\uF168" : "\uE136" }}</Icon>
    </span>
    <span class="go"><Icon>&#xE17C;</Icon></span>
    <span class="name personInfo">{{ person.name }}</span>
    <span class="pinyin personInfo">
      <span class="gender">{{ getGenderFromId(person.id) }}</span>
      {{ pinyin(person.name, { surname: "head" }) }}
    </span>
    <span class="school personInfo">{{ person.school }}</span>
    <span class="phone personInfo" v-html="markProp(person.phone)"></span>
    <span class="id personInfo" v-html="markProp(person.id)"></span>
    <span class="order personInfo" v-html="markProp(person.order)"></span>

    <span
      v-if="person.union"
      class="unionInfo"
      :class="unionPerson?.isIn ? 'in' : 'out'"
    >
      <span class="unionName">{{ unionPerson?.name }}</span>
    </span>
  </div>
</template>
<style>
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
  border-color: var(--orangeA);
}

.personDiv .logo {
  position: absolute;
  left: 15px;

  font-size: 30px;
  color: white;
}

.personDiv .go {
  display: block;
  position: absolute;
  left: 15px;
  bottom: 15px;
  width: 30px;

  font-size: 20px;
  text-align: center;
  transition: color 0.15s;
}

.personDiv.in .go i {
  color: var(--green);
}

.personDiv.out .go i {
  color: var(--orange);
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
  background: var(--orange);
  border-radius: 2px;
}

.personDiv.in .go::before,
.personDiv.in .go::after {
  background: transparent;
}

.personDiv .personInfo {
  display: block;
  text-align: left;
  color: #fffa;
  font-size: 16px;
  line-height: 20px;
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
  color: var(--orange);
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

mark {
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
