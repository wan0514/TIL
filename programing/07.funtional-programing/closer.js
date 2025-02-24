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

// 2. 2~100 자연수를 받아 완전수,과잉수,부족수,소수,정사각수를 판별하여 목록으로 출력

// 2-1. min~ max 숫자 배열 생성
const getArrayMinToMax = (min, max) => {
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
};

// 2-2. 완전수, 풍족수, 부족수 판별
const checkSumCategories = (number, factors, sum) => {
  if (isDeficient(number, factors, sum)) return 'deficient';
  if (isAbundant(number, factors, sum)) return 'abundant';
  if (isPerfect(number, factors, sum)) return 'perfect';
  return ''; // 빈 문자열 반환
};

// 2-3. 소수, 정사각수 판별
const checkOtherCategories = (number, factors, equalSet) => {
  if (isPrime(number, factors, equalSet)) return 'prime';
  if (isSquare(number)) return 'squared';
  return ''; // 빈 문자열 반환
};

//2-3. 출력 함수 : 클로저 사용
const printResult = (number) => (categories) => {
  if (categories.length > 0) {
    console.log(`${number} : ${categories.join(', ')}`);
  }
};

// ===== test =====

// 2부터 100까지 숫자 배열 만들기
const numbers = getArrayMinToMax(2, 4);

// 각 숫자에 대해 약수 목록 구하기
const factorsList = numbers.map((number) => factors(number, isFactor));

// 판별 결과 목록 출력
numbers.reduce((acc, number, index) => {
  const factorsOfNumber = factorsList[index];
  const category1 = checkSumCategories(number, factorsOfNumber, sum);
  const category2 = checkOtherCategories(number, factorsOfNumber, equalSet);

  const categories = [category1, category2].filter(Boolean); // 빈 문자열 제거

  printResult(number)(categories);

  return acc;
}, []);
