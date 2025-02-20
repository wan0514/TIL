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

    // baseAddress가 heapSize를 넘어가지 않도록 제한
    const randomBase = Math.floor(Math.random() * (this.heapSize / 2));
    this.baseAddress = `0x${randomBase.toString(16)}`;

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

    if (!this._types[type]) {
      throw new Error('Invalid type');
    }

    const typeLength = this._types[type]; // 타입 길이를 가져옴
    let totalSize = typeLength * count;

    // 작은 타입은 8바이트로 패딩을 추가
    if (typeLength < 8) {
      totalSize = Math.ceil(totalSize / 8) * 8; // 패딩을 추가하여 8바이트 단위로 맞춤
    }

    // 할당을 시작할 위치를 찾기
    const baseIndex = parseInt(this.baseAddress, 16); // baseAddress를 10진수로 변환
    let startIndex = -1; // defualt: -1 존재 안한다는 뜻

    for (let i = baseIndex; i <= this.heapSize - totalSize; i++) {
      const isAbleToAllocate = this.heap
        .slice(i, i + totalSize)
        .every((block) => block.isAllocated === false);

      if (isAbleToAllocate) {
        startIndex = i;
        break; // 공간을 찾았으면 반복문을 빠져나오기
      }
    }

    if (startIndex === -1) {
      throw new Error('Not enough memory to allocate');
    }

    //할당
    for (let i = startIndex; i < startIndex + totalSize; i++) {
      this.heap[i] = { type, size: totalSize, isAllocated: true };
    }

    const relativeAddress = startIndex - baseIndex;

    return this.decimalToHex(relativeAddress);
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

  decimalToHex(decimal) {
    return `0x${decimal.toString(16).toUpperCase()}`;
  }

  getBaseAddressToHex() {
    return `0x${this.baseAddress.toString(16).toUpperCase()}`;
  }
}
