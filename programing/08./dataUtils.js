// 데이터 변환 및 관련 함수들

const getArrayFromString = (inputData) => {
  return inputData.map((string) => string.split(''));
};

const mergeErrorsToHex = (errors) => {
  return `0x${errors.map(binaryToHex).join('')}`;
};

const binaryToHex = (binaryString) => {
  return parseInt(binaryString, 2).toString(16).padStart(2, '0');
};

export { getArrayFromString, mergeErrorsToHex };
