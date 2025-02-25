import input from './input.js';
import readModule from './readModule.js';
import dataPatterns from './patterns.js';
import { decodeDataString } from './codeMap.js';
import { getArrayFromString, mergeErrorsToHex } from './dataUtils.js';

// 시작/끝 검증  validName : 'start' || 'end'
const isValid = (inputData, validName) => {
  const pattern = dataPatterns[validName];
  const result = extractPattern(pattern, inputData);
  return result === pattern.valid;
};

// 추출 함수
function extractPattern(pattern, inputData) {
  // ❌실수 : 시작과 끝 추출에서도 사용하려고 변경하였으나 extractPatterns에 Length를 넣지 않아 8비트가 추출됨
  return readModule[pattern.method](pattern.start, inputData, pattern.length);
}

// 길이값 추출
function getDataLength(inputData) {
  const lengthPattern = dataPatterns['length'];
  const binaryLength = extractPattern(lengthPattern, inputData);
  return parseInt(binaryLength, 2);
}

// 데이터 추출 (목록/에러 둘 다 유연하게 처리 가능)
const getPatterns = (inputData, length, prefix) => {
  return Array.from({ length }, (_, i) => {
    const type = `${prefix}${i + 1}`;
    const pattern = dataPatterns[type];

    return extractPattern(pattern, inputData);
  });
};

// 데이터 목록과 오류 데이터 추출 (람다식으로 함수 생성)
const getData = (inputData, length) => getPatterns(inputData, length, '#');
const getError = (inputData) => getPatterns(inputData, 4, 'error #');

// main 로직
function main(inputData) {
  const qrCodeArray = getArrayFromString(inputData);

  // 시작 및 끝 검증
  if (!isValid(qrCodeArray, 'start') || !isValid(qrCodeArray, 'end')) {
    return [];
  }

  // 길이와 데이터 추출
  const dataLength = getDataLength(qrCodeArray);
  const dataArray = getData(qrCodeArray, dataLength);
  const decodedDataString = decodeDataString(dataArray);
  const errorData = getError(qrCodeArray);
  const haxError = mergeErrorsToHex(errorData);

  return [decodedDataString, haxError];
}

//출력 함수
function printValue(value) {
  // 빈배열일 경우 추가
  if (value.length === 0) {
    console.log('No valid data or error.');
    return;
  }

  const line1 = `data = ${value[0]}, error = ${value[1]}`;
  console.log(line1);
  console.log(value);
}

const value = main(input);
printValue(value);
