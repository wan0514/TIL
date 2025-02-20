class Heap {
  constructor() {
    this.heap = [];
    this._types = {}; //private
    this.heapSize = 0;
    this.baseAddress = '';
  }

  // 메모리 배열 초기화
  init(heapSize) {
    // 메모리 초기화 코드
    this.heapSize = heapSize;
    this.heap = Array.from({ length: heapSize }, () => ({
      isAllocated: false,
    }));

    this.baseAddress = `0x${Math.floor(
      Math.random() * (0xa000 - 0x0000 + 1) + 0x0000
    ).toString(16)}`;

    return this.baseAddress;
  }

  // 타입과 크기 설정
  setSize(type, length) {
    // TODO: 타입과 크기 설정 코드
    const validSizes = [1, 2, 3, 8, 16, 32];

    if (this._types[type]) {
      throw new Error(`This ${type} is already defined`);
    }

    if (!validSizes.includes(length)) {
      throw new Error('Invalid length. Valid sizes are 1, 2, 3, 8, 16, 32.');
    }

    this._types[type] = length;
  }

  // 메모리 할당
  malloc(type, count) {
    // TODO: 메모리 할당 코드
  }

  // 메모리 해제
  free(pointer) {
    // TODO: 메모리 해제 코드
  }

  // types의 getter
  get types() {
    // TODO: types 반환 코드
  }

  // types의 setter
  set types(newType) {
    // TODO: types 설정 코드
  }
}

const myHeap = new Heap();
myHeap.init(1024);
