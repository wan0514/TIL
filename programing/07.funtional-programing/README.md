# 함수형 프로그래밍 어떻게 학습할까?

이렇게 사고하면 함수형 프로그래밍 학습이 된다

- 큰 문제를 작은 함수로 나눈다 (각 판별 함수 만들기)
- 클로저를 활용해서 불필요한 연산을 피한다 (createClassifier로 한 번 계산)
- 고차함수를 적극 활용해서 선언형으로 처리한다 (map(), filter(), join())
- 불변성을 유지하고 부작용을 최소화한다 (모든 함수는 순수 함수)

---

## 🥊 리팩토링

### **기존 코드의 문제점**

1. **불필요한 매개변수 전달**:
   - `isPerfect`, `isAbundant`, `isDeficient` 함수에서 약수 배열과 합을 매개변수로 전달받는 방식은 함수의 의도를 모호하게 만들었고, 매개변수 전달을 더 복잡하게 했습니다.
2. **반복적인 로직**:
   - 약수 배열을 생성하고 그 합을 구하는 작업이 중복되어, 매번 새로운 배열을 생성하고 `reduce`를 사용하여 불필요하게 반복되는 코드가 작성되었습니다.
3. **클로저와 고차함수 미사용**:
   - 클로저와 고차함수를 제대로 활용하지 못해, 반복되는 판별 로직을 재사용할 수 없었습니다.

---

### **리팩토링 후 개선된 점**

#### **index.js**

1. **약수들의 총합을 매개변수로 전달**:

   - `isPerfect`, `isAbundant`, `isDeficient` 함수의 매개변수에서 `sum`과 `factorArray`를 전달받는 방식에서 벗어나, `sum` 값만 전달받도록 변경하여 의도를 더 명확히 했습니다. 이로 인해 불필요한 매개변수 전달이 사라졌습니다.

2. **`equalSet` 함수 함수형 스타일로 변경**:
   - `equalSet` 함수에서 `for`문을 사용하던 방식을 `every()`를 사용하여 함수형 스타일로 리팩토링하여 코드가 더 간결하고 읽기 쉬워졌습니다.

#### **closer.js**

1. **클로저 활용**:

   - 클로저를 활용하여 판별하는 함수를 반환하는 함수를 만들었습니다. 이로 인해 각 숫자에 대한 판별 로직을 반복적으로 재사용할 수 있게 되었으며, 중복을 줄였습니다.

2. **배열을 통한 반복**:

   - 2~100까지의 숫자 배열을 생성한 후, `map()`을 사용하여 각 숫자를 판별하는 함수에 전달하고, 그 결과를 반환하여 출력만 담당하는 함수에 전달했습니다. 이로써 출력 로직과 판별 로직을 명확히 분리했습니다.

3. **고차함수 활용**:

   - `map()`과 같은 고차함수를 적극 활용하여 배열을 반복하면서 판별 로직을 적용하고 결과를 반환하는 구조로 개선했습니다.

4. **책임 분리**:
   - 판별 로직과 출력 로직을 명확히 분리하여, 각 함수가 하나의 책임만을 맡도록 하였습니다. 이는 유지보수성과 가독성을 향상시켰습니다.

---

### **리팩토링 코드 예시**

```javascript
// index.js
const sumOfFactors = (sum) => sum - number;

// 판별 함수들
const isPerfect = (sumOfFactors) => sumOfFactors === number;
const isAbundant = (sumOfFactors) => sumOfFactors > number;
const isDeficient = (sumOfFactors) => sumOfFactors < number;

// closer.js
const createClassifier = (number) => {
  const factorList = factors(number, isFactor);
  const sumOfFactors = sum(factorList);

  return () => ({
    // number,
    perfect: isPerfect(number, sumOfFactors),
    Abundant: isAbundant(number, sumOfFactors),
    deficient: isDeficient(number, sumOfFactors),
    Prime: isPrime(number, factorList, equalSet),
    Square: isSquare(number),
  });
};

const classifyNumbers = (numbers) => {
  return numbers
    .map((number) => {
      const classify = createClassifier(number)();
      const categories = Object.keys(classify)
        .filter((key) => classify[key])
        .join(',');

      return `${number} : ${categories}`;
    })
    .join('\n');
};
```
