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
import dataPatterns from './patterns.js';

// input을 2차원 배열로 반환
function getArrayFromString(input) {
  return input.map((string) => string.split(''));
}

//시작,끝 검증 함수
function validatePattern(pattern, input) {
  const { method, start, length, valid } = pattern;
  if (!valid) return false;

  const result = getReadFunction(method)(start, input, length);
  return result === valid;
}

// 추출 함수
function extractPattern(pattern, input) {
  return getReadFunction(pattern.method)(pattern.start, input);
}

//매소드 호출
function getReadFunction(method) {
  const methods = {
    readUp,
    readDown,
    readCounterclockwise,
    readClockwise,
  };

  return methods[method];
}

// QR 코드 시작 & 종료 검증
const isStartValid = (input) => {
  const pattern = dataPatterns.find((p) => p.type === 'start');
  const validation = validatePattern(pattern, input);
  return validation;
};

const isEndValid = (input) => {
  const pattern = dataPatterns.find((p) => p.type === 'end');
  const validation = validatePattern(pattern, input);
  return validation;
};

// 길이값 읽는 함수
function getDataLength(input) {
  const lengthPattern = dataPatterns.find(
    (pattern) => pattern.type === 'length'
  );
  const binaryLength = extractPattern(lengthPattern, input); // 2진수 문자열 반환
  const decimalLength = parseInt(binaryLength, 2); // 2진수 → 10진수

  return decimalLength;
}

// data 목록 추출

const getData = (input, length) => {
  let result = [];

  for (let i = 1; i <= length; i++) {
    const type = `#${i}`;
    const data = extractPattern(
      dataPatterns.find((p) => p.type === type),
      input
    );
    result.push(data);
  }

  return result;
};

//=== test ===
const qrCodeArray = getArrayFromString(input);

console.log(isStartValid(qrCodeArray)); //true
console.log(isEndValid(qrCodeArray)); //ture

const dataLength = getDataLength(qrCodeArray);
const dataArray = getData(qrCodeArray, dataLength);

console.log(dataLength); //5
console.log(dataArray); // [ '00001010', '00101010', '00001011', '00101010', '00001100' ]
