//일단 문자열이 지원되는 것만 생각하기

function runLengthEncoding(data) {
  let result = [];
  let currentChar = "";
  let count = 0; //기본값

  for (let i = 0; i < data.length; i++) {
    const isDifferent = currentChar !== data[i];

    if (!isDifferent) {
      //같은 문자일 경우
      count++;
    } else {
      //다른 문자일 경우
      result.push(`${count === 0 ? "" : count + 1}${currentChar}`);
      currentChar = data[i];
      count = 0;
    }
  }

  return result.join("");
}

const a = "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWBWWWWWWWWWWWWWW";
console.log(runLengthEncoding(a));

// 문자열 디코딩
function runLengthDecoding(data) {
  let result = "";
  let currentNumber = 0;

  for (let i = 0; i < data.length; i++) {
    const target = data[i];
    const isNumber = isNumeric(target);

    if (isNumber) {
      //숫자 시작인 경우
      currentNumber = target;
    } else if (currentNumber) {
      //숫자 다음의 문자열인 경우
      result += target.repeat(currentNumber);
      currentNumber = 0;
    } else {
      //하나인 경우
      result += target;
    }
  }

  return result;
}

//문자열 값이 숫자인지 확인
function isNumeric(str) {
  return /^[0-9]+$/.test(str);
}

const b = "AB5ABCB7DABC";
console.log(runLengthDecoding(b));
