import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//입력 모듈
const prompt = () => {
  rl.question('두개의 좌표값을 (x,y)-(x,y) 형태로 입력하세요> ', (input) => {
    if (input === 'end') {
      rl.close();
    } else {
      main(input);
      prompt(); // 다시 프롬프트 실행
    }
  });
};

rl.on('close', () => {
  console.log('프로그램 종료');
});

//main
function main(input) {
  const result = parseCoordinates(input);
  console.log(result);
}

// 프로그램 실행
prompt();

// 변환함수 : 입력값 '(x,y)-(x,y)' -> [[x, y], [x, y]]
function parseCoordinates(input) {
  // 01. -을 기준으로 나눈다. ['(x,y)','(x,y)']
  const coordinatePairs = input.split('-');
  // 02. ()를 제거하고 ','를 기준으로 x와 y를 배열에 넣는다. [[x,y],[x,y]]
  const coordinates = coordinatePairs.map((pair) => {
    // 좌표 쌍에서 양옆 공백을 제거하고 괄호를 정규식으로 제거하고 ','를 기준으로 x와 y를 나눈다
    return pair.trim().replace(/[()]/g, '').split(',').map(Number);
  });

  // 03. 반환
  return coordinates;
}
