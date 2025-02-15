import fs from 'fs';
import path from 'path';
// csv 파일 생성 및 읽기 연습

// >파일 읽기 (쉼표와 개행으로 이루어진 csv파일을 배열 데이터로 읽기)
const CSV_FILE = `이름,나이,직업
홍길동,30,개발자
김철수,25,디자이너
이영희,27,마케터`;

const rows = CSV_FILE.split('\n').map((row) => row.split(','));

// console.log(rows);

// >파일 생성 (배열 data를 개행과 쉼표로 csv파일 만들기)

const data = [
  ['이름', '나이', '직업'],
  ['홍길동', '30', '개발자'],
  ['김철수', '25', '디자이너'],
  ['이영희', '27', '마케터'],
];

const csvString = data.map((row) => row.join(',')).join('\n');

// console.log(csvString);

// >현재 파일의 URL을 가져와서 경로로 변환
const currentDir = new URL('.', import.meta.url).pathname;

// >같은 디렉토리 내에 'output.csv' 파일 경로 생성
const filePath = path.join(currentDir, 'output.csv');

fs.writeFile(filePath, csvString, 'utf8', (err) => {
  if (err) throw err;
  console.log('File has been saved!');
});

//fs readFile 이용해서 생성한 파일 읽기

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;

  const parsedData = data.split('\n').map((item) => item.split(','));
  console.log(parsedData);
});

// fs unlink 사용하여 파일 삭제
fs.unlink(filePath, (err) => {
  if (err) throw err;

  console.log('File has been deleted!');
});
