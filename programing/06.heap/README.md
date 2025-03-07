# HEAP 구현 미션

## 설계

### `Heap` 클래스 설계

#### 1. **Constructor**:

- 메모리 배열을 빈 배열로 선언합니다.
- `types` 속성을 추가하여, 각 타입의 정보를 객체로 저장합니다.
  => (refector)`types`는 private field로 설정하여 set,get함수가 아니면 외부에서 수정할 수 없게 합니다.
- `heap` 배열을 빈배열로 선언합니다.

#### 2. **`init` 메서드**:

- `heapSize` 매개변수를 받아, 해당 크기의 메모리 배열을 초기화합니다.
- 배열의 길이는 변하지 않으며, 각 항목은 `{ 할당여부: false }`로 초기화됩니다.
  => (refector) `{type: null, totalSize: 0, isAllocated: false}`로 초기화합니다.
- `base address`를 0x000~0xA000 사이로 지정하고, 이를 반환합니다.

#### 3. **`setSize` 메서드**:

- `type` (문자열)과 `length` (숫자)를 매개변수로 받습니다.
- 타입이 이미 존재하면 에러를 던집니다. 이를 위해 `get`과 `set` 메서드를 사용하여 타입을 수정할 수 없도록 합니다.
- `length`는 1, 2, 4, 8, 16, 32 중 하나여야 하며, 유효성 검사를 합니다.
- 타입 정보는 `types` 객체에 저장되며, 각 타입은 `length`와 함께 관리됩니다.

#### 4. **`malloc` 메서드**:

- `type` (문자열)과 `count` (숫자)를 매개변수로 받습니다.
- `types` 객체에서 `type`을 찾고, 존재하지 않으면 에러를 반환합니다.
- `length`가 8보다 작은 경우, `Math.ceil()`을 사용하여 패딩을 추가하고, 메모리를 할당합니다.
- 메모리는 기본 `length` 값을 계산하여 할당 가능한 인덱스 범위(공간)을 찾고 저장됩니다.
- 각 메모리 항목은 `{type, totalSize, isAllocated: true}` 형태로 저장됩니다.
- 할당된 메모리의 상대 주소는 `length`로 반환됩니다.

#### 5. **`free` 메서드**:

- `pointer` (상대주소)를 매개변수로 받습니다.
- `pointer`는 상대주소를 10진수로 변환하여 힙 배열의 인덱스를 찾습니다.
- 해당 인덱스에서 크기만큼 할당된 공간을 `false`로 설정하여 메모리를 해제합니다.
- slice나 splice를 쓰지 않고 단순히 할당 여부(boolean)만 변경하여 메모리를 비웁니다. (이유: 배열 인덱스 바뀔 위험 존재)

## 🚨 실제 힙과 다른 점

- 연결 리스트 기반 메모리 관리가 아님

### 실제 힙은 연결 리스트 또는 트리 구조를 활용해서 메모리 블록을 관리하는데, 너의 코드는 단순한 배열을 사용해서 메모리를 할당하고 해제.

따라서 단편화(메모리 조각화) 문제가 생길 가능성이 높다.
할당된 메모리 크기를 개별 블록에 저장

### 실제 힙에서는 메모리 블록마다 헤더(Header) 정보를 둬서 크기, 상태, 이전/다음 블록의 주소를 저장.

하지만 너의 코드는 배열에 { type, totalSize, isAllocated } 정보를 저장하는 방식이라, 개별 블록이 아니라 블록 단위로 할당된 영역을 구분하는 방법이 다름.
메모리 병합(메모리 해제 후 인접한 빈 블록을 합치는 과정)이 없음

### 실제 힙 관리자는 free 후, 인접한 빈 블록을 합쳐서 단편화를 줄이는 병합(Coalescing) 기능이 존재.

하지만 너의 Heap에서는 할당 해제 시 개별 블록을 isAllocated: false로 바꾸지만 병합 과정이 없음.
malloc에서 Best-fit / First-fit / Buddy Allocation 같은 전략이 없음

### 실제 힙 관리자는 최적의 메모리 블록을 찾는 알고리즘(Best-fit, First-fit, Buddy System 등)을 사용.

너의 findAvailableSpace는 단순하게 첫 번째로 맞는 빈 공간을 찾는 방식이라 메모리 활용 효율이 낮을 수 있다.

## ✅ 개선할 점

- 단편화 문제 해결을 위해 병합(Coalescing) 기능 추가

- free 실행 후, 인접한 빈 블록을 병합하는 로직 추가.
  할당 전략 추가 (Best-fit, First-fit, Worst-fit)

- 현재 findAvailableSpace는 First-fit 방식인데, Best-fit 같은 전략을 추가하면 메모리 낭비를 줄일 수 있음.
  할당된 블록의 메타데이터 개선

- 현재는 블록마다 totalSize를 저장하는데, 헤더 개념을 추가해서 시작 블록에만 size와 prev/next 정보를 저장하면 더 실제 힙과 비슷해짐.
  더 효율적인 메모리 검색을 위해 데이터 구조 개선

- 연결 리스트(Linked List)나 **프리 리스트(Free List, 빈 블록을 따로 관리하는 구조)**를 추가하면 메모리 탐색 속도가 향상될 수 있음.
