// 불변성 (Immutable) 값이나 변수를 적극 활용할 수 있다.
// 함수가 참조 투명성을 지키고, 부작용을 줄일 수 있도록 구현할 수 있다.
// 순수함수 (Pure Function) 로 구현할 수 있다.
// 각 언어로 만들어진 다음 2개 클래스에서 중복된 코드를 줄이고,
// 함수형 표현으로 최대한 개선한다.

// ==============구현 ==============

//1. isFactor : 숫자를 받아 약수인지 확인
// 매개변수 : potentialFactor, number

function isFactor(number, potentialFactor) {
  return number % potentialFactor == 0;
}

//2. factors : 1~ 숫자의 제곱근만큼 반복하며 number의 약수배열을 반환
// // 매개변수 : number, isFactor(함수)

const factors = (number, isFactor) =>
  Array.from({ length: Math.floor(Math.sqrt(number)) }, (_, i) => i + 1)
    .filter((pod) => isFactor(number, pod))
    .flatMap((pod) => [pod, number / pod]);

//3. isPerfect : 완전수 확인, boolean 반환
//  매개변수 : number, factorArray, sum(함수)

function isPerfect(number, factorArray, sum) {
  return sum(factorArray) - number === number;
}

//4. isAbundant : 풍족수 확인, boolean 반환
//  매개변수 : number, factorArray, sum(함수)

function isAbundant(number, factorArray, sum) {
  return sum(factorArray) - number > number;
}

//5. isDeficient : 부족수 확인, boolean 반환
//  매개변수 : number, factorArray, sum(함수)

function isDeficient(number, factorArray, sum) {
  return sum(factorArray) - number < number;
}
//6. sum : 약수 배열을 받아 다 더한값을 반환
// 매개변수 : factors

function sum(factors) {
  return factors.reduce((acc, cur) => acc + cur, 0);
}

// ****함수형 코드 테스트****

const testNumber1 = 10;
const testNumber2 = 6;

const factors1 = factors(testNumber1, isFactor);
const factors2 = factors(testNumber2, isFactor);

console.log(isPerfect(testNumber1, factors1, sum)); // false
console.log(isPerfect(testNumber2, factors2, sum)); // true
