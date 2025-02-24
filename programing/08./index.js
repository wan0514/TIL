// QR 코드 시작 & 종료 검증 함수
// 길이값 읽는 함수
// 데이터 비트 읽는 함수 (규칙에 맞게)
// 2진수를 문자로 변환하는 함수
// 에러 코드 추출 및 변환 함수
// 전체 디코딩 함수 (위 함수를 조합하여 최종 출력)

import input from './input.js';
import {
  readCounterclockwise,
  readClockwise,
  readUp,
  readDown,
} from './readModule.js';

// QR 코드 시작 & 종료 검증 함수
function isValidStart(input) {
  const validNumber = '1100';
  const result = readUp(20, 20, input);

  return result === validNumber;
}

function isValidEnd(input) {
  const validNumber = '0110';
  const result = readDown(19, 10, input);
  return result === validNumber;
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
