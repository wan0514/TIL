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

function main(input) {
  console.log(`input is: ${input}`);
}

// 프로그램 실행
prompt();
