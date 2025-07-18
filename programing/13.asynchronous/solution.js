import { EventEmitter } from "node:events";

// --- 상수 및 전역/공유 상태 ---
// 메뉴판 (음료 번호와 정보 매핑)
const beverageMap = {
  1: { name: "아메리카노", time: 3000 },
  2: { name: "라떼", time: 5000 },
  3: { name: "프라푸치노", time: 10000 },
};

// --- 클래스 ---

// 1. 캐셔 (Cashier) 🧑‍💻
// 역할: 외부로부터 주문을 받고, 주문표(OrderQueue)에 주문 추가를 요청합니다.
class Cashier extends EventEmitter {
  constructor(eventEmitter) {
    super();
    this.eventEmitter = eventEmitter; // 공유 이벤트 버스 인스턴스
  }

  // 행동: 주문을 받아 'newOrder' 이벤트를 발생시켜 외부에 알립니다.
  receiveOrder(orderId, beverageNumber) {
    // 내부 로직 (주문 정보 생성 및 이벤트 발생)
    this.eventEmitter.emit("newOrder", { orderId, beverageNumber });
  }
}

// 2. 주문표 (OrderQueue) 📋
// 역할: 주문들이 순서대로 쌓이는 대기열을 관리하고, 매니저에게 다음 주문을 제공합니다.
class OrderQueue extends EventEmitter {
  constructor(eventEmitter) {
    super();
    this.eventEmitter = eventEmitter; // 공유 이벤트 버스 인스턴스
    this.queue = []; // 상태: 주문 객체들을 저장하는 배열
    this.lastOrderReceivedTime = Date.now(); // 상태: 마지막 주문이 추가된 시간 (시스템 종료 조건용)
  }

  // 행동: 새로운 주문을 큐의 끝에 추가합니다.
  addOrder(order) {
    // 내부 로직 (주문 추가 및 lastOrderReceivedTime 갱신)
    this.queue.push(order);
    this.lastOrderReceivedTime = Date.now();
  }

  // 행동: 큐의 맨 앞(가장 오래된) 주문을 반환하고 제거합니다. 큐가 비어있으면 null을 반환합니다.
  getNextOrder() {
    // 다음 주문 반환 및 제거
    const nextOrder = this.queue.shift();
    return nextOrder;
  }

  // 행동: 큐가 비어있는지 여부를 반환합니다.
  isEmpty() {
    //  큐 비어있는지 확인
    // 반환 : boolean
    return this.queue.length === 0;
  }

  // 행동: 마지막 주문이 추가된 시간을 반환합니다.
  getLastOrderTime() {
    // 시간 반환
    return this.lastOrderReceivedTime;
  }
}

// 3. 바리스타 (Barista) 👨‍🍳
// 역할: 음료를 제조하고, 제조의 시작과 완료를 외부에 알리는 이벤트를 발생시킵니다.
class Barista extends EventEmitter {
  constructor(eventEmitter, maxConcurrentDrinks) {
    super();
    this.eventEmitter = eventEmitter; // 공유 이벤트 버스 인스턴스
    this.currentMaking = new Set(); // 상태: 현재 제조 중인 음료의 orderId들을 저장하는 Set
    this.maxConcurrentDrinks = maxConcurrentDrinks; // 상태: 동시에 제조 가능한 최대 음료 개수 (고정)
  }

  // 행동: 특정 주문의 음료 제조를 시작합니다. 비동기적으로 제조 시간을 기다립니다.
  startMaking(order) {
    // 내부 로직 (제조 시작 처리 및 'drinkStarted' 이벤트 발생)
    // 내부 로직 (비동기적으로 제조 시간 대기 후 'drinkCompleted' 이벤트 발생)
  }

  // 행동: 현재 제조 중인 음료의 개수를 반환합니다.
  getProcessingCount() {
    // 내부 로직 (개수 반환)
  }

  // 행동: 새로운 음료 제조를 시작할 수 있는 여유 슬롯이 있는지 확인합니다.
  hasAvailableSlot() {
    // 내부 로직 (슬롯 여유 확인)
  }
}

