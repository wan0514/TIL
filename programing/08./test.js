function readCounterclockwise(rowCount, colCount, input) {
  let result = [];

  // 맨 오른쪽 열을 아래에서 위로 읽기
  for (let i = colCount; i >= colCount - 1; i--) {
    for (let j = rowCount; j >= rowCount - 1; j--) {
      result.push(input[i][j]);
    }
  }

  // 맨 왼쪽에서 두번째 열을 위에서 아래로 읽기
  for (let i = colCount - 1; i <= colCount; i++) {
    for (let j = rowCount - 2; j >= rowCount - 3; j--) {
      result.push(input[i][j]);
    }
  }

  return result.join('');
}

// 예시 배열 (10x10)
const input = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
];

// 실행 예시
console.log(readCounterclockwise(4, 1, input));
