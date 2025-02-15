// csv 파일 생성 및 읽기 연습

// 파일 읽기 (쉼표와 개행으로 이루어진 csv파일을 배열 데이터로 읽기)
const CSV_FILE = `이름,나이,직업
홍길동,30,개발자
김철수,25,디자이너
이영희,27,마케터`;

const rows = CSV_FILE.split('\n').map((row) => row.split(','));

// console.log(rows);

// 파일 생성 (배열 data를 개행과 쉼표로 csv파일 만들기)

const data = [
  ['이름', '나이', '직업'],
  ['홍길동', '30', '개발자'],
  ['김철수', '25', '디자이너'],
  ['이영희', '27', '마케터'],
];

const csvString = data.map((row) => row.join(',')).join('\n');

console.log(csvString);
