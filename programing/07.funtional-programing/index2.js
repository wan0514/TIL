// 1. equalSet : 두 Set이 같은 요소를 가지는지 확인
// - 매개변수: aset(Set), bset(Set)
// - 반환값: boolean (true: 두 Set이 동일, false: 다름)
const equalSet = (aset, bset) => {
  if (aset.size !== bset.size) return false;
  for (const a of aset) if (!bset.has(a)) return false;
  return true;
};

// 2. isFactor : 주어진 숫자가 특정 숫자의 약수인지 확인
// - 매개변수: number (검사 대상 숫자), potentialFactor (약수 여부 확인할 숫자)
// - 조건: number를 potentialFactor로 나누었을 때 나머지가 0이면 약수
// - 반환값: boolean (true: 약수, false: 약수 아님)
const isFactor = (number, potentialFactor) => number % potentialFactor === 0;

// 3. factors : 주어진 숫자의 모든 약수를 찾음
// - 매개변수: number (약수를 구할 숫자), isFactor (약수 판별 함수)
// - 1부터 number의 제곱근까지 반복하며 약수인지 확인
// - 약수라면 해당 숫자와 그 몫을 Set에 추가
// - 반환값: Set (주어진 숫자의 모든 약수 포함)
const factors = (number, isFactor) =>
  new Set(
    Array.from({ length: Math.floor(Math.sqrt(number)) }, (_, i) => i + 1)
      .filter((pod) => isFactor(number, pod))
      .flatMap((pod) => [pod, number / pod])
  );

// 4. isPrime : 주어진 숫자가 소수인지 확인
// - 매개변수: number (판별할 숫자)
// - 조건:
//   - 숫자가 1보다 커야 함
//   - 약수 집합(factors)이 {1, number}와 동일해야 함
// - 반환값: boolean (true: 소수, false: 소수 아님)
const isPrime = (number) => {
  const primeSet = new Set([1, number]);
  return number > 1 && equalSet(factors(number, isFactor), primeSet);
};

// 테스트 코드
console.log(isPrime(10)); // false (10은 소수가 아님)
console.log(isPrime(7)); // true (7은 소수)
