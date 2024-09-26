import express from "express";
import expressWs from "express-ws";
import ViteExpress from "vite-express";
import fs from "fs";

const PORT = 6286;
const app = express();
const DATA_PATH = "./data/data.json";
expressWs(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sockets = [];

const newSocketID = (function () {
  let socketID = 0;
  return function () {
    socketID %= 114514;
    return socketID++;
  };
})();

class SocketConnection {
  constructor(ws, callback) {
    this.id = newSocketID();
    console.log(this.id, "已连接");
    this.ws = ws;
    if (typeof callback === "function") this.callback = callback;
    ws.on("close", () => {
      this.close();
    });
    this.aliveStatus = true;
    this.aliveRetryCount = 0;
    this.connectionDelay = new Date();
    this.aliveTimer = setInterval(() => {
      if (!this.aliveStatus)
        if (++this.aliveRetryCount <= 3)
          console.log(this.id, "连接超时，重试次数", this.aliveRetryCount);
        else {
          console.log(this.id, "连接超时，已关闭");
          this.close();
          return;
        }
      this.connectionDelay = new Date();
      this.send("%HEARTBEAT_CHECK");
      this.aliveStatus = false;
    }, 5000);
    this.ws.on("message", (msg) => {
      if (msg === "%HEARTBEAT_REPLY") {
        this.aliveStatus = true;
        this.send(JSON.stringify({ delay: new Date() - this.connectionDelay }));
      } else if (typeof this.callback === "function")
        this.callback(msg, this.id);
    });
    this.send("%HEARTBEAT_CHECK");
  }
  close() {
    clearInterval(this.aliveTimer);
    sockets = sockets.filter((item) => {
      return item.id !== this.id;
    });
  }
  send(message) {
    return this.ws.send(message);
  }
  listen(callback) {
    if (typeof callback !== "function") {
      console.error("回调设置失败", callback);
      return;
    }
    this.callback = callback;
  }
}

SocketConnection.sendToAll = (msg, config) => {
  if (typeof config === "object") {
    if (Array.isArray(config.to)) {
      for (let item of sockets)
        if (config.to.indexOf(item.id) !== -1) item.send(msg);
    } else if (Array.isArray(config.except))
      for (let item of sockets)
        if (config.except.indexOf(item.id) === -1) item.send(msg);
  } else {
    for (let item of sockets) item.send(msg);
  }
};

const readFile = () => fs.readFileSync(DATA_PATH, { encoding: "utf-8" });
function writeFile(content) {
  // console.log("write");
  if (typeof content === "undefined") {
    console.error("nothing to write");
    return;
  }
  if (typeof content !== "string")
    fs.writeFileSync("./data/data.json", JSON.stringify(content));
  else fs.writeFileSync("./data/data.json", content);
}

function updateLocal() {
  writeFile(JSON.stringify(table));
}

let table = [];
try {
  table = JSON.parse(readFile());
  console.log("配置载入成功");
} catch {
  updateLocal();
  console.log("未找到配置文件，已新建");
}
console.log("配置载入成功");

app.get("/data", (_req, res) => {
  res.send(JSON.stringify(table));
});

app.put("/data", (req, res) => {
  let data = req.body;
  console.log(data);
  res.send("Update received.");
  if (data.config.cover) {
    table = data.content;
    console.log("服务端数据已重置");
  } else {
    data.content.forEach((person) => {
      for (let original of table) {
        if (person.id === original.id) {
          original = person;
          return;
        }
      }
      table.push(person);
    });
  }
  SocketConnection.sendToAll("%REFRESH_DATA");
  updateLocal();
});

app.ws("/socket", (ws, _req) => {
  sockets.push(
    new SocketConnection(ws, (msg, id) => {
      let change = JSON.parse(msg);
      console.log(change);
      table.filter((item) => item.id === change.id)[0].isIn = change.isIn;
      SocketConnection.sendToAll(msg, { except: [id] });
      updateLocal();
    })
  );
});

// ViteExpress.config({ mode: "production" })

ViteExpress.listen(app, PORT, () => console.log("服务器启动，端口", PORT));
