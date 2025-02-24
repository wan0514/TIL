/*
[학습목표]
- 클로저를 선언해서 매개변수 또는 리턴값으로 전달할 수 있다
- map, filter, reduce 고차 함수를 활용할 수 있다
- 클로저 관련된 다양한 표현을 학습한다 

[기능요구사항]
- 앞서 작성한 자연수 분류 ClassifierAlpha, PrimeAlpha 를 이용해서 2-100까지 자연수 중에서
- 완전수(perfect), 과잉수(Abundant), 부족수(Deficient), 소수(Prime), 정사각수(Squared) 목록을 출력한다.

[프로그래밍]
- map, filter, reduce 고차 함수를 활용한다.
- 출력을 위해서는 반드시 클로저(또는 람다)를 선언하고 반복문 대신 reduce를 활용해서 출력해야 한다.
- 자연수 중에서 다른 자연수의 제곱으로 표현되는 정사각수(squared) 판단 함수를 추가한다
*/

import {
  isFactor,
  factors,
  isPerfect,
  isAbundant,
  isDeficient,
  sum,
  equalSet,
  isPrime,
} from './index.js';

// 1. 정사각수 함수
// 필요한 매개변수: number
// 반환값 : boolean(true: 정사각수, false: 정사각수 아님)

const isSquare = (number) => {
  const squareRoot = Math.sqrt(number);
  return Number.isInteger(squareRoot);
};

// 2. 2~100 자연수를 받아 완전수,과잉수,부족수,소수,정사각수를 판별하여 목록으로 출력

// 약수 목록 구하기

// min~ max 숫자 배열 생성
const getArrayMinToMax = (min, max) => {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
};

// 숫자를 조건별로 판별하기 (완전수, 풍족수, 부족수, 소수, 정사각수)
// return : 판별된 이름  (ex: ['deficient', 'prime'])
const checkCategory = (number, factors, sum, equalSet) => {
  const categories = [
    { name: 'deficient', check: isDeficient(number, factors, sum) },
    { name: 'abundant', check: isAbundant(number, factors, sum) },
    { name: 'perfect', check: isPerfect(number, factors, sum) },
    { name: 'prime', check: isPrime(number, factors, equalSet) },
    { name: 'squared', check: isSquare(number) },
  ];

  //판별할 함수를 전부 체크한 후, true인 항목들만 filter. 그 항목들에서 name만 추출
  return categories
    .filter((category) => category.check)
    .map((category) => category.name);
};

//출력 함수 : 클로저 사용
const printResult = (number) => (categories) => {
  if (categories.length > 0) {
    console.log(`${number} : ${categories.join(', ')}`);
  }
};

// ===== test =====

// 2부터 100까지 숫자 배열 만들기
const numbers = getArrayMinToMax(2, 100);

// 각 숫자에 대해 약수 목록 구하기
const factorsList = numbers.map((number) => factors(number, isFactor));

// 판별 결과 목록 출력
numbers.reduce((acc, number, index) => {
  const factorsOfNumber = factorsList[index];
  const categories = checkCategory(number, factorsOfNumber, sum, equalSet);

  printResult(number)(categories);

  return acc;
}, []);
