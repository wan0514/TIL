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

export { readCounterclockwise, readClockwise, readUp, readDown };
