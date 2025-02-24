// QR 코드 시작 & 종료 검증 함수
// 길이값 읽는 함수
// 데이터 비트 읽는 함수 (규칙에 맞게)
// 2진수를 문자로 변환하는 함수
// 에러 코드 추출 및 변환 함수
// 전체 디코딩 함수 (위 함수를 조합하여 최종 출력)

import input from './input.js';

// QR 코드 시작 & 종료 검증 함수
function isValidStart(input) {
  const startPattern = [
    { row: 20, column: 20, value: '1' },
    { row: 20, column: 19, value: '1' },
    { row: 19, column: 20, value: '0' },
    { row: 19, column: 19, value: '0' },
  ];

  return checkPattern(input, startPattern);
}

function isValidEnd(input) {
  const endPattern = [
    { row: 19, column: 10, value: '0' },
    { row: 19, column: 9, value: '1' },
    { row: 20, column: 10, value: '1' },
    { row: 20, column: 9, value: '0' },
  ];

  return checkPattern(input, endPattern);
}

// 공통된 패턴 체크 함수
function checkPattern(input, patternRules) {
  return patternRules.every(
    ({ row, column, value }) => input[row][column] === value
  );
}

// 2차원 배열로 반환
function getArrayFromString(input) {
  return input.map((string) => string.split(''));
}

// 길이값 읽는 함수
function getLength() {}

//=== test ===
const qrCodeArray = getArrayFromString(input);

console.log(isValidEnd(qrCodeArray));
console.log(isValidStart(qrCodeArray));
