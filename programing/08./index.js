// ==== 설게 ====
// QR 코드 시작 & 종료 검증 함수
// 길이값
// 데이터 비트  (규칙에 맞게)
// 2진수를 문자로 변환
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
import CODE_MAP from './codeMap.js';

// inputData을 2차원 배열로 반환
function getArrayFromString(inputData) {
  return inputData.map((string) => string.split(''));
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

//검증 함수
function validatePattern(pattern, inputData) {
  const { method, start, length, valid } = pattern;
  // 검증할 패턴이 아니면 false반환
  if (!valid) return false;

  const result = getReadFunction(method)(start, inputData, length);
  return result === valid;
}

// QR 코드 시작 & 종료 검증
const isStartValid = (inputData) => {
  const pattern = dataPatterns.find((p) => p.type === 'start');
  return validatePattern(pattern, inputData);
};

const isEndValid = (inputData) => {
  const pattern = dataPatterns.find((p) => p.type === 'end');
  return validatePattern(pattern, inputData);
};

// 추출 함수
function extractPattern(pattern, inputData) {
  return getReadFunction(pattern.method)(pattern.start, inputData);
}

// 길이값 추출
function getDataLength(inputData) {
  const lengthPattern = dataPatterns.find(
    (pattern) => pattern.type === 'length'
  );
  const binaryLength = extractPattern(lengthPattern, inputData); // 2진수 문자열 반환
  const decimalLength = parseInt(binaryLength, 2); // 2진수 → 10진수

  return decimalLength;
}

// data 목록 추출
const getData = (inputData, length) => {
  let result = [];

  for (let i = 1; i <= length; i++) {
    const type = `#${i}`;
    const data = extractPattern(
      dataPatterns.find((p) => p.type === type),
      inputData
    );
    result.push(data);
  }

  return result;
};

//데이터 디코딩(CODE_MAP 기반)
const decodeDataString = (inputData) => {
  return inputData
    .map((binaryString) => convertBinaryToDecimal(binaryString)) // 이진수 → 10진수로 변환
    .map((decimalValue) => CODE_MAP[decimalValue]) // 10진수 → 디코딩
    .join('');
};

// 이진수를 10진수로 변환
const convertBinaryToDecimal = (binaryString) => {
  return parseInt(binaryString, 2);
};

// 2진수를 16진수로 변환
const binaryToHex = (binaryString) => {
  return parseInt(binaryString, 2).toString(16).padStart(2, '0');
};

// 여러 개의 값을 16진수로 변환 후 합치기
const mergeErrorsToHex = (errors) => {
  return `0x${errors.map(binaryToHex).join('')}`;
};

// 에러 추출
const getError = (inputDataData) => {
  const errorLength = 4;
  let errorArray = [];
  for (let i = 1; i <= errorLength; i++) {
    const type = `error #${i}`;
    const data = extractPattern(
      dataPatterns.find((p) => p.type === type),
      inputDataData
    );
    errorArray.push(data);
  }

  // 16진수로 변환
  const result = mergeErrorsToHex(errorArray);

  return result;
};

//main 로직
function main(inputData) {
  //2차원 배열로 변환
  const qrCodeArray = getArrayFromString(inputData);

  // 만약 시작,끝 검증 안될 시 빈배열 반환
  if (!isStartValid(qrCodeArray) || !isEndValid(qrCodeArray)) {
    return [];
  }

  //길이
  const dataLength = getDataLength(qrCodeArray);
  // 데이터 배열
  const dataArray = getData(qrCodeArray, dataLength);
  //데이터 문자열로 변경
  const decodedDataString = decodeDataString(dataArray);
  //error 데이터
  const errorData = getError(qrCodeArray);

  // 반환 : 디코딩데이터, 에러데이터
  return { data: decodedDataString, error: errorData };
}

// print 함수
function printValue(value) {
  const line1 = `data = ${value.data}, error = ${value.error}`;
  const line2 = value;
  console.log(line1);
  console.log(line2);
}

const value = main(input);
printValue(value);

//=== test ===

// // console.log(isStartValid(qrCodeArray)); //true
// // console.log(isEndValid(qrCodeArray)); //ture

// // const dataLength = getDataLength(qrCodeArray);
// // const dataArray = getData(qrCodeArray, dataLength);

// console.log(dataLength); //5
// console.log(dataArray); // [ '00001010', '00101010', '00001011', '00101010', '00001100' ]