// 4. 매니저 (Manager) 👨‍💼
// 역할: 주기적으로 주문표를 확인하고, 바리스타에게 주문을 할당하며, 시스템 종료 조건을 관리합니다.
class Manager extends EventEmitter {
  constructor(eventEmitter, orderQueue, barista, checkInterval, idleTimeout) {
    super();
    this.eventEmitter = eventEmitter; // 공유 이벤트 버스 인스턴스
    this.orderQueue = orderQueue; // 주문표 인스턴스 참조
    this.barista = barista; // 바리스타 인스턴스 참조
    this.checkInterval = checkInterval; // 상태: 주문표 확인 주기 (밀리초)
    this.idleTimeout = idleTimeout; // 상태: 유휴 상태로 간주할 시간 (밀리초)
    this.intervalId = null; // 상태: setInterval 함수의 ID
    this.isCafeOpen = true; // 상태: 카페 운영 중 여부
  }

  // 행동: 카페 시스템을 시작하고 주기적인 주문 확인을 시작합니다.
  startCafe() {
    // 내부 로직 (시스템 시작 및 setInterval 설정)
  }

  // 행동: 카페 시스템을 종료하고 모든 주기적인 작업을 중지합니다.
  stopCafe() {
    // 내부 로직 (시스템 종료 및 setInterval 해제)
  }

  // 행동: 주기적으로 호출되어 주문표를 확인하고 바리스타에게 주문을 할당합니다.
  checkOrders() {
    // 내부 로직 (종료 조건 확인, 주문 할당 로직)
  }

  // 행동: 바리스타로부터 음료 제조 시작 이벤트를 감지하여 처리합니다.
  handleDrinkStarted(orderId, drinkName) {
    // 내부 로직 (로그 출력 등)
  }

  // 행동: 바리스타로부터 음료 제조 완료 이벤트를 감지하여 처리하고 결과를 출력합니다.
  handleDrinkCompleted(orderId, drinkName) {
    // 내부 로직 (로그 출력, 완료 처리)
  }
}

// --- 시스템 인스턴스 생성 및 연결 (외부에서 담당) ---
// 이 부분은 주석 처리된 형태로 제공됩니다. 실제 사용 시 주석을 해제하고 필요한 인스턴스 생성 및 이벤트 리스너 설정을 진행합니다.

/*
// 공통 이벤트 버스 생성
const sharedSystemEvents = new EventEmitter();

// 각 컴포넌트 인스턴스 생성
const orderQueueInstance = new OrderQueue(sharedSystemEvents);
const baristaInstance = new Barista(sharedSystemEvents, 2); // 최대 동시 제조 2개
const cashierInstance = new Cashier(sharedSystemEvents);
const managerInstance = new Manager(sharedSystemEvents, orderQueueInstance, baristaInstance, 1000, 3000); // 1초 확인, 3초 유휴 종료


// --- 이벤트 리스너 설정 (외부에서 담당) ---

// 캐셔가 'newOrder' 이벤트를 발생시키면, 주문표가 'addOrder' 메서드를 통해 주문을 받도록
sharedSystemEvents.on('newOrder', (order) => {
    orderQueueInstance.addOrder(order);
});

// 바리스타가 'drinkStarted' 이벤트를 발생시키면, 매니저가 'handleDrinkStarted'를 통해 알림을 받도록
sharedSystemEvents.on('drinkStarted', (orderId, drinkName) => {
    managerInstance.handleDrinkStarted(orderId, drinkName);
});

// 바리스타가 'drinkCompleted' 이벤트를 발생시키면, 매니저가 'handleDrinkCompleted'를 통해 알림을 받도록
sharedSystemEvents.on('drinkCompleted', (orderId, drinkName) => {
    managerInstance.handleDrinkCompleted(orderId, drinkName);
});


// --- 시스템 시작 (외부에서 담당) ---
managerInstance.startCafe();

// --- 주문 시뮬레이션 (외부에서 담당) ---
// setTimeout(() => cashierInstance.receiveOrder('CUST001', 1), 500);
// setTimeout(() => cashierInstance.receiveOrder('CUST002', 2), 1500);
// ...
*/

// dealy 함수 (헬퍼함수)

function delay(ms, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(message);
      resolve(message);
    }, ms);
  });
}
