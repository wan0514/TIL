// 불변성 (Immutable) 값이나 변수를 적극 활용
// 함수가 참조 투명성을 지키고, 부작용을 줄일 수 있도록 구현
// 순수함수 (Pure Function) 로 구현
// 각 언어로 만들어진 다음 2개 클래스에서 중복된 코드를 줄이고, 함수형 표현으로 최대한 개선.

// ==============구현 ==============

//1. isFactor : 숫자를 받아 약수인지 확인
// 매개변수 : potentialFactor, number

function isFactor(number, potentialFactor) {
  return number % potentialFactor == 0;
}

//2. factors : 1~ 숫자의 제곱근만큼 반복하며 number의 약수배열을 반환
// // 매개변수 : number, isFactor(함수)

const factors = (number, isFactor) =>
  new Set(
    Array.from({ length: Math.floor(Math.sqrt(number)) }, (_, i) => i + 1)
      .filter((pod) => isFactor(number, pod))
      .flatMap((pod) => [pod, number / pod])
  );

// 🥊 Refactor : sum함수의 결과값을 매개변수로 넘겨주는 식으로 중복로직과 불필요한 함수 매개변수 전달을 제거

const isPerfect = (number, sumOfFactors) => sumOfFactors - number === number;

const isAbundant = (number, sumOfFactors) => sumOfFactors - number > number;

const isDeficient = (number, sumOfFactors) => sumOfFactors - number < number;

//6. sum : 약수 배열을 받아 다 더한값을 반환
// 매개변수 : factors
function sum(factors) {
  //set으로 들어올 경우 배열로 만든 후 reduce
  // [...factors] : 배열일 경우 원본이 그대로 참조되기 때문에 Array.from으로 변경
  return Array.from(factors).reduce((acc, cur) => acc + cur, 0);
}

// ======= 두번째 class 변경 ========
// 1. equalSet : 두 Set이 같은 요소를 가지는지 확인
// - 매개변수: aset(Set), bset(Set)
// - 반환값: boolean (true: 두 Set이 동일, false: 다름)

//🥊 Refactor : for,if문 없이 함수형으로 변경
const equalSet = (aset, bset) => {
  return (
    aset.size === bset.size && [...aset].every((a, i) => a === [...bset][i])
  );
};

// 2. isPrime : 주어진 숫자가 소수인지 확인
// - 매개변수: number (판별할 숫자), factors,
// - 조건:
//   - 숫자가 1보다 커야 함
//   - 약수 집합(factors)이 {1, number}와 동일해야 함b
// - 반환값: boolean (true: 소수, false: 소수 아님)
const isPrime = (number, factors, equalSet) => {
  const primeSet = new Set([1, number]);
  return number > 1 && equalSet(factors, primeSet);
};

// 3. 정사각수 함수
// 필요한 매개변수: number
// 반환값 : boolean(true: 정사각수, false: 정사각수 아님)

const isSquare = (number) => {
  const squareRoot = Math.sqrt(number);
  return Number.isInteger(squareRoot);
};

// ****함수형 코드 테스트****

const testNumber1 = 10;
const testNumber2 = 6;
const testNumber3 = 7;

const factors1 = factors(testNumber1, isFactor);
const factors2 = factors(testNumber2, isFactor);
const factors3 = factors(testNumber3, isFactor);

const sumOfFactor01 = sum(factors1);
const sumOfFactor02 = sum(factors2);

console.log(isPerfect(testNumber1, sumOfFactor01)); // false
console.log(isPerfect(testNumber2, sumOfFactor02)); // true

// 두번째 class 테스트
console.log(isPrime(testNumber1, factors1, equalSet)); // false (10은 소수가 아님)
console.log(isPrime(testNumber3, factors3, equalSet)); // true (7은 소수)

export {
  isFactor,
  factors,
  isPerfect,
  isAbundant,
  isDeficient,
  sum,
  equalSet,
  isPrime,
  isSquare,
};
