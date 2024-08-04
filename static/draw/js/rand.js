/* 抽号部分代码改自初中写的的抽号机 */

let HREF = window.location.href.match(
  /^https?:\/\/(.+)\/draw\/?(index\.html)?$/
)[1];
let DataLink = `//${HREF}/data`;

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

let table = JSON.parse(xhrGet(DataLink)).filter((item) => item.in);
table.push(
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "司徒梓睿", order: "999901" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "林可恩", order: "999904" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" },
  { name: "刘锦冰", order: "999914" }
);
table = table.sort(() => Math.random() - 0.5);

let nameArr = [""],
  numArr = [""];

for (let person of table) {
  nameArr.push(person.name);
  numArr.push(person.order);
}

window.onload = () => {
  document.getElementById("hand").innerHTML = "";
  document.getElementById("rytBTn").disabled = false;
};

let tot = nameArr.length - 1;
let isExcluded = {};

// for (let i = 0, l = excludedArr.length; i < l; i++) {
//   isExcluded[excludedArr[i]] = true;
// }

let string = "<span>------</span>";
for (let i = 1; i <= tot; i++) {
  string += `<span>${numArr[i]}</span>`;
}
document.getElementById("num").innerHTML = string;

let lastRand = -1;
function getRand() {
  let num = Math.floor(Math.random() * tot) + 1;
  while (numArr[num] == numArr[lastRand] || num == tot + 1 || isExcluded[num])
    num = Math.floor(Math.random() * tot) + 1;
  lastRand = num;
  return num;
}
let music = document.getElementById("music");
let dingdong = document.getElementById("dingdong");

function rand() {
  let num = getRand();
  document.getElementById("num").style.top = -num * 130 + "px";
  document.getElementById("name").style.opacity = "0";
  document.getElementById("rytBTn").disabled = true;
  music.play();
  setTimeout(() => {
    document.getElementById("name").style.display = "none";
    document.getElementById("name").style.opacity = "";
    document.getElementById("name").innerHTML = nameArr[num];
  }, 300);
  setTimeout(() => {
    document.getElementById("name").style.display = "";
    music.pause();
    music.currentTime = 0;
    dingdong.play();
    document.getElementById("rytBTn").disabled = false;
  }, 1500);
}

let rytBtn = document.getElementById("rytBTn");
rytBtn.addEventListener("animationend", function () {
  let shuibo = document.getElementsByClassName("js-ripple")[0];
  shuibo.classList.remove("is-active");
});

rytBtn.onmousedown = function (e) {
  let shuibo = document.getElementsByClassName("js-ripple")[0]; // 获取水波 DOM 元素
  let btnTop =
    (document.body.offsetHeight - 350) / 2 + shuibo.parentElement.offsetTop; // 按钮盒子距离浏览器窗口顶部距离
  let btnLeft =
    (document.body.offsetWidth - 600) / 2 + shuibo.parentElement.offsetLeft; // 按钮距离浏览器盒子窗口左侧距离

  let x = e.pageY - btnTop + 10;
  let y = e.pageX - btnLeft + 10;

  let bowen = document.getElementsByClassName("c-ripple__circle")[0];
  bowen.style.top = x + "px";
  bowen.style.left = y + "px";
  shuibo.classList.add("is-active");
};
