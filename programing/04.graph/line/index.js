import readline from 'node:readline';
import { Point, Line, Triangle, ShapeFactory } from './cordinateHandler.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//입력 모듈
const prompt = () => {
  rl.question(
    '두 개 이상의 좌표값을 (x,y)-(x,y) 형태로 입력하세요> ',
    (input) => {
      if (input === 'end') {
        rl.close();
      } else {
        const result = validateAndParseCoordinates(input);
        if (result) {
          const points = result.map(({ x, y }) => new Point(x, y));
          const shape = ShapeFactory.createShape(points);

          if (shape.points.length === 2) {
            console.log(shape.getDistance());
          }

          if (shape.points.length > 2) {
            console.log(shape.getArea());
          }
        }

        prompt(); // 다시 입력 받기
      }
    }
  );
};

rl.on('close', () => {
  console.log('프로그램 종료');
});

// 프로그램 실행
prompt();

// 변환함수 : 입력값 '(x,y)-(x,y)' -> [{x,y}, {x,y}]
function validateAndParseCoordinates(input) {
  //유효한 입력값인지 검증
  const validationAndProcess = validateAndProcess(input);

  if (!validationAndProcess.valid) {
    console.log(validationAndProcess.reason);
    return;
  }

  return validationAndProcess.coordinates;
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

// 좌표가 0~24 사이인지 검증하는 함수
function isValidRange(coordinates) {
  return coordinates.every(
    ({ x, y }) => x >= 0 && x <= 24 && y >= 0 && y <= 24
  );
}

function validateAndProcess(input) {
  // 입력 포맷 검증 정규식
  const regex =
    /^\s*\(\s*\d{1,2}\s*,\s*\d{1,2}\s*\)(\s*-\s*\(\s*\d{1,2}\s*,\s*\d{1,2}\s*\))*\s*$/;

  if (!regex.test(input)) return { valid: false, reason: '잘못된 형식입니다.' };

  const coordinates = extractCoordinates(input);

  // 숫자가 0~24 사이인지 검증
  if (!isValidRange(coordinates)) {
    return { valid: false, reason: '숫자가 0~24 범위를 벗어났습니다.' };
  }
  // 좌표의 개수
  const count = coordinates.length;

  //좌표의 개수 2개이상인지 검증
  if (count === 1) {
    return { valid: false, reason: '좌표의 개수는 최소 2개 입력해야합니다.' };
  }

  return { valid: true, count, coordinates };
}
