function readCounterclockwise(startIndex, input) {
  const [col, row] = startIndex;
  return readUp(startIndex, input, 2) + readDown([col - 1, row - 2], input, 2);
}

function readClockwise(startIndex, input) {
  const [col, row] = startIndex;
  return readDown(startIndex, input, 2) + readUp([col + 1, row - 2], input, 2);
}

function readUp(startIndex, input, length = 4) {
  const [col, row] = startIndex;
  let result = '';
  for (let i = col; i > col - length; i--) {
    for (let j = row; j >= row - 1; j--) {
      result += input[i][j];
    }
  }
  return result;
}

function readDown(startIndex, input, length = 4) {
  const [col, row] = startIndex;
  let result = '';
  for (let i = col; i < col + length; i++) {
    for (let j = row; j >= row - 1; j--) {
      result += input[i][j];
    }
  }
  return result;
}

export { readCounterclockwise, readClockwise, readUp, readDown };
