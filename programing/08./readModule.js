function readCounterclockwise(startIndex, input) {
  const [col, row] = startIndex;
  // counterclockwise 방향으로 읽기: 위로, 아래로
  const firstPart = readUp(startIndex, input, 2);
  const secondPart = readDown([col - 1, row - 2], input, 2);
  return firstPart + secondPart;
}

function readClockwise(startIndex, input) {
  const [col, row] = startIndex;
  // clockwise 방향으로 읽기: 아래로, 위로
  const firstPart = readDown(startIndex, input, 2);
  const secondPart = readUp([col + 1, row - 2], input, 2);
  return firstPart + secondPart;
}

function readUp(startIndex, input, length = 4) {
  const [col, row] = startIndex;
  const step = -1; // 위로 가는 방향은 -1

  return Array.from({ length }, (_, i) =>
    [input[col + i * step][row], input[col + i * step][row - 1]].join('')
  ).join('');
}

function readDown(startIndex, input, length = 4) {
  const [col, row] = startIndex;
  const step = 1; // 아래로 가는 방향은 +1

  return Array.from({ length }, (_, i) =>
    [input[col + i * step][row], input[col + i * step][row - 1]].join('')
  ).join('');
}

const readModule = { readCounterclockwise, readClockwise, readUp, readDown };

export default readModule;
