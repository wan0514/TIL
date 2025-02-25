const CODE_MAP = {
  '00': '0',
  '01': '1',
  '02': '2',
  '03': '3',
  '04': '4',
  '05': '5',
  '06': '6',
  '07': '7',
  '08': '8',
  '09': '9',
  10: 'A',
  11: 'B',
  12: 'C',
  13: 'D',
  14: 'E',
  15: 'F',
  16: 'G',
  17: 'H',
  18: 'I',
  19: 'J',
  20: 'K',
  21: 'L',
  22: 'M',
  23: 'N',
  24: 'O',
  25: 'P',
  26: 'Q',
  27: 'R',
  28: 'S',
  29: 'T',
  30: 'U',
  31: 'V',
  32: 'W',
  33: 'X',
  34: 'Y',
  35: 'Z',
  36: ' ',
  37: '$',
  38: '%',
  39: '*',
  40: '+',
  41: '-',
  42: '.',
  43: '/',
  44: ':',
};

// 데이터 디코딩 (CODE_MAP 기반)
const decodeDataString = (inputData) => {
  return inputData
    .map((binaryString) => parseInt(binaryString, 2)) // 2진수 -> 10진수 변환
    .map((decimalValue) => CODE_MAP[decimalValue])
    .join('');
};

export { decodeDataString };
