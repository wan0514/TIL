const dataPatterns = {
  start: {
    method: 'readUp',
    start: [20, 20],
    length: 2,
    valid: '1100',
  },
  end: {
    method: 'readDown',
    start: [19, 10],
    length: 2,
    valid: '0110',
  },
  length: {
    method: 'readUp',
    start: [18, 20],
  },
  '#1': {
    method: 'readUp',
    start: [14, 20],
  },
  '#2': {
    method: 'readCounterclockwise',
    start: [10, 20],
  },
  '#3': {
    method: 'readDown',
    start: [11, 18],
  },
  '#4': {
    method: 'readDown',
    start: [15, 18],
  },
  '#5': {
    method: 'readClockwise',
    start: [19, 18],
  },
  '#6': {
    method: 'readUp',
    start: [18, 16],
  },
  '#7': {
    method: 'readUp',
    start: [14, 16],
  },
  '#8': {
    method: 'readCounterclockwise',
    start: [10, 16],
  },
  '#9': {
    method: 'readDown',
    start: [11, 14],
  },
  '#10': {
    method: 'readDown',
    start: [15, 14],
  },
  '#11': {
    method: 'readClockwise',
    start: [19, 14],
  },
  '#12': {
    method: 'readUp',
    start: [18, 12],
  },
  '#13': {
    method: 'readUp',
    start: [14, 12],
  },
  '#14': {
    method: 'readUp',
    start: [10, 12],
  },
  '#15': {
    method: 'readUp',
    start: [5, 12],
  },
  '#16': {
    method: 'readCounterclockwise',
    start: [1, 12],
  },
  '#17': {
    method: 'readDown',
    start: [2, 10],
  },
  '#18': {
    method: 'readDown',
    start: [7, 10],
  },
  '#19': {
    method: 'readDown',
    start: [11, 10],
  },
  '#20': {
    method: 'readDown',
    start: [15, 10],
  },
  'error #1': {
    method: 'readUp',
    start: [12, 8],
  },
  'error #2': {
    method: 'readDown',
    start: [9, 5],
  },
  'error #3': {
    method: 'readUp',
    start: [12, 3],
  },
  'error #4': {
    method: 'readDown',
    start: [9, 1],
  },
};

export default dataPatterns;
