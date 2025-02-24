// QR 코드 시작 & 종료 검증 함수
// 길이값 읽는 함수
// 데이터 비트 읽는 함수 (규칙에 맞게)
// 2진수를 문자로 변환하는 함수
// 에러 코드 추출 및 변환 함수
// 전체 디코딩 함수 (위 함수를 조합하여 최종 출력)

import input from './input.js';

// QR 코드 시작 & 종료 검증 함수
function isValidStart(input) {
  return (
    input[20][20] === '1' &&
    input[20][19] === '1' &&
    input[19][20] === '0' &&
    input[19][19] === '0'
  );
}

function isValidEnd(input) {
  return (
    input[19][10] === '0' &&
    input[19][9] === '1' &&
    input[20][10] === '1' &&
    input[20][9] === '0'
  );
}
// 2차원 배열로 반환
function getArrayFromString(input) {
  return input.map((string) => string.split(''));
}

const qrCodeArray = getArrayFromString(input);

//=== test ===
console.log(isValidEnd(qrCodeArray));
console.log(isValidStart(qrCodeArray));
