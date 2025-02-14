const COMPUTE = {
  name: 'computer',
  shape: ['+-------+', '|COMPUTE|', '+-------+'],
};

const DISPLAY = {
  name: 'display',
  shape: ['+-------+', '|       |', '|DISPLAY|', '|       |', '+-------+'],
};

const DRV = {
  name: 'drv',
  shape: ['    [DRV]'],
};

const ITEMS = [DRV, DISPLAY, COMPUTE]; // 가벼운 순으로 정렬
let stepCount = 0;

// 각 책상을 number을 key값으로, value를 배열로 저장
const tables = {
  table1: [COMPUTE, DISPLAY, DRV], // 초기값
  table2: [],
  table3: [],
};

// 출력 함수
function printWithFormat(n, start, to) {
  console.log(`Turn ${stepCount}`);
  formatTable(3, 9, tables); // 3x9 그리드
  console.log('1======== 2======== 3========');
  console.log(`${ITEMS[n].name}이 ${start}에서 ${to}로 이동`);
}

// 아이템 이동 함수
function move(n, start, to) {
  const item = tables[start].pop();
  tables[to].push(item);
  stepCount++;
  printWithFormat(n, start, to);
}

// 하노이 재귀 함수
function hanoi(n, start, to, via) {
  if (n === 0) return move(n, start, to);
  hanoi(n - 1, start, via, to);
  move(n, start, to);
  hanoi(n - 1, via, to, start);
}

// 테이블 포맷팅 함수 (3열, 9행 그리드)
function formatTable(cols, rows, tables) {
  const whitespace = '         '; // 7칸 공백
  const grid = Array.from({ length: rows }, () => Array(cols).fill(whitespace));

  // 테이블 데이터를 grid에 배치
  for (let col = 0; col < cols; col++) {
    let table = tables[`table${col + 1}`] || [];

    let row = rows - 1; // 아래에서 위로 채움
    for (let item of table) {
      for (let i = 0; i < item.shape.length; i++) {
        if (row - i >= 0) {
          grid[row - i][col] = item.shape[i]; // shape의 각 줄을 해당 row에 배치
        }
      }
      row -= item.shape.length; // shape 크기만큼 위로 이동
    }
  }

  // 📌 최종 출력
  console.log(grid.map((row) => row.join(' ')).join('\n'));
}

// 하노이 실행
hanoi(2, 'table1', 'table3', 'table2');
