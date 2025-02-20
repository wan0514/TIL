import readline from 'node:readline';
import { Point, GeometryFactory } from './cordinateHandler.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('close', () => {
  console.log('프로그램 종료');
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

//입력 모듈
const prompt = async () => {
  while (true) {
    // 입력값 동기적으로 받아오기ㄴ
    const input = await askQuestion(
      '두 개 이상의 좌표값을 (x,y)-(x,y) 형태로 입력하세요> '
    );

    // end 입력시 프로그램 종료
    if (input.trim().toLowerCase() === 'end') {
      rl.close();
      break;
    }

    //유효성 검사
    const coordinates = validateAndExtract(input);

    //유효성 검사 실패하면 null반환, 성공시 좌표값 배열 반환
    if (!coordinates) continue;

    //통과시 메인 로직
    const points = coordinates.map(({ x, y }) => new Point(x, y));
    const geometry = GeometryFactory.createGeometry(points);

    console.log(geometry.calculate());
  }
};

// 프로그램 실행
prompt();

//유효성검사 + 성공시 입력값 추출
function validateAndExtract(input) {
  const validFormat = isValidFormat(input);
  if (!validFormat) {
    console.log('잘못된 형식입니다.');
    return null;
  }
  //추출
  const coordinates = extractCoordinates(input);

  //추출한 x,y 값 검증
  const validRange = isValidRange(coordinates);
  if (!validRange) {
    console.log('숫자가 0~24 범위를 벗어났습니다.');
    return null;
  }

  const validCount = hasEnoughPoints(coordinates);
  if (!validCount) {
    console.log('좌표의 개수는 최소 2개 입력해야합니다.');
    return null;
  }

  return coordinates;
}

// 모든 (x,y) 찾기 => {x,y}
function extractCoordinates(input) {
  const regex = /\((\d{1,2}),(\d{1,2})\)/g;

  const matches = [...input.matchAll(regex)];

  return matches.map((match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }));
}

// 좌표가 0~24 사이인지 검증
function isValidRange(coordinates) {
  return coordinates.every(
    ({ x, y }) => x >= 0 && x <= 24 && y >= 0 && y <= 24
  );
}
// 포맷이 맞는지 검증
function isValidFormat(input) {
  const regex =
    /^\s*\(\s*\d{1,2}\s*,\s*\d{1,2}\s*\)(\s*-\s*\(\s*\d{1,2}\s*,\s*\d{1,2}\s*\))*\s*$/;

  return regex.test(input);
}

// 좌표가 2개 이상인지 검증
function hasEnoughPoints(coordinates) {
  return coordinates.length >= 2;
}
