import readline from 'node:readline';
import { Point, GeometryFactory } from './cordinateHandler.js';

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
        //검증 단계
        const validFormat = isValidFormat(input);
        if (!validFormat) {
          console.log('잘못된 형식입니다.');
          return prompt();
        }

        //추출
        const coordinates = extractCoordinates(input);

        //추출한 x,y 값 검증
        const validRange = isValidRange(coordinates);
        if (!validRange) {
          console.log('숫자가 0~24 범위를 벗어났습니다.');
          return prompt();
        }

        const validCount = hasEnoughPoints(coordinates);
        if (!validCount) {
          console.log('좌표의 개수는 최소 2개 입력해야합니다.');
          return prompt();
        }

        // 최종적으로 검증된 좌표들 처리
        const points = coordinates.map(({ x, y }) => new Point(x, y));
        const geometry = GeometryFactory.createGeometry(points);

        console.log(geometry.calculate());

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
