# 로그 미션

## 설계

### 👉 시스템 로그 파일을 어떻게 분석하고, 어떤 데이터 형식으로 만들 것인가?

로그는 \n을 기준으로 나뉘며, 각 로그의 요소들은 \t을 기준으로 나뉩니다.  
따라서 로그 파일을 분석할 때 \n을 기준으로 로그를 분리하고, 각각의 로그는 \t을 기준으로 분리합니다.  
요소는 `key: value` 형태로 두는 것이 필터링하고 파악하기 용이하기 때문에 로그 파일을 다음과 같은 형태로 파싱할 생각입니다.

```js
log = {
  level: 'error',
  timestamp: '14:22:30.579612+0900',
  process: 'WindowServer',
  message: '로그 메시지 내용',
};

logs = [log, log, log];
```

파싱하는 과정은 함수로 만들어 로그 파일을 인자로 받을 생각입니다.

```js
import fs from 'fs';

try {
  const data = fs.readFileSync('example.txt', 'utf-8'); // 파일 경로와 인코딩 설정
  console.log('파일 내용:', data);
} catch (err) {
  console.error('파일 읽기 오류:', err);
}
```

log퍄일을 읽기 위해서는 fs모듈을 사용합니다.

```js
import { readFile } from 'fs';
```

### 👉 데이터 구조 내용을 어떻게 탐색하고 분석할 것인가?

객체로 선언한 `log`를 `logs` 클래스에 상태로 저장한 후, 아래의 기능들을 메서드로 구현합니다.  
각 메서드는 `logs` 배열 상태를 매개변수로 받으며, 로직 이후 변화된 값을 반환합니다.

> 설계 변경: 각 log는 데이터 정보만 필요하기 때문에 class가 아닌 일반 객체로 선언하는 것으로 변경했습니다.

1. **class Log**  
   로그 항목에 필요한 데이터를 포함할 수 있도록 객체나 타입을 정의합니다. 이를 class로 선언합니다.

   - 필드: `level`, `timestamp`, `process`, `message`

2. **filterByLevel**  
   로그 레벨(`level`)에 따라 로그 항목을 필터링하는 기능을 구현합니다. 예: `info`, `error`, `default` 등.

3. **sortByTimestamp**  
   `timestamp` 값을 기준으로 로그 항목들을 시간 순으로 정렬하는 기능을 구현합니다.

4. **filterByProcess**  
   특정 프로세스 이름(`process`)을 기준으로 로그 항목을 필터링하는 기능을 구현합니다.

5. **sortByProcess**  
   `process` 값을 기준으로 로그 항목들을 알파벳 순으로 정렬하는 기능을 구현합니다.

6. **countByLevel**  
   각 로그 레벨별로 발생한 로그 항목의 개수를 세는 기능을 구현합니다.

7. **countByProcess**  
   각 프로세스별로 발생한 로그 항목의 개수를 세는 기능을 구현합니다.

# 기능구현 세부사항

### 📌 코드 분리

이 프로젝트는 로그 파일을 읽고 파싱하는 부분과 로그 데이터를 분석하는 부분을 분리하여 유지보수성과 가독성을 높였습니다.

- mission.js: 로그 파일을 읽고, 파싱하여 데이터를 변환하는 역할을 수행합니다.

- log.js: 파싱된 로그 데이터를 분석하고 가공하는 기능을 제공합니다.

## 구현

### 1. 로그 파일 파싱

로그 파일은 개행 문자(`\n`)를 기준으로 나뉘고, 각 로그 항목은 탭 문자(`\t`)로 구분됩니다. 이를 분석하여 객체 형태로 변환합니다.

```js
function parseLogFile(filePath) {
  const logData = getLogFIle(filePath);
  const logEntries = [];
  const logLines = logData.split(/\r?\n/);
  let currentLog = null;

  logLines.forEach((line) => {
    const match = line.match(/^([^\t]+)\t([^\t]+)\t([^\t]+)\t([\s\S]*)$/);
    if (match) {
      if (currentLog) logEntries.push(currentLog);
      currentLog = {
        level: match[1],
        timestamp: match[2],
        process: match[3],
        message: match[4],
      };
    } else if (currentLog) {
      currentLog.message += '\n' + line;
    }
  });

  if (currentLog) logEntries.push(currentLog);
  return logEntries;
}
```

### 2. 로그 분석 기능

파싱된 로그 데이터는 `LogAnalyzer` 클래스를 통해 다룰 수 있습니다.

```js
class LogAnalyzer {
  constructor(logs = []) {
    this.logs = logs;
  }

  filterByKeyValue(key, value) {
    return this.logs.filter((log) => log[key] === value);
  }

  sortByTimestamp() {
    const logs = JSON.parse(JSON.stringify(this.logs));
    return logs.sort(
      (a, b) =>
        new Date(replaceTimestamp(a.timestamp)) -
        new Date(replaceTimestamp(b.timestamp))
    );
  }

  sortByProcess() {
    const logs = JSON.parse(JSON.stringify(this.logs));
    return logs.sort((a, b) =>
      a.process.toUpperCase().localeCompare(b.process.toUpperCase())
    );
  }

  countByKeyValue(key, value) {
    return this.logs.filter((log) => log[key] === value).length;
  }

  getError() {
    return this.logs.filter((log) => Object.values(log).includes(undefined));
  }
}
```

### 3. 정규식 활용 (타임스탬프 변환)

로그의 타임스탬프 형식을 `YYYY-MM-DDTHH:mm:ss.sss+ZZZZ` 형태로 변환합니다.

```js
function replaceTimestamp(timestamp) {
  const regex = /^(\d{2}:\d{2}:\d{2}\.\d{6})\+(\d{4})$/;
  const currentDate = new Date().toISOString().split('T')[0];
  return timestamp.replace(
    regex,
    (match, time, timezone) => `${currentDate}T${time}+${timezone}`
  );
}
```

## 실행 예시

```js
const logs = parseLogFile('1701410305471system');
const myLogs = new LogAnalyzer(logs);

console.log(myLogs.sortByTimestamp());
console.log(myLogs.filterByKeyValue('level', 'error'));
console.log(myLogs.countByKeyValue('process', 'WindowServer'));
```
