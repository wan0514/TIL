//mission
import fs from 'fs';
import path from 'path';

// 현재 파일 경로 생성 함수(ES 모듈 사용시 필요)
function getFilePath(fileName, fileFormat) {
  const currentDir = new URL('.', import.meta.url).pathname;
  return path.join(currentDir, fileName + '.' + fileFormat);
}

function main(input) {
  //main 함수
  //01. 정규식표현으로 input 값 분석
  const parsedInput = parseCommand(input);
  //02. 분석한 것을 명령 판별
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
      console.log('Unknown command');
  }
}

function parseCommand(input) {
  // input을 정규식 표현으로 분리해서 명령 분석
  const createTableRegex = /^CREATE TABLE (\w+) \((.+)\)$/i;
  const insertIntoRegex = /^INSERT INTO (\w+) \((.+)\) VALUES \((.+)\)$/i;
  const deleteFromRegex = /^DELETE FROM (\w+) WHERE (.+)$/i;

  let match;

  // CREATE TABLE 처리
  if ((match = input.match(createTableRegex))) {
    // match는 일치하지 않으면 null을 반환하기 때문에 조건문으로 사용 가능
    const tableName = match[1]; // 테이블 이름
    const columnsWithTypes = match[2]; // 컬럼과 데이터 타입

    // 컬럼과 데이터 타입을 분리
    const columnData = columnsWithTypes.split(',').map((item) => item.trim());
    const columns = columnData.map((item) => item.split(' ')[0]); // 컬럼 이름만 추출
    const dataTypes = columnData.map((item) => item.split(' ')[1]); // 데이터 타입만 추출

    return { command: 'CREATE', tableName, columns, dataTypes };
  }
  // INSERT INTO 처리
  if ((match = input.match(insertIntoRegex))) {
    const tableName = match[1]; // 테이블 이름
    const columns = match[2]; // 컬럼 리스트
    const values = match[3]; // 값 리스트

    return { command: 'INSERT', tableName, columns, values };
  }

  // DELETE FROM 처리
  if ((match = input.match(deleteFromRegex))) {
    const tableName = match[1]; // 테이블 이름
    const condition = match[2]; // 조건

    return { command: 'DELETE', tableName, condition };
  }
  return null;
}

function formatMetaData({ tableName, columns, dataTypes }) {
  // 테이블 이름과 컬럼, 데이터 타입을 이용해 메타데이터를 생성
  const metaData = {
    [tableName]: columns.map((column, index) => ({
      id: index + 1, // 컬럼의 ID (1부터 시작)
      columnName: column,
      dataType: dataTypes[index],
    })),
  };

  return metaData;
}

// 파일 생성 함수
function createFile({ tableName, columns, dataTypes }) {
  // 파일 경로 생성
  const filePathOfCsv = getFilePath(tableName, 'csv');
  const filePathOfMetaData = getFilePath(tableName, 'json');

  // 데이터 텍스트 형식으로 변경
  const parsedData = columns.join(',') + '\n' + '-----------';

  // 파일 구조 (데이터타입, 칼럼 아이디 등을 json으로 따로 생성)
  const metaData = JSON.stringify(
    formatMetaData({ tableName, columns, dataTypes })
  );
  fs.writeFileSync(filePathOfMetaData, metaData, 'utf-8');

  //csv 파일 생성
  try {
    fs.writeFileSync(filePathOfCsv, parsedData, 'utf-8');
    console.log('성공했습니다');
  } catch (err) {
    console.log('실패했습니다');
  }

  // tableName = csv파일 이름
  // dataType은 number/string
  // column의 최대개수 9
  // column이름은 띄어쓰기 x, id라는 이름은 안됨
  // 모든 column은 null이 아니라는 가정
  // 이미 파일이 존재하면 실패 메세지 반환
  // 추가되어야할 파일 형식 :
  //  name,age,fruit
  //    -----------
}

console.log(
  main('CREATE TABLE billboard (singer String, year Numeric, song String)')
);

function insertToFile({ tableName, columns, value }) {
  // 칼럼 추가 함수
  // column 개수와 일치하지 않으면 실패 메세지
  // id값은 1부터 시작해서 넣을 때마다 1씩 증가
  // 숫자는 따옴표 x, 문자열은 O
  // 성공한 경우 레코드 전체값 출력  : INSERTED(1, "BTS", 2020, "Dynamite")
}

function deleteFrom({ tableName, condition }) {
  // 칼럼 삭제 함수
  // condition에 맞는 레코드 삭제
  // condition은 칼럼 중 하나만 넣을 수 있다.
  // 조건에 맞는 게 없으면 실패 메세지
  // 성공한 경우 삭제한 레코드 전체값 출력
  // 성공한 경우 출력 형태 : DELETED(1, "BTS", 2020, "Dynamite")
}
