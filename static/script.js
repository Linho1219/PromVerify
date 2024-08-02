"use strict";

const { pinyin } = pinyinPro;

const PersonAttrNames = [
  "name",
  "id",
  "phone",
  "school",
  "union",
  "in",
  "unionName",
  "unionId",
  "order",
];
let HREF = window.location.href.match(/^https?:\/\/(.+)\/(index\.html)?$/)[1];
let DataLink = `//${HREF}/data`;
const SearchAttrNames = ["phone", "id", "order"];
let connectionCheck = false,
  connectionRetry = 0,
  connectionLost = false;

let ws = null;

function cpyPerson(original, target, hightlight) {
  let output = {};
  for (let attr of PersonAttrNames) {
    if (typeof target !== "undefined" && SearchAttrNames.indexOf(attr) !== -1)
      output[attr] = original[attr].replace(
        hightlight,
        `<mark>${hightlight}</mark>`
      );
    else output[attr] = original[attr];
  }
  output.originalId = original.id;
  return output;
}
function id2_18(id) {
  return id.length < 18 ? id + "-".repeat(18 - id.length) : id;
}
function noBrackets(text) {
  if (typeof text === "string") return text.replace(/（.+）/, "");
  else {
    console.error("去括号失败：" + text);
    return text;
  }
}
function xhrGet(link) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", link, false);
  xhr.send(null);
  if (xhr.status === 200) return xhr.responseText;
  else {
    console.error(xhr.status);
    return null;
  }
}
function xhrPut(link, content) {
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", link, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(content);
  if (xhr.status === 200) return xhr.responseText;
  else {
    console.error(xhr.status);
    return null;
  }
}
function excel2Obj(input) {
  let output = [];
  let NAME, ID, PHONE, SCHOOL, UNION, NAME2, ID2, SCHOOL2, PHONE2, ORDER;
  input = input.split("\n");
  for (let raw of input) {
    let items = raw.split("\t");
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
    } else if (typeof NAME === "undefined") continue;
    if (items[0] === "") continue;
    if (items[0].match("由麦客CRM提供技术支持") !== null) break;
    console.log("录入记录");
    if (items[UNION] === "购买单人票") {
      output.push({
        name: noBrackets(items[NAME]),
        id: id2_18(items[ID]),
        phone: items[PHONE],
        school: noBrackets(items[SCHOOL]),
        union: false,
        unionName: null,
        unionId: null,
        order: items[ORDER],
        in: false,
      });
    } else {
      output.push({
        name: noBrackets(items[NAME]),
        id: id2_18(items[ID]),
        phone: items[PHONE],
        school: noBrackets(items[SCHOOL]),
        union: true,
        unionName: noBrackets(items[NAME2]),
        unionId: id2_18(items[ID2]),
        order: items[ORDER],
        in: false,
      });
      output.push({
        name: noBrackets(items[NAME2]),
        id: id2_18(items[ID2]),
        phone: items[PHONE2],
        school:
          items[SCHOOL2] === "（同购票人学校）"
            ? noBrackets(items[SCHOOL])
            : noBrackets(items[SCHOOL2]),
        union: true,
        unionName: noBrackets(items[NAME]),
        unionId: id2_18(items[ID]),
        order: items[ORDER],
        in: false,
      });
    }
  }
  console.log(output);
  return output;
}

const App = {
  data() {
    return {
      notLogin: true,
      current: "",
      fullscreen: false,
      numBtn: [1, 2, 3, 4, 5, 6, 7, 8, 9, "X", 0, "C"],
      table: [],
      result: [],
      personInCount: 0,
      personOutCount: 0,
      uploading: false,
      rawText: "",
      delay: 999,
    };
  },
  methods: {
    fs() {
      if (this.fullscreen) document.exitFullscreen();
      else document.getElementById("body").requestFullscreen();
      this.fullscreen ^= 1;
    },
    py(name) {
      name = pinyin(name, { mode: "surname" });
      name = name.charAt(0).toUpperCase() + name.slice(1);
      return name;
    },
    uploadConfirm(cover) {
      if (cover && !confirm("确定覆盖服务器全部配置？")) return;
      xhrPut(
        DataLink,
        JSON.stringify({
          config: {
            cover: cover ? true : false,
          },
          content: excel2Obj(this.rawText),
        })
      );
      this.rawText = "导入成功";
    },
    useReady() {
      this.table = JSON.parse(xhrGet(DataLink));
      this.cls();
      this.notLogin = false;
      let setUpWs = () => {
        ws = new WebSocket(`ws://${HREF}/socket`);

        ws.onmessage = (e) => {
          let msg = e.data;
          console.log("收到服务器响应", msg);
          if (msg === "%HEARTBEAT_CHECK") ws.send("%HEARTBEAT_REPLY");
          else if (msg === "%REFRESH_DATA") this.refreshData();
          else {
            msg = JSON.parse(msg);
            if (typeof msg.delay === "number") this.delay = msg.delay % 999;
            else {
              this.queryById(msg.id).in = msg.in;
              this.search();
            }
          }
          connectionCheck = true;
          connectionRetry = 0;
        };

        ws.onopen = () => {
          if (connectionLost) {
            connectionLost = false;
            this.refreshData();
          }
          connectionCheck = true;
          connectionRetry = 0;
        };
      };
      setUpWs();
      setTimeout(() => {
        setInterval(() => {
          if (!connectionLost) {
            if (!connectionCheck) {
              if (++connectionRetry <= 1) {
                this.delay = 999;
                console.log("服务器连接丢失，重试次数", connectionRetry);
              } else {
                connectionLost = true;
                connectionRetry = 0;
                console.log(
                  "服务器连接丢失，尝试重新建立连接，重试次数",
                  connectionRetry++
                );
                this.delay = "LOST";
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
    },
    refreshData() {
      this.table = JSON.parse(xhrGet(DataLink));
      this.search();
    },
    numkey(num) {
      if (num !== "C" && this.current.length < 6) {
        this.current += String(num);
        this.search();
      } else {
        this.cls();
      }
    },
    cls() {
      this.current = "";
      this.result = this.table;
      let pIn = 0,
        pOut = 0;
      for (let person of this.table) {
        if (person.in) pIn++;
        else pOut++;
      }
      this.personInCount = pIn;
      this.personOutCount = pOut;
    },
    search(val) {
      if (typeof val === "string" && val.length <= 6 && val.length > 0)
        this.current = val;
      let arr = [],
        pIn = 0,
        pOut = 0;
      if (this.current === "") {
        this.cls();
        return;
      }
      for (let person of this.table) {
        if (person.in) pIn++;
        else pOut++;
        for (let attr of SearchAttrNames) {
          if (
            typeof person[attr] === "string" &&
            person[attr].match(this.current) !== null
          ) {
            arr.push(cpyPerson(person, attr, this.current));
            break;
          }
        }
      }
      this.result = arr;
      this.personInCount = pIn;
      this.personOutCount = pOut;
    },
    personIn: _.throttle(function (id) {
      if (connectionRetry !== 0) return;
      ws.send(
        JSON.stringify({
          id: id,
          in: (this.queryById(id).in ^= true),
        })
      );
      this.search();
    }, 500),

    queryById(id) {
      for (let person of this.table) {
        if (person.id === id) return person;
      }
      console.error(`queryById: ${id} not found`);
    },
  },
};
window.onload = () => {
  Vue.createApp(App).mount("#body");
};
