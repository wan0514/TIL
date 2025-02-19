class CoordinateHandler {
  constructor(array = []) {
    this.array = array;
  }

  printGraph() {
    console.log('그래프...');
  }

  getDistance(index1, index2) {
    const coord1 = this.array[index1]; // 배열에서 첫 번째 좌표
    const coord2 = this.array[index2]; // 배열에서 두 번째 좌표
    return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2); // 거리 계산
  }

  // 삼각형 넓이를 구하는 메서드
  calculateTriangleArea() {
    if (this.array.length !== 3) {
      throw new Error('삼각형 넓이를 구하려면 3개의 좌표가 필요합니다.');
    }

    // 세 점 간의 거리 계산
    const a = this.getDistance(0, 1);
    const b = this.getDistance(1, 2);
    const c = this.getDistance(2, 0);

    // 헤론 공식을 이용한 삼각형 넓이 계산
    const s = (a + b + c) / 2; // 반둘레
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 넓이 계산

    return Math.trunc(Number(area.toFixed(2)));
  }
}

export { CoordinateHandler };
