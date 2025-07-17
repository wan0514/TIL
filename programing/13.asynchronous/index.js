import { EventEmitter } from "node:events";

function delay(ms, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(message);
      resolve(message);
    }, ms);
  });
}

let list = [];
let 제조리스트 = [];

let currentProcessing = 0;
const MAX_CONCURRENT = 2;
let queue = [];

class MyServer extends EventEmitter {}

const server = new MyServer();

server.on("request", async ({ data }) => {
  console.log("주문요청 완료");

  // 리스트에 업데이트
  server.emit("listUpdated", data);
});

// 업데이트 이벤트 등록
server.on("listUpdated", (data) => {
  list.push(data);
  // 리스트 출력
  console.log(list);

  server.emit("제조중", data);
});

server.on("제조중", async (숫자) => {
  queue.push(숫자);
  processNext();
});

async function processNext() {
  if (currentProcessing >= MAX_CONCURRENT || queue.length === 0) return;

  const 숫자 = queue.shift(); // 큐에서 하나 꺼냄
  currentProcessing++;

  await delay(2000, `${숫자} 제조완료`);

  currentProcessing--;

  // 처리 완료 후 다음 작업 수행
  processNext();
}

server.emit("request", { data: 1 });
server.emit("request", { data: 2 });
server.emit("request", { data: 3 });

setTimeout(() => {
  server.emit("request", { data: 4 });
}, 3000);

setTimeout(() => {
  server.emit("request", { data: 5 });
}, 3000);

setTimeout(() => {
  server.emit("request", { data: 6 });
}, 4000);
