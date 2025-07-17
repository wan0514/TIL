export default class Memory {
  constructor() {
    this.baseAddress = 0x10000000; // 임의로 설정
    this.stackSize = 0;
    this.heapSize = 0;
    this.stackStart = 0; //시작 주소 init에서 할당
    this.heapStart = 0; // 시작 주소 init에서 할당
    this.stack = [];
    this.heap = new Map(); // 주소: { type, size, dataType, count, refCount }
    this.typeMap = new Map();
    this.callStackFrames = [];
    this.stackPointer = 0; // 스택의 현재 사용 중인 바이트 수
    this.heapPointer = 0; // 힙의 현재 사용 중인 바이트 수
  }

  /**
   * 메모리 시뮬레이터를 초기화합니다. 스택과 힙의 크기를 설정합니다.
   * @param {number} stackSize 스택 영역의 크기 (바이트)
   * @param {number} heapSize 힙 영역의 크기 (바이트)
   * @returns {number} baseAddress 메모리 시작 주소
   * @throws {Error} 스택 또는 힙 크기가 양수가 아닐 경우
   */
  init(stackSize, heapSize) {
    if (stackSize <= 0 || heapSize <= 0) {
      throw new Error("Stack and heap size must be positive integers.");
    }
    this.stackSize = stackSize;
    this.heapSize = heapSize;
    this.stackStart = this.baseAddress;
    this.heapStart = this.baseAddress + stackSize; // 힙은 스택 다음부터 시작

    // // init 호출 시마다 모든 상태를 초기화하여 버그 방지
    // this.stack = [];
    // this.heap = new Map();
    // this.typeMap = new Map();
    // this.callStackFrames = [];
    // this.stackPointer = 0;
    // this.heapPointer = 0; // 힙 사용량 초기화

    return this.baseAddress;
  }

  /**
   * 새로운 데이터 타입을 정의하고 해당 크기를 할당합니다.
   * @param {string} type 정의할 타입의 이름
   * @param {number} length 타입의 크기 (바이트), 허용된 값: 1, 2, 4, 8, 16, 32
   * @throws {Error} 허용되지 않는 크기이거나 이미 등록된 타입일 경우
   */
  setSize(type, length) {
    const allowed = [1, 2, 4, 8, 16, 32];

    if (!allowed.includes(length)) {
      throw new Error("Invalid size. Allowed sizes are 1, 2, 4, 8, 16, 32.");
    }
    if (this.typeMap.has(type)) {
      throw new Error(`Type '${type}' already registered.`);
    }

    this.typeMap.set(type, length);
  }

  /**
   * 힙 영역에 메모리를 할당하고, 해당 주소를 스택에 포인터로 저장합니다.
   * @param {string} type 할당할 타입의 이름 (setSize로 미리 정의되어야 함)
   * @param {number} count 할당할 타입의 개수 (기본값 1)
   * @returns {number} 스택에 저장된 힙 포인터의 주소
   * @throws {Error} 등록되지 않은 타입이거나 메모리 오버플로우 발생 시
   */
  malloc(type, count = 1) {
    // typeMap에 인자로 받은 타입이 없으면 에러 발생
    if (!this.typeMap.has(type)) {
      throw new Error(`Type '${type}' not registered. Use setSize() first.`);
    }

    // count가 최소한 1 이상이어야 함
    if (count <= 0) {
      throw new Error("Count must be a positive integer.");
    }

    let size = this.typeMap.get(type);
    if (size < 8) size = 8; // 8바이트 패딩
    const totalSize = size * count;

    // 힙 오버플로우 체크
    if (this.heapPointer + totalSize > this.heapSize) {
      throw new Error("Heap overflow: Not enough space in heap.");
    }

    const heapAddr = this.heapStart + this.heapPointer;
    this.heapPointer += totalSize; // 힙 사용량 증가

    // 스택 오버플로우 체크 (포인터 크기 4바이트 가정)
    if (this.stackPointer + 4 > this.stackSize) {
      throw new Error("Stack overflow: Not enough space to store pointer.");
    }
    const stackAddr = this.stackStart + this.stackPointer;
    this.stackPointer += 4; // 스택 사용량 증가

    // 힙에 데이터 정보 저장 (refCount 초기값 1)
    this.heap.set(heapAddr, {
      type,
      size: totalSize,
      dataType: type, // 할당된 데이터의 원래 타입
      count,
      refCount: 1, // 스택에 포인터가 하나 생겼으므로 1로 초기화
    });

    // 스택에 포인터 저장
    this.stack.push({
      type: "pointer",
      stackAddr,
      heapAddr,
      heapSize: totalSize, // 할당된 힙 영역의 총 크기 (디버깅용)
    });

    return stackAddr;
  }

  /**
   * 스택 포인터(주소값)를 사용하여 스택에서 해당 포인터를 제거합니다.
   * 힙 메모리 자체는 제거하지 않고 해당 힙 엔트리의 참조 카운트를 감소시킵니다.
   * @param {number} pointer 해제할 스택 포인터의 주소
   * @throws {Error} 스택에서 포인터를 찾을 수 없을 경우
   */
  free(pointer) {
    // 스택에서 해당 주소를 가진 포인터 항목의 인덱스 찾기
    const idx = this.stack.findIndex(
      (entry) => entry.type === "pointer" && entry.stackAddr === pointer
    );

    if (idx === -1) {
      throw new Error(
        `Pointer 0x${pointer.toString(16).toUpperCase()} not found in stack.`
      );
    }

    // 해당 스택 포인터가 참조하는 힙 주소 가져오기
    const heapAddr = this.stack[idx].heapAddr;
    const heapEntry = this.heap.get(heapAddr);

    // 힙 엔트리가 존재하고 참조 카운트가 0보다 크면 감소
    if (heapEntry && heapEntry.refCount > 0) {
      heapEntry.refCount--;
    }

    // 스택에서 해당 포인터 항목 제거
    this.stack.splice(idx, 1);
    // 스택 포인터 감소 (제거된 만큼)
    this.stackPointer -= 4; // 포인터 크기 4바이트 가정
  }

  /**
   * 함수 호출을 시뮬레이션하고 스택에 함수 프레임을 할당합니다.
   * @param {string} name 호출할 함수의 이름 (최대 8자)
   * @param {number} paramCount 함수의 매개변수 개수 (0 ~ 10)
   * @throws {Error} 함수 이름이 유효하지 않거나, 매개변수 개수 범위 초과, 스택 오버플로우 발생 시
   */
  call(name, paramCount) {
    if (typeof name !== "string" || name.length === 0 || name.length > 8) {
      throw new Error(
        "Invalid function name. Must be a non-empty string up to 8 characters."
      );
    }
    if (paramCount < 0 || paramCount > 10) {
      throw new Error("paramCount must be between 0 and 10.");
    }
    // 각 매개변수는 스택에 4바이트 포인터로 저장된다고 가정
    if (this.stackPointer + 4 * paramCount > this.stackSize) {
      throw new Error(
        "Stack overflow: Not enough space for function parameters."
      );
    }

    const frameStart = this.stackStart + this.stackPointer;
    this.callStackFrames.push({
      name,
      stackAddr: frameStart,
      paramCount,
      pointerStartIndex: this.stack.length, // 이 프레임이 시작될 때 스택 배열의 인덱스(call되기 전의 length)
    });

    for (let i = 0; i < paramCount; i++) {
      this.stack.push({
        type: "param",
        stackAddr: this.stackStart + this.stackPointer,
        name: `${name}_param${i}`,
      });
      this.stackPointer += 4;
    }
  }

  /**
   * 함수 호출 스택에서 `name`에 해당하는 가장 최근 프레임을 제거합니다.
   * 해당 프레임 이후 `malloc`으로 할당된 스택 포인터도 함께 제거됩니다.
   * 제거되는 포인터가 참조하는 힙 엔티티의 참조 카운트를 감소시킵니다.
   * @param {string} name 반환할 함수의 이름
   * @throws {Error} `name`이 최근 호출한 함수와 다를 경우
   */
  returnFrom(name) {
    if (this.callStackFrames.length === 0) {
      return; // 호출 스택이 비어있으면 아무 작업도 안 함
    }

    const lastFrame = this.callStackFrames[this.callStackFrames.length - 1];
    if (lastFrame.name !== name) {
      throw new Error(
        `ReturnFrom called with wrong function name. Expected '${lastFrame.name}', but got '${name}'.`
      );
    }

    // 이 프레임과 그 이후에 스택에 쌓인 모든 항목 제거
    while (this.stack.length > lastFrame.pointerStartIndex) {
      const removedItem = this.stack.pop();
      this.stackPointer -= 4; // 스택 포인터 감소

      // 제거된 항목이 힙 포인터였다면, 해당 힙 엔트리의 참조 카운트 감소
      if (removedItem.type === "pointer") {
        const heapEntry = this.heap.get(removedItem.heapAddr);
        if (heapEntry && heapEntry.refCount > 0) {
          heapEntry.refCount--;
        }
      }
    }

    this.callStackFrames.pop(); // 함수 호출 스택에서 현재 프레임 제거
  }

  /**
   * 현재 메모리 사용량 정보를 반환합니다.
   * @returns {[number, number, number, number, number, number]}
   * [스택 전체 크기, 스택 사용 중인 용량, 스택 남은 용량, 힙 전체 크기, 힙 사용 중인 용량, 힙 남은 용량]
   */
  usage() {
    const stackUsed = this.stackPointer;
    const stackRemain = this.stackSize - stackUsed;
    const heapUsed = this.heapPointer; // 현재까지 할당된 힙 공간의 총량
    const heapRemain = this.heapSize - heapUsed; // 사용 가능한 힙 공간의 총량

    // 실제 사용 중인 힙 용량은 refCount가 0이 아닌 것들의 합계로 계산할 수도 있지만,
    // 현재는 nextAvailableHeapAddress를 따라간 것으로 계산합니다.
    // 만약 실제 사용 중인 힙 용량을 원한다면, heapMap을 순회하여 refCount > 0인 요소들의 size 합계를 구해야 합니다.
    let actualHeapUsed = 0;
    for (const [addr, info] of this.heap.entries()) {
      if (info.refCount > 0) {
        actualHeapUsed += info.size;
      }
    }

    return [
      this.stackSize,
      stackUsed,
      stackRemain,
      this.heapSize,
      actualHeapUsed, // 실제 사용 중인 힙 용량 (가비지 제외)
      this.heapSize - actualHeapUsed, // 실제 남은 힙 용량
    ];
  }

  /**
   * 현재 쌓여있는 함수 호출 스택을 문자열로 표현하여 반환합니다.
   * 예: main() 0x10000000 -> foo() 0x10000008
   * @returns {string} 호출 스택을 나타내는 문자열
   */
  callstack() {
    if (this.callStackFrames.length === 0) {
      return "호출 스택이 비어있습니다.";
    }
    return this.callStackFrames
      .map(
        (frame) =>
          `${frame.name}() 0x${frame.stackAddr.toString(16).toUpperCase()}`
      )
      .join(" -> ");
  }

  /**
   * 힙 영역에서 현재 할당되어 사용 중인 상태를 문자열 배열로 표현하여 반환합니다.
   * 각 항목은 타입, 크기, 주소, 참조 카운트 및 참조하는 스택 포인터 정보를 포함합니다.
   * @returns {string[]} 힙 덤프 정보 문자열 배열
   */
  heapdump() {
    const result = [];
    if (this.heap.size === 0) {
      result.push("힙 영역이 비어있습니다.");
      return result;
    }

    // 힙 주소를 오름차순으로 정렬하여 출력
    const sortedHeapKeys = Array.from(this.heap.keys()).sort((a, b) => a - b);

    for (const addr of sortedHeapKeys) {
      const info = this.heap.get(addr);
      // 이 힙 엔티지를 참조하는 스택 포인터들을 찾음
      const referringStackPointers = this.stack
        .filter((entry) => entry.type === "pointer" && entry.heapAddr === addr)
        .map((entry) => `0x${entry.stackAddr.toString(16).toUpperCase()}`);

      const refInfo =
        referringStackPointers.length > 0
          ? `(스택 참조: ${referringStackPointers.join(", ")})`
          : "(스택 참조 없음)"; // refCount가 0인 경우를 대비

      result.push(
        `주소: 0x${addr.toString(16).toUpperCase()}, ` +
          `타입: ${info.dataType} (할당 크기: ${info.size}B), ` +
          `개수: ${info.count}, ` +
          `참조 카운트: ${info.refCount} ${refInfo}`
      );
    }
    return result;
  }

  /**
   * 힙 영역에 할당된 메모리 중 스택에서 더 이상 참조하지 않는 (참조 카운트가 0인) 항목을 찾아 실제로 해제합니다.
   * 해제된 만큼 힙 포인터(사용량)를 줄입니다.
   */
  garbageCollect() {
    console.log("--- 가비지 컬렉션 시작 ---");
    let freedBytes = 0;
    const initialHeapEntries = this.heap.size;

    // Map을 직접 순회하면서 제거하면 오류가 발생할 수 있으므로, 제거할 키들을 먼저 수집
    const keysToCollect = [];
    for (const [addr, info] of this.heap.entries()) {
      if (info.refCount <= 0) {
        // 참조 카운트가 0 이하인 경우 (더 이상 참조되지 않음)
        keysToCollect.push(addr);
      }
    }

    for (const addr of keysToCollect) {
      const info = this.heap.get(addr);
      if (info) {
        // 혹시 모를 경우를 대비
        this.heap.delete(addr);
        freedBytes += info.size; // 해제된 바이트 수 누적
        console.log(
          `- 가비지 수집: 0x${addr.toString(16).toUpperCase()} (타입: ${
            info.dataType
          }, 크기: ${info.size}B)`
        );
      }
    }

    // 힙 포인터(사용량) 업데이트 - 해제된 만큼 감소시켜야 함.
    // 이 시뮬레이터의 heapPointer는 nextAvailableHeapAddress와 유사하게 동작하므로,
    // 중간에 비어버린 공간은 heapPointer에 반영되지 않고 garbageCollect를 통해 실제 사용량이 줄어드는 것으로 시뮬레이션합니다.
    this.heapPointer -= freedBytes; // 현재 힙 사용량을 정확히 반영

    console.log(
      `--- 가비지 컬렉션 완료: ${freedBytes}B 메모리 해제됨. 힙 엔트리 ${initialHeapEntries} -> ${this.heap.size} ---`
    );
  }

  /**
   * 모든 메모리 영역(스택, 힙)과 등록된 타입, 호출 스택 등을 초기 상태로 리셋합니다.
   */
  reset() {
    this.stack = [];
    this.heap = new Map();
    this.typeMap = new Map();
    this.callStackFrames = [];
    this.stackPointer = 0;
    this.heapPointer = 0;
    // stackSize, heapSize, stackStart, heapStart는 init에서 다시 설정되므로 여기서는 초기화하지 않습니다.
    console.log("메모리 시뮬레이터가 초기 상태로 리셋되었습니다.");
  }
}
