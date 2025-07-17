"use strict";

// this는 함수가 호출했을 때 결정되는 특별한 식별자
// 호출방식에 따라 참조 대상이 바뀐다.
// 1. 전역 바인딩  , 2. 암시적 바인딩,  3.명시적 바인딩,  4.생성자 바인딩, 5.화살표 함수의 렉시컬 바인딩,

//1. 전역 바인딩
// 비엄격 모드에서는 전역 객체(window/ globalThis)를 가리킨다.
// 엄격모드('use strict')에서는 undefined

function foo() {
  console.log(this);
}

foo();

//2. 암시적 바인딩
// 객체의 매서드로 호출될 때, 그 매서드를 소유한 객체를 가리킨다.

const obj = {
  x: 100,
  getX() {
    console.log(this);
  },
};

obj.getX(); // { x: 100, getX: [Function: getX] }

// 단, 매서드 참조를 변수에 할당하면 암시적 바인딩이 깨진다.

const fn = obj.getX;
fn(); // undefined

//3. 명시적 바인딩
// call, apply, bind를 사용해 원하는 this를 강제로 지정할 수 있다.

function show() {
  console.log(this.name);
}

const user = { name: "Alice" };

show.call(user);
show.apply(user);

const bound = show.bind(user);
bound();

// 4. 생성자 바인딩

// 5. 화살표 함수의 렉시컬 바인딩

// ------ call, apply, bind 차이점 -----

function sum(a, b, c) {
  return a + b + c;
}

const nums = [1, 2, 3];

console.log(sum.apply(null, nums));
