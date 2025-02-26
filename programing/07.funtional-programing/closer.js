import {
  isFactor,
  factors,
  isPerfect,
  isAbundant,
  isDeficient,
  sum,
  equalSet,
  isPrime,
  isSquare,
} from './index.js';

//개선할 점
/*
1. 클로저와 람다를 활용해서 중복을 줄이자
중복되는 연산(약수 합 구하기 등)을 미리 계산해서 재사용하면 좋음.
sumOfFactors(number, factorArray, sum) 같은 함수로 분리한 것처럼,
**"한 번 계산한 값은 다시 계산하지 않도록 클로저를 활용"**할 수 있음.
예를 들어, 각 숫자의 판별 결과를 리턴하는 함수를 클로저로 만들면 재사용하기 쉬움.

2. 2부터 100까지 map()을 활용해서 판별 결과를 출력하자
이제 2~100까지 숫자를 배열로 만든 후 map()을 써서 변환

3. 출력은 값을 받아서 출력만 시키게
*/

// 미션:  2~100 자연수를 받아 완전수,과잉수,부족수,소수,정사각수를 판별하여 목록으로 출력

// min~ max 숫자 배열 생성
const getArrayMinToMax = (min, max) => {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
};

// 🥊 Refactor : 클로저를 활용해서 number을 받았을 때 판별결과를 반환시키기

const createClassifier = (number) => {
  const factorList = factors(number, isFactor);
  const sumOfFactors = sum(factorList);

  // 완전수, 풍족수, 부족수 판별 함수 클로저로 반환
  return () => ({
    // number,
    perfect: isPerfect(number, sumOfFactors),
    Abundant: isAbundant(number, sumOfFactors),
    deficient: isDeficient(number, sumOfFactors),
    Prime: isPrime(number, factorList, equalSet),
    Square: isSquare(number),
  });
};

// 판별 반복
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

const printValue = (value) => {
  console.log(value);
};

// ===== test =====

// 2부터 100까지 숫자 배열 만들기
const numberArray = getArrayMinToMax(2, 100);

printValue(classifyNumbers(numberArray));
