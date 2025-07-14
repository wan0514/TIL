import Memory from "./memory_simulator.js";
// -----------------------------------------------------------
// 테스트 시나리오 실행
// -----------------------------------------------------------
const memory = new Memory();

console.log("=== 메모리 시뮬레이터 테스트 시작 ===");

// 1. init() 호출
const base = memory.init(1024, 1024); // 스택 1024B, 힙 1024B
console.log(`base address: 0x${base.toString(16).toUpperCase()}`);

// 2. setSize() 호출
memory.setSize("short", 4); // 8바이트로 패딩됨
memory.setSize("int", 8);
memory.setSize("string", 16);

// 3. malloc() 호출 (초기 힙 할당)
const arrayPointer = memory.malloc("int", 4); // int 4개 = 8 * 4 = 32B 할당
const shortPointer = memory.malloc("short", 5); // short 5개 = 8 * 5 = 40B 할당

// 4. heapdump() 출력
console.log("\n--- 첫 번째 heapdump() ---");
memory.heapdump().forEach((line) => console.log(line));

// 5. call("foo", 2) 호출
memory.call("foo", 2);

// 6. string1 malloc (함수 호출 후 malloc)
// string1 타입 'crong'은 등록되지 않았으므로 Error 발생 예상
let string1 = null;
try {
  string1 = memory.malloc("crong", 1);
} catch (e) {
  console.error(`\n오류 발생: ${e.message}`);
}
// string 타입으로 변경하여 재시도
console.log("\n--- 'crong' 타입 오류 후 'string'으로 재할당 시도 ---");
string1 = memory.malloc("string", 1); // string 1개 할당 (16B)

// 7. callstack() 출력
console.log("\n--- 첫 번째 callstack() ---");
console.log(memory.callstack());

// 8. call("bar", 1) 호출
memory.call("bar", 1);

// 9. string2 malloc
const string2 = memory.malloc("string", 2); // string 2개 할당 (16 * 2 = 32B)

// 10. returnFrom("bar") 호출
memory.returnFrom("bar");

// 11. free(string1) 호출
console.log("\n--- free(string1) 호출 ---");
memory.free(string1);

// 12. heapdump() 출력 (string1은 refCount가 0이 됨)
console.log("\n--- 두 번째 heapdump() (free(string1) 후) ---");
memory.heapdump().forEach((line) => console.log(line));

// 13. free(string2) 호출 (의도적으로 에러 발생)
console.log("\n--- free(string2) 호출 (예상되는 오류: 스택에 포인터 없음) ---");
try {
  memory.free(string2); // 이 부분에서 에러가 발생할 것임
} catch (e) {
  console.warn(`[예상된 오류 발생] free(string2): ${e.message}`);
}
// 14. callstack() 출력 (bar()가 반환되었으므로, foo()만 남아있을 것임)
console.log(
  "\n--- 두 번째 callstack() (returnFrom('bar') 및 free(string2) 후) ---"
);
console.log(memory.callstack());

// 15. garbageCollect() 호출
memory.garbageCollect(); // string1, string2에 해당하는 힙 메모리가 해제될 것임

// 16. heapdump() 출력 (string1, string2가 힙에서 사라졌을 것임)
console.log("\n--- 세 번째 heapdump() (garbageCollect() 후) ---");
memory.heapdump().forEach((line) => console.log(line));

// 17. reset() 호출
memory.reset();

// 18. heapdump() 출력 (모든 것이 비어있어야 함)
console.log("\n--- 네 번째 heapdump() (reset() 후) ---");
memory.heapdump().forEach((line) => console.log(line));

console.log("\n=== 메모리 시뮬레이터 테스트 종료 ===");
