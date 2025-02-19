// 이전 설계: 하나의 클래스로 만들었음
// class CoordinateHandler {
//   constructor(array = []) {
//     this.array = array;
//   }

//   printGraph() {
//     console.log('그래프...');
//   }

//   getDistance(index1, index2) {
//     const coord1 = this.array[index1]; // 배열에서 첫 번째 좌표
//     const coord2 = this.array[index2]; // 배열에서 두 번째 좌표
//     return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2); // 거리 계산
//   }

//   // 삼각형 넓이를 구하는 메서드
//   calculateTriangleArea() {
//     if (this.array.length !== 3) {
//       throw new Error('삼각형 넓이를 구하려면 3개의 좌표가 필요합니다.');
//     }

//     // 세 점 간의 거리 계산
//     const a = this.getDistance(0, 1);
//     const b = this.getDistance(1, 2);
//     const c = this.getDistance(2, 0);

//     // 헤론 공식을 이용한 삼각형 넓이 계산
//     const s = (a + b + c) / 2; // 반둘레
//     const area = Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 넓이 계산

//     return Math.trunc(Number(area.toFixed(2)));
//   }
// }

// export { CoordinateHandler };

// 새롤운 설계: point,line,triangle로 클래스 구분
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
  }

  getDistance() {
    return Math.sqrt(
      (this.point1.x - this.point2.x) ** 2 +
        (this.point1.y - this.point2.y) ** 2
    );
  }
}

class Triangle {
  constructor(p1, p2, p3) {
    this.points = [p1, p2, p3];
    this.lines = [new Line(p1, p2), new Line(p2, p3), new Line(p3, p1)];
  }

  calculateArea() {
    const [a, b, c] = this.lines.map((line) => line.getDistance());
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return Math.trunc(Number(area.toFixed(2)));
  }
}

export { Point, Line, Triangle };
