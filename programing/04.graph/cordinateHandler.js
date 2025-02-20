class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Geometry {
  constructor(points) {
    this.points = points;
  }

  calculate() {
    throw new Error('calculate()는 반드시 하위 클래스에서 구현해야 합니다.');
  }
}

class Line extends Geometry {
  constructor(p1, p2) {
    super([p1, p2]);
  }

  calculate() {
    const [p1, p2] = this.points;
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
}

class Triangle extends Geometry {
  constructor(p1, p2, p3) {
    super([p1, p2, p3]);
    this.lines = [new Line(p1, p2), new Line(p2, p3), new Line(p3, p1)];
  }

  calculate() {
    const [a, b, c] = this.lines.map((line) => line.calculate());
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    return Number(area.toFixed(2));
  }
}

class Polygon extends Geometry {
  constructor(points) {
    if (points.length < 5) {
      throw new Error('다각형은 최소 5개의 점이 필요합니다.');
    }
    super(points);
  }

  calculate() {
    const sortedByCounterClockWise = this.getSortPointsCounterClockwise(); //반시계 방향으로 정렬
    const basePoint = sortedByCounterClockWise[0]; // 기준점 (첫 번째 점)
    let totalArea = 0;

    for (let i = 1; i < sortedByCounterClockWise.length - 1; i++) {
      const triangle = new Triangle(
        basePoint,
        sortedByCounterClockWise[i],
        sortedByCounterClockWise[i + 1]
      );
      totalArea += triangle.calculate();
    }

    return totalArea;
  }

  getSortPointsCounterClockwise() {
    // 1. 중심점(무게중심) 구하기
    const centerX =
      this.points.reduce((sum, p) => sum + p.x, 0) / this.points.length;
    const centerY =
      this.points.reduce((sum, p) => sum + p.y, 0) / this.points.length;
    const center = { x: centerX, y: centerY };

    // 2. 각 점의 극각(atan2)을 구하고 정렬
    return this.points.slice().sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x);
      const angleB = Math.atan2(b.y - center.y, b.x - center.x);
      return angleA - angleB; // 작은 각도부터 큰 각도 순으로 정렬 (반시계 방향)
    });
  }
}

//팩토리 객체
class GeometryFactory {
  static createGeometry(points) {
    switch (points.length) {
      case 2:
        return new Line(points[0], points[1]);
      case 3:
        return new Triangle(points[0], points[1], points[2]);
      default:
        return new Polygon(points);
    }
  }
}

export { Point, Geometry, Line, Triangle, Polygon, GeometryFactory };
