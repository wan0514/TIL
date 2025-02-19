class CoordinateHandler {
  constructor(array = []) {
    this.array = array;
  }

  printGraph() {
    console.log('그래프...');
  }

  getDistance(coord1, coord2) {
    return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2);
  }

  //a,b,c는 변의 길이
  calculateTriangleArea(a, b, c) {
    // 반둘레 계산
    const s = (a + b + c) / 2;

    // 헤론 공식으로 삼각형 넓이 계산
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return Math.trunc(Number(area.toFixed(2))); // 소수점 두 자리로 반올림된 문자열 반환
  }
}

export { CoordinateHandler };
