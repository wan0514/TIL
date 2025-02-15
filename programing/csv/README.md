# CSV 미션

## 1. 사전 학습할 것

- CSV 파일이 무엇인가
- 어떻게 생성하는가
- 어떻게 읽는가
- 어떻게 삭제하는가

---

## 2. CSV 파일

CSV(Comma-Separated Values) 파일은 데이터를 쉼표(`,`)로 구분하여 저장하는 텍스트 파일 형식이다.

### CSV 파일의 특징

- 텍스트 기반 → 사람이 읽을 수 있고, 가볍다.
- 각 행이 한 개의 레코드(데이터 행) → 표 형태의 데이터를 저장하기 적합하다.
- 각 열(컬럼)은 쉼표(`,`)로 구분 → 데이터베이스, 스프레드시트(엑셀) 등에서 쉽게 사용 가능하다.

---

## 3. CSV 파일 생성

CSV 파일을 저장하는 방법은 사용 환경(브라우저, Node.js, 엑셀 등)에 따라 다르다.

- **브라우저 환경**

  - CSV 데이터를 문자열로 만들고, `Blob` 객체를 사용해서 파일을 다운로드.

- **Node.js 환경**
  - `fs` (파일 시스템) 모듈을 사용하여 CSV 파일을 저장.

### fs(File System) 모듈이란?

Node.js가 제공하는 API로, 파일 시스템을 제어하는 모듈.

#### Node.js `fs` 모듈의 특징

- 운영체제의 파일 시스템을 제어할 수 있도록 API 제공.
- 비동기(`fs.writeFile()`)와 동기(`fs.writeFileSync()`) 방식 모두 지원.
- 파일 생성, 읽기, 수정, 삭제 가능.
- 운영체제(OS)와 상관없이 Node.js에서 동일한 코드로 실행 가능.

#### 파일 시스템 vs Node.js `fs` 모듈

- **파일 시스템**: 운영체제가 관리하는 파일 저장 방식.
- **Node.js의 `fs` 모듈**: 파일 시스템을 코드로 조작하는 도구.

---

## 4. CSV 파일 읽기

### 4.1 `fs.readFile()` 사용 (기본 방식)

- CSV 파일을 문자열로 읽어옴.
- `split("\n")`을 사용해 행 단위로 나누고, `split(",")`을 이용해 열 단위로 분리 가능.
- 단순한 CSV 파일 처리에 적합하지만, 데이터 변환이 필요함.

### 4.2 `fs.createReadStream()` + `csv-parser` 사용 (라이브러리)

- `csv-parser` 라이브러리를 사용하여 CSV 데이터를 JSON 객체로 변환.
- CSV의 첫 번째 행(헤더)을 자동으로 키로 인식하여 구조화된 데이터 제공.
- 대량의 CSV 데이터를 효율적으로 처리할 수 있음.

### 4.3 정리

| 방법                        | 특징                                      |
| --------------------------- | ----------------------------------------- |
| `fs.readFile()` + `split()` | 문자열로 읽고 배열로 변환 가능            |
| `csv-parser`                | JSON 형태로 변환, 대량 데이터 처리에 적합 |

---

## 5. CSV 파일 삭제

### 5.1 `fs.unlink()` 사용

- 특정 CSV 파일을 삭제하는 기본적인 방법.
- 파일이 존재하지 않으면 오류 발생 가능.

### 5.2 `fs.rm()` 사용 (최신 방식)

- `fs.unlink()`와 유사하지만, 디렉토리까지 삭제할 수도 있음 (`recursive: true` 옵션).
- 최신 Node.js 버전(>= v14.14)에서 사용 가능.

### 5.3 정리

| 방법                  | 특징                                                           |
| --------------------- | -------------------------------------------------------------- |
| `fs.unlink("파일명")` | 기본적인 파일 삭제                                             |
| `fs.rm("파일명")`     | 최신 방식, 디렉토리 삭제 가능 (`recursive: true` 옵션 사용 시) |

---

## 6. 결론

- 간단한 CSV 파일 처리는 `fs.readFile() + split()`을 사용.
- JSON 형태로 변환하려면 `csv-parser`를 사용하는 것이 가장 편리함.
- 파일 삭제는 `fs.unlink()`를 사용하며, 최신 방식으로 `fs.rm()`을 사용할 수도 있음.

---

# 실수와 에러 경험

아래는 실패했던 코드와 그에 대한 설명을 합친 내용입니다:

---

### 1. **실패했던 코드 1: `__dirname` 사용 (ES 모듈에서는 사용 불가)**

