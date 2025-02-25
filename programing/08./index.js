import input from './input.js';
import readModule from './readModule.js';
import dataPatterns from './patterns.js';
import { decodeDataString } from './codeMap.js';
import { getArrayFromString, mergeErrorsToHex } from './dataUtils.js';

// 시작/끝 검증
const isStartValid = (inputData) => {
  const pattern = dataPatterns.find((p) => p.type === 'start');
  const result = extractPattern(pattern, inputData);
  return result === pattern.valid;
};

const isEndValid = (inputData) => {
  const pattern = dataPatterns.find((p) => p.type === 'end');
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
  const lengthPattern = dataPatterns.find(
    (pattern) => pattern.type === 'length'
  );
  const binaryLength = extractPattern(lengthPattern, inputData);
  return parseInt(binaryLength, 2);
}

// 데이터 목록 추출
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

// 에러 추출 함수
const getError = (inputData) => {
  const errorLength = 4;

  let errorArray = [];
  for (let i = 1; i <= errorLength; i++) {
    const type = `error #${i}`;
    const data = extractPattern(
      dataPatterns.find((p) => p.type === type),
      inputData
    );
    errorArray.push(data);
  }
  return mergeErrorsToHex(errorArray);
};

// main 로직
function main(inputData) {
  const qrCodeArray = getArrayFromString(inputData);

  // 시작 및 끝 검증
  if (!isStartValid(qrCodeArray) || !isEndValid(qrCodeArray)) {
    return [];
  }

  // 길이와 데이터 추출
  const dataLength = getDataLength(qrCodeArray);
  const dataArray = getData(qrCodeArray, dataLength);
  const decodedDataString = decodeDataString(dataArray);
  const errorData = getError(qrCodeArray);

  return [decodedDataString, errorData];
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
