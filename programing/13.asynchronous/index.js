import { EventEmitter } from "node:events";

function delay(ms, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(message);
      resolve(message);
    }, ms);
  });
}

const beberageMap = {
  1: "아메리카노",
  2: "라뗴",
  3: "보드카",
};

let list = [];
let 제조리스트 = [];

let currentProcessing = 0;
const MAX_CONCURRENT = 2;
let queue = [];

class MyServer extends EventEmitter {}

const server = new MyServer();

server.on("request", async (주문) => {
  console.log("주문요청 완료");

  const [음료번호, 개수] = 주문.split(":");

  const 음료이름 = beberageMap[음료번호];

  // 리스트에 업데이트
  server.emit("listUpdated", 음료이름, 개수);
});

// 업데이트 이벤트 등록
server.on("listUpdated", (음료이름, 개수) => {
  for (let i = 0; i < 개수; i++) {
    list.push(음료이름);
    queue.push(음료이름);
  }

  // // 리스트 출력
  console.log("주문목록: ", list);

  server.emit("제조중");
});

server.on("제조중", () => {
  processNext();
});

async function processNext() {
  if (currentProcessing >= MAX_CONCURRENT || queue.length === 0) return;

  const 음료이름 = queue.shift(); // 큐에서 하나 꺼냄

  currentProcessing++;

  await delay(2000, `${음료이름} 제조완료`);

  list.shift();

  currentProcessing--;

  // 처리 완료 후 다음 작업 수행
  processNext();
}

server.emit("request", "1:2");
server.emit("request", "1:1");
server.emit("request", "3:1");

setTimeout(() => {
  server.emit("request", "2:3");
}, 3000);

setTimeout(() => {
  server.emit("request", "1:1");
}, 3000);

setTimeout(() => {
  server.emit("request", "2:3");
}, 4000);
