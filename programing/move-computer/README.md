### 코드 설계 의도 및 구현 방식

### **필요한 기능**

1. **포맷 기능**
   - 책상의 고정 위치와 물건 배치 상태를 시각적으로 포맷해야 함.
2. **물건 이동 기능**
   - 무게 데이터를 기반으로 이동 조건을 설정하고, 물건을 이동하는 기능이 필요함.
3. **완료 단계 계산 기능**
   - 완료까지 필요한 스텝 수를 계산하고, 각 스텝의 상태를 저장해야 함.
4. **결과 비교 및 출력 기능**
   - 입력값과 완료 단계를 비교하여 결과를 출력해야 함.

---

### **데이터 구조**

1. **책상 데이터 (`tables`)**
   - 객체 구조를 사용하여 책상을 key로, 해당 위치의 물건을 배열로 관리.
   - 초기 상태: `table1`에 모든 물건이 배치되고, `table2`, `table3`은 빈 배열.
   ```javascript
   const tables = {
     table1: [COMPUTE, DISPLAY, DRV], // 초기값
     table2: [],
     table3: [],
   };
   ```
2. **물건 데이터 (`ITEMS`)**

   - 각 물건을 객체로 관리하며,
     - `name`: 물건의 이름
     - `shape`: 출력 시 사용할 문자열 배열 (물건의 시각적 표현)

   ```javascript
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
   ```

   > 🚀 개선방향: 처음 설계시 무게 데이터도 필요하다 생각해서 객체로 설정했으나, 로직 구현 후 shape 데이터만 가지고 있어도 되었겠다는 판단이 섰습니다. 따라서 추후 리팩토링 때 각 물건의 타입을 배열로 두고 shape을 넣으면 조금 더 간단하게 로직을 구현할 수 있을 것 같습니다.

3. **스텝 데이터 (`stepCount`)**
   - 현재 진행된 스텝을 숫자로 관리.
   - 각 스텝에서 물건의 이동 상태를 출력하는 기능 포함.
   ```javascript
   let stepCount = 0;
   ```

---

### **구현 내용 요약**

1. **출력 함수 (`printWithFormat`)**

   - 현재 스텝(`Turn n`)과 테이블 상태를 출력.
   - 이동된 물건(n)과 출발지(start)-목적지(to)를 표시.

   ```javascript
   function printWithFormat(n, start, to) {
     console.log(`Turn ${stepCount}`);
     formatTable(3, 9, tables); // 3x9 그리드
     console.log('1======== 2======== 3========');
   }
   ```

   > 🚀 개선방향:출력할 것은 turn, 그리드, table을 따로 출력을 하고 있으나 이를 추후 하나의 함수에 넣어서 정리하려 합니다.

2. **물건 이동 함수 (`move`)**
   - `tables` 객체에서 물건을 꺼내 새로운 위치에 추가.
   - 스텝 수 증가 후 `printWithFormat` 호출.
   ```javascript
   function move(n, start, to) {
     const item = tables[start].pop();
     tables[to].push(item);
     stepCount++;
     printWithFormat(n, start, to);
   }
   ```
3. **재귀 함수 (`hanoi`)**
   - 하노이 탑 알고리즘을 활용하여 물건을 순서에 맞게 이동.
   ```javascript
   function hanoi(n, start, to, via) {
     if (n === 0) return move(n, start, to);
     hanoi(n - 1, start, via, to);
     move(n, start, to);
     hanoi(n - 1, via, to, start);
   }
   ```
4. **출력 포맷팅 함수 (`formatTable`)**
   - 3x9의 그리드 배열을 생성하고, 기본값으로 공백9칸을 설정했습니다.
   - 책상의 각 물건을 그리드 상에 배치한 후 출력시켰습니다.
   - 물건이 존재하면 빈공백 대신 물건의 shape가 차례대로 들어가며, 존재하지 않으면 공백을 유지합니다.

> 기존 객체로 table1,2,3 에 push,pop으로 넣어두었던 각 물건의 shape을 순회하며 이차원 배열의 (x,y)좌표에 넣어 출력을 위한 포맷을 시켰습니다.

```javascript
function formatTable(cols, rows, tables) {
  const whitespace = '         '; // 9칸 공백
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
```

> 🚀 개선방향: 3중 for문에 if문 까지 겹치니 코드가 너무 복잡해졌습니다. 개선점이 필요해보입니다... 5. **하노이 실행 (`hanoi(2, 'table1', 'table3', 'table2')`)**

```javascript
hanoi(2, 'table1', 'table3', 'table2');
```

5. 입 출력 값

재귀함수로 출력된 각 step의 구조를 배열이나 객체에 담아두고, 해당하는 step을 입력 받았을 때 같은 step 구조를 찾아 반환하게끔 했습니다.

> 설계는 위와 같으나 완성하지 못해서, 추후 리팩토링 과정을 거치며 만들어볼 생각입니다.
