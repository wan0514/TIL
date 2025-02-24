function readCounterclockwise(colCount, rowCount, input) {
  return (
    readUp(colCount, rowCount, input) +
    readDown(colCount - 1, rowCount - 2, input)
  );
}

function readClockwise(colCount, rowCount, input) {
  return (
    readDown(colCount, rowCount, input) +
    readUp(colCount + 1, rowCount - 2, input)
  );
}

function readUp(colCount, rowCount, input) {
  let result = '';
  for (let i = colCount; i >= colCount - 1; i--) {
    for (let j = rowCount; j >= rowCount - 1; j--) {
      result += input[i][j];
    }
  }
  return result;
}

function readDown(colCount, rowCount, input) {
  let result = '';
  for (let i = colCount; i <= colCount + 1; i++) {
    for (let j = rowCount; j >= rowCount - 1; j--) {
      result += input[i][j];
    }
  }
  return result;
}

// 예시 배열 (10x10)
const input = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
];

// 실행 예시

console.log(readCounterclockwise(1, 4, input));
console.log(readClockwise(0, 4, input));

console.log(readUp(1, 1, input)); //  col,row  6,5,1,0
console.log(readDown(1, 1, input)); // col,row 6,5,11,10
