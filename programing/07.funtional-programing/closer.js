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

// 1. 정사각수 함수
// 필요한 매개변수: number
// 반환값 : boolean(true: 정사각수, false: 정사각수 아님)

const isSquare = (number) => {
  const squareRoot = Math.sqrt(number);
  return Number.isInteger(squareRoot);
};

// ===== test =====
console.log(isSquare(4));