```javascript
import fs from 'fs';
import path from 'path';

// __dirname을 사용하려 했으나 ES 모듈에서는 지원되지 않음
const currentDir = __dirname; // 오류 발생: ES 모듈에서 __dirname 사용 불가

const filePath = path.join(currentDir, 'output.csv');

fs.writeFile(filePath, 'Name, Age\nJohn, 30', 'utf8', (err) => {
  if (err) throw err;
  console.log('File has been saved!');
});
```

- **문제**: `__dirname`은 CommonJS 모듈에서 사용 가능하지만, **ES 모듈**에서는 지원되지 않아서 해당 코드에서 오류가 발생했습니다.

---

### 2. **실패했던 코드 2: `EISDIR` 오류가 발생한 코드**

```javascript
import fs from 'fs';
import path from 'path';

// 경로가 디렉토리인 상태에서 파일을 생성하려 했음
const currentDir = new URL('.', import.meta.url).pathname;

// 현재 디렉토리로 지정한 경로가 디렉토리여서 파일을 생성할 수 없었음
const filePath = path.join(currentDir, 'output.csv'); // 여기도 제대로 된 파일 경로로 지정되지 않음

fs.writeFile(filePath, 'Name, Age\nJohn, 30', 'utf8', (err) => {
  if (err) throw err;
  console.log('File has been saved!');
});
```

- **문제**: `new URL('.', import.meta.url).pathname`을 사용하여 현재 파일 경로를 얻으려고 했으나, **디렉토리 경로**가 반환되었습니다. 이 상태에서 파일을 생성하려 하자 `EISDIR` 오류가 발생했습니다. 이는 지정한 경로가 디렉토리여서 파일을 생성할 수 없다는 의미입니다.

---

### **해결 방법:**

1. **`__dirname` 대체**: ES 모듈에서는 `__dirname`을 사용할 수 없기 때문에 `import.meta.url`을 사용하여 파일 경로를 얻고 이를 활용해야 합니다.
2. **경로 확인**: 경로가 **디렉토리**가 아닌 **파일 경로**로 제대로 설정되어야 합니다. 디렉토리가 존재하는지 확인하고, 파일 경로로 처리해야 합니다.

### **최종 해결된 코드 예시**:

```javascript
import fs from 'fs';
import path from 'path';

// 현재 파일의 URL을 가져와서 경로로 변환
const currentDir = new URL('.', import.meta.url).pathname;

// 같은 디렉토리 내에 'output.csv' 파일 경로 생성
const filePath = path.join(currentDir, 'output.csv');

// 파일 생성
fs.writeFile(filePath, 'Name, Age\nJohn, 30', 'utf8', (err) => {
  if (err) throw err;
  console.log('File has been saved at the same directory as the script!');
});
```

- **해결된 부분**: `currentDir`을 `new URL('.', import.meta.url).pathname`으로 수정하여, 정확한 파일 경로를 얻었고, 이를 `path.join()`으로 파일 경로와 파일명을 결합하여 최종적으로 파일을 생성할 수 있었습니다.

---

이처럼, **ES 모듈 환경에서는 `__dirname`을 사용할 수 없고**, 현재 파일의 경로를 구하려면 `import.meta.url`을 활용해야 하며, **경로가 디렉토리가 아닌 파일 경로로 지정되어야** 오류 없이 파일을 생성할 수 있습니다.

### 관련된 공식 문서:

- [MDN Web Docs - URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)  
  `URL` 객체에 대한 공식 문서입니다. 여기서 `new URL()` 생성자와 `.pathname` 속성에 대한 자세한 설명을 확인할 수 있습니다.

- [MDN Web Docs - import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)  
  `import.meta`에 대한 공식 문서로, ES 모듈에서 `import.meta.url`을 사용할 때의 용법을 다룹니다.

- [MDN Web Docs - EISDIR 오류](https://nodejs.org/api/errors.html#errors_common_system_errors)  
  `EISDIR` 오류는 "Is a directory"라는 의미로, 디렉토리에서 파일을 열려고 시도할 때 발생합니다. 이 오류와 관련된 공식 Node.js 문서에서 시스템 오류 코드들을 확인할 수 있습니다.

- [Node.js 공식 문서 - fs 모듈](https://nodejs.org/api/fs.html)  
  `fs` 모듈에 대한 공식 문서입니다. 파일 시스템과 관련된 다양한 작업(파일 읽기, 쓰기, 삭제 등)을 수행하는 방법을 다룹니다.

- [Node.js 공식 문서 - \_\_dirname](https://nodejs.org/api/modules.html#modules_dirname)  
  `__dirname`에 대한 공식 문서입니다. Node.js에서 현재 모듈의 **디렉토리 이름**을 반환하는 특수 변수에 대해 설명합니다. ES 모듈에서는 `__dirname`을 사용할 수 없고, 대체 방법으로 `import.meta.url`을 사용해야 합니다.
