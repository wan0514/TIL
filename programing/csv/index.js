import { createFile, insertToFile, deleteFrom } from './csvHandler.js';
import readline from 'node:readline';

// 메인 로직 : 입력값을 받고 파싱 -> 로직 수행

// 정규식 상수화
const CREATE_TABLE_REGEX =
  /^CREATE TABLE\s?(\w+)\s?\((\s?\w+\s(String|Numeric)(\s?,\s?\w+\s(String|Numeric))*)\)$/i;
const INSERT_INTO_REGEX =
  /^INSERT INTO\s(\w+)\s?\((\s?\w+(\s?,\s?\w+\s?)*)\)\s?VALUES\s?\((\s?"?\w+"?(\s?,\s?"?\w+"?)*)\)$/i;
const DELETE_FROM_REGEX = /^DELETE FROM(\s?\w+\s)WHERE\sid\s=\s([1-9])\s*/;

function main(input) {
  //01. 정규식표현으로 input 값 분석
  const parsedInput = parseCommand(input);

  if (parsedInput === null) {
    throw new Error('입력값이 잘못되었습니다.');
  }
  //02. 분석한 것을 명령 판별 후 호출
  switch (parsedInput.command) {
    case 'CREATE':
      createFile(parsedInput);
      break;
    case 'INSERT':
      insertToFile(parsedInput);
      break;
    case 'DELETE':
      deleteFrom(parsedInput);
      break;
    default:
      console.log('존재하지 않는 명령입니다.');
  }
}

function validateColumns(columns) {
  // 컬럼 수가 1 ~ 9개 사이인지 확인
  if (columns.length < 1 || columns.length > 9) {
    throw new Error('컬럼은 최소 1개, 최대 9개까지만 가능합니다.');
  }

  // 'id' 컬럼이 있는지 확인
  if (columns.includes('id')) {
    throw new Error("'id' 컬럼은 사용할 수 없습니다.");
  }
}

function parseCommand(input) {
  const patterns = [
    {
      regex: CREATE_TABLE_REGEX,
      handler: (match) => {
        const tableName = match[1];
        const columnsWithTypes = match[2];
        const columnData = columnsWithTypes
          .split(',')
          .map((item) => item.trim());
        const columns = columnData.map((item) => item.split(' ')[0]);
        const dataTypes = columnData.map((item) => item.split(' ')[1]);

        //유효성 검사
        validateColumns(columns);

        return { command: 'CREATE', tableName, columns, dataTypes };
      },
    },
    {
      regex: INSERT_INTO_REGEX,
      handler: (match) => {
        const tableName = match[1];
        const columns = match[2].split(',').map((item) => item.trim());
        const values = match[4].split(',').map((item) => item.trim());

        return { command: 'INSERT', tableName, columns, values };
      },
    },
    {
      regex: DELETE_FROM_REGEX,
      handler: (match) => {
        const tableName = match[1].trim();
        const recordId = Number(match[2].trim());

        return { command: 'DELETE', tableName, recordId };
      },
    },
  ];

  for (const { regex, handler } of patterns) {
    const match = input.match(regex);
    if (match) {
      return handler(match);
    }
  }

  return null;
}

// readline 프롬포트
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = () => {
  rl.question('> ', (input) => {
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

// 프로그램 실행
prompt();
