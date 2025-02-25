import input from './input.js';
import {
  readCounterclockwise,
  readClockwise,
  readUp,
  readDown,
} from './readModule.js';
import dataPatterns from './patterns.js';
import CODE_MAP from './codeMap.js';

// InputData을 2차원 배열로 반환
function getArrayFromString(inputData) {
  return inputData.map((string) => string.split(''));
}

// 읽기 함수 매핑
function getReadFunction(method) {
  const methods = {
    readUp,
    readDown,
    readCounterclockwise,
    readClockwise,
  };
  return methods[method];
}

// 검증 함수: 패턴 유효성 검사
function validatePattern(pattern, inputData) {
  const { method, start, length, valid } = pattern;
  if (!valid) return false;
  const result = getReadFunction(method)(start, inputData, length);
  return result === valid;
}

// 시작/끝 검증
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

// 데이터 디코딩 (CODE_MAP 기반)
const decodeDataString = (inputData) => {
  return inputData
    .map((binaryString) => convertBinaryToDecimal(binaryString))
    .map((decimalValue) => CODE_MAP[decimalValue])
    .join('');
};

// 이진수를 10진수로 변환 : 데이터 디코딩에 필요
const convertBinaryToDecimal = (binaryString) => {
  return parseInt(binaryString, 2);
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

// 여러 값을 16진수로 변환 후 합치기
const mergeErrorsToHex = (errors) => {
  return `0x${errors.map(binaryToHex).join('')}`;
};

// 16진수 변환 함수
const binaryToHex = (binaryString) => {
  return parseInt(binaryString, 2).toString(16).padStart(2, '0');
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
