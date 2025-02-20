class Heap {
  constructor() {
    this.heap = [];
    this._types = {}; //private
    this.heapSize = 0;
    this.baseAddress = ''; //16진수 형태의 string
  }

  // 메모리 배열 초기화
  init(heapSize) {
    // 메모리 초기화 코드
    this.heapSize = heapSize;
    this.heap = Array.from({ length: heapSize }, () => this.createEmptyBlock());

    // baseAddress가 heapSize를 넘어가지 않도록 제한
    const randomBase = Math.floor(Math.random() * (this.heapSize / 2));
    this.baseAddress = `0x${randomBase.toString(16)}`;

    return this.baseAddress;
  }

  // 타입과 크기 설정
  setSize(type, length) {
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
    //타입 유효성 검사
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
    const startIndex = this.findAvailableSpace(totalSize);

    // 할당할 충분한 공간이 없을 때
    if (startIndex === -1) {
      throw new Error('Not enough memory to allocate');
    }

    //할당
    for (let i = startIndex; i < startIndex + totalSize; i++) {
      this.heap[i] = { type, totalSize: totalSize, isAllocated: true };
    }

    return this.decimalToHex(startIndex);
  }

  // 메모리 해제
  free(pointer) {
    const targetAddress = this.hexToDecimal(pointer); // 상대 주소 10진법 = 배열의 인덱스

    // 주소 범위가 유효한지 검사
    if (targetAddress < 0 || targetAddress >= this.heapSize) {
      throw new Error('Invalid memory address');
    }

    //시작 인덱스를 찾고 그 값의 사이즈를 찾아 그 사이즈를 더한 인덱스까지 초기화
    const targetBlock = this.heap[targetAddress];

    // free할 주소가 이미 free인지 검증
    if (!targetBlock.isAllocated) {
      throw new Error('Memory at this address is already free');
    }

    const targetSize = targetBlock.totalSize;
    const removedData = { ...targetBlock };

    // 초기화 과정
    for (let i = targetAddress; i < targetAddress + targetSize; i++) {
      this.heap[i] = this.createEmptyBlock();
    }
    // 제거한 데이터 반환
    return removedData;
  }

  findAvailableSpace(size) {
    for (let i = 0; i <= this.heapSize - size; i++) {
      const isAbleToAllocate = this.heap
        .slice(i, i + size)
        .every((block) => !block.isAllocated);

      if (isAbleToAllocate) {
        return i;
      }
    }
    return -1;
  }

  createEmptyBlock() {
    return { type: null, totalSize: 0, isAllocated: false };
  }

  decimalToHex(decimal) {
    return `0x${decimal.toString(16).toUpperCase()}`;
  }

  hexToDecimal(hex) {
    return parseInt(hex, 16);
  }
}
