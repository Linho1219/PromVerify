const PORT = 6286;
const DATA_PATH = "./data/data.json";

import express from "express";
import ViteExpress from "vite-express";
import expressWs from "express-ws";
import fs from "fs";
import WebSocket from "ws";

const expressServer = express();
const wsServer = expressWs(expressServer);
const app = wsServer.app;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface Person {
  name: string; //姓名
  id: string; //身份证号-主值
  phone: string; //手机号
  school: string; //学校
  union: boolean; //是否联票
  isIn: boolean; //是否入场
  unionId?: string; //联票另一个人的ID
  order: string; //单号
}

let sockets: Array<SocketConnection> = [];

const newSocketID = (function closureGenerator() {
  let socketID = 0;
  return function newSocketID() {
    socketID %= 114514;
    return socketID++;
  };
})();

class SocketConnection {
  readonly id: number;
  readonly ws: WebSocket;
  aliveStatus: boolean;
  aliveRetryCount: number;
  connectionDelay: Date;
  private readonly aliveTimer: NodeJS.Timeout;
  private callback?: Function;
  constructor(ws: WebSocket, callback?: Function) {
    this.id = newSocketID();
    // console.log(this.id, "已连接");
    this.ws = ws;
    if (typeof callback === "function") this.callback = callback;
    ws.on("close", () => this.close());
    this.aliveStatus = true;
    this.aliveRetryCount = 0;
    this.connectionDelay = new Date();
    this.aliveTimer = setInterval(() => {
      if (!this.aliveStatus)
        if (++this.aliveRetryCount <= 3) {
          // console.log(this.id, "连接超时，重试次数", this.aliveRetryCount);
        } else {
          // console.log(this.id, "连接超时，已关闭");
          this.close();
          return;
        }
      this.connectionDelay = new Date();
      this.send("%HEARTBEAT_CHECK");
      this.aliveStatus = false;
    }, 5000);
    this.ws.on("message", (msg: string) => {
      if (msg === "%HEARTBEAT_REPLY") {
        this.aliveStatus = true;
        this.send(
          JSON.stringify({
            delay: Number(new Date()) - Number(this.connectionDelay),
          })
        );
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
  send(message: string) {
    return this.ws.send(message);
  }
  listen(callback: Function) {
    if (typeof callback !== "function") console.error("回调设置失败", callback);
    else this.callback = callback;
  }
  static sendToAll = function (
    msg: string,
    config?: { to?: Array<number>; except?: Array<number> }
  ): void {
    if (typeof config === "object")
      if (Array.isArray(config.to))
        sockets
          .filter((item) => config.to!.includes(item.id))
          .forEach((item) => item.send(msg));
      else if (Array.isArray(config.except))
        sockets
          .filter((item) => !config.to!.includes(item.id))
          .forEach((item) => item.send(msg));
      else sockets.forEach((item) => item.send(msg));
  };
}

const readFile = () => fs.readFileSync(DATA_PATH, { encoding: "utf-8" });
const writeFile = (content: string | object) => {
  if (typeof content === "undefined") {
    console.error("nothing to write");
    return;
  }
  fs.writeFileSync(
    DATA_PATH,
    typeof content === "string" ? content : JSON.stringify(content)
  );
};
const updateLocal = () => writeFile(JSON.stringify(table));

let table: Array<Person>;
try {
  table = JSON.parse(readFile());
  console.log("配置载入成功");
} catch {
  table = [];
  console.log("未找到配置文件，已新建");
  updateLocal();
}

app.get("/data", (_req: any, res: any) => {
  res.send(JSON.stringify(table));
});

app.put("/data", (req: any, res: any) => {
  let data = req.body;
  // console.log(data);
  res.send("Update received.");
  if (data.config.cover) {
    table = data.content;
    console.log("服务端数据已重置");
  } else {
    data.content.forEach((person: Person) => {
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

app.ws("/socket", (ws: WebSocket) => {
  sockets.push(
    new SocketConnection(ws, (msg: string, id: number) => {
      let change = JSON.parse(msg);
      // console.log(change);
      table.filter(({ id }) => id === change.id)[0].isIn = change.isIn;
      SocketConnection.sendToAll(msg, { except: [id] });
      updateLocal();
    })
  );
});

ViteExpress.listen(expressServer, PORT, () =>
  console.log("服务器启动，端口", PORT)
);
