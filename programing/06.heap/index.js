class Heap {
  #types = {}; // private 필드

  constructor() {
    this.heap = [];
    this.heapSize = 0;
    this.baseAddress = ''; // 16진수 형태의 string
  }

  // 메모리 배열 초기화
  init(heapSize) {
    this.heapSize = heapSize;
    this.heap = Array.from({ length: heapSize }, () => this.createEmptyBlock());

    // baseAddress가 heapSize를 넘어가지 않도록 제한
    const randomBase = Math.floor(Math.random() * (this.heapSize / 2));
    this.baseAddress = `0x${randomBase.toString(16)}`;

    return this.baseAddress;
  }

  // 타입과 크기 설정
  setSize(type, length) {
    const validSizes = [1, 2, 4, 8, 16, 32];

    if (this.#types[type]) {
      throw new Error(`Type "${type}" is already defined`);
    }

    if (!validSizes.includes(length)) {
      throw new Error('Invalid length. Valid sizes are 1, 2, 4, 8, 16, 32.');
    }

    this.#types[type] = length;
  }

  // 등록된 타입 조회
  get types() {
    return { ...this.#types }; // 🔍 읽기 전용 객체 반환 (외부에서 수정 방지)
  }

  // 메모리 할당
  malloc(type, count) {
    if (!this.#types[type]) {
      throw new Error('Invalid type');
    }

    const typeLength = this.#types[type];
    let totalSize = typeLength * count;

    if (typeLength < 8) {
      totalSize = Math.ceil(totalSize / 8) * 8;
    }

    const startIndex = this.findAvailableSpace(totalSize);
    if (startIndex === -1) {
      throw new Error('Not enough memory to allocate');
    }

    for (let i = startIndex; i < startIndex + totalSize; i++) {
      this.heap[i] = { type, totalSize, isAllocated: true };
    }

    return this.decimalToHex(startIndex);
  }

  // 메모리 해제
  free(pointer) {
    const targetAddress = this.hexToDecimal(pointer);

    if (targetAddress < 0 || targetAddress >= this.heapSize) {
      throw new Error('Invalid memory address');
    }

    const targetBlock = this.heap[targetAddress];
    if (!targetBlock.isAllocated) {
      throw new Error('Memory at this address is already free');
    }

    const targetSize = targetBlock.totalSize;
    const removedData = { ...targetBlock };

    for (let i = targetAddress; i < targetAddress + targetSize; i++) {
      this.heap[i] = this.createEmptyBlock();
    }

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
