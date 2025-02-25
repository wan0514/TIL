const dataPatterns = [
  {
    type: 'start',
    method: 'readUp',
    start: [20, 20],
    length: 2,
    valid: '1100',
  },
  {
    type: 'end',
    method: 'readDown',
    start: [19, 10],
    length: 2,
    valid: '0110',
  },
  { type: 'length', method: 'readUp', start: [18, 20] },

  { type: '#1', method: 'readUp', start: [14, 20] },
  { type: '#2', method: 'readCounterclockwise', start: [10, 20] },

  { type: '#3', method: 'readDown', start: [11, 18] },
  { type: '#4', method: 'readDown', start: [15, 18] },

  { type: '#5', method: 'readClockwise', start: [19, 18] },

  { type: '#6', method: 'readUp', start: [18, 16] },
  { type: '#7', method: 'readUp', start: [14, 16] },

  { type: '#8', method: 'readCounterclockwise', start: [10, 16] },

  { type: '#9', method: 'readDown', start: [11, 14] },
  { type: '#10', method: 'readDown', start: [15, 14] },

  { type: '#11', method: 'readClockwise', start: [19, 14] },

  { type: '#12', method: 'readUp', start: [18, 12] },
  { type: '#13', method: 'readUp', start: [14, 12] },
  { type: '#14', method: 'readUp', start: [10, 12] },
  { type: '#15', method: 'readUp', start: [5, 12] },

  { type: '#16', method: 'readCounterclockwise', start: [1, 12] },

  { type: '#17', method: 'readDown', start: [2, 10] },
  { type: '#18', method: 'readDown', start: [7, 10] },
  { type: '#19', method: 'readDown', start: [11, 10] },
  { type: '#20', method: 'readDown', start: [15, 10] },

  { type: 'error #1', method: 'readUp', start: [12, 8] },
  { type: 'error #2', method: 'readDown', start: [9, 5] },
  { type: 'error #3', method: 'readUp', start: [12, 3] },
  { type: 'error #4', method: 'readDown', start: [9, 1] },
];

export default dataPatterns;
