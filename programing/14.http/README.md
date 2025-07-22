# HTTP 구현

Node.js에서 소켓과 DNS 모듈을 활용하여 HTTP 요청을 직접 구현하는 실습입니다.  
라이브러리 없이 TCP 레벨에서 직접 통신을 구성해보며, HTTP 프로토콜의 동작 원리를 이해하는 데 목적이 있습니다.

## 목표

- 사용자의 URL 입력을 받아 직접 TCP 소켓을 생성
- 도메인 → IP 주소 변환 (DNS lookup)
- HTTP 요청 메시지를 직접 구성하여 서버에 전송
- 서버의 HTTP 응답을 수신하고 출력

## 사용 모듈

- `readline`: 사용자 입력을 받기 위한 표준 입력 모듈
- `dns/promises`: 비동기 방식으로 DNS 조회
- `net`: TCP 소켓을 통한 저수준 네트워크 통신

## 흐름 설계

1. 사용자에게 주소 입력을 받음
2. URL 객체로 파싱 → `hostname`, `port`, `pathname` 등 추출
3. DNS 모듈을 사용해 `hostname` → `IP 주소` 변환
4. TCP 소켓을 생성하여 해당 IP:port로 연결 시도
5. HTTP 메시지 구성 (`GET`, 헤더 등)
6. 메시지를 전송하고, 응답을 받아 출력
7. 연결 종료

### 함수 설계

1. `connectAndRequestUrl`

- **역할**: 전체 요청 흐름을 담당하는 메인 함수입니다. URL 파싱 → DNS 조회 → TCP 연결 → HTTP 요청 전송 → 응답 수신까지 전 과정을 순차적으로 처리합니다.
- **input**: `urlString` (string) – 사용자가 입력한 URL 문자열
- **output**: 없음 (콘솔 로그로 상태 출력, 에러 발생 시 예외 throw)

2. `createSimpleGetRequestMessage`

- **역할**: HTTP GET 요청 메시지를 수동으로 생성합니다.
- **input**:
  - `hostname` (string) – 요청 대상 서버의 호스트명
  - `requestPath` (string) – 요청할 리소스의 경로
- **output**: 완성된 HTTP 요청 메시지 문자열 (CRLF로 구분된 헤더 포함)

3. `parseUrlComponents`

- **역할**: 문자열로 입력된 URL을 URL 객체로 파싱하고, 필요한 정보(호스트명, 포트, 경로)를 추출합니다.
- **input**: `urlString` (string) – 전체 URL
- **output**: `{ hostname, port, requestPath }` 객체

4. `resolveHostnameToIp`

- **역할**: 주어진 호스트명을 DNS 조회하여 IP 주소로 변환합니다.
- **input**: `hostname` (string)
- **output**: IP 주소 (string). 예: `"93.184.216.34"`

## 예시 출력

```bash
주소창을 입력하세요 (예: http://example.com): http://example.com
입력하신 URL: http://example.com

--- URL 파싱 정보 ---
호스트명: example.com
포트: 80
요청 경로: /

DNS 조회 성공: example.com -> 93.184.216.34
TCP 소켓 연결 성공: 93.184.216.34:80

--- 전송할 HTTP Request ---
GET / HTTP/1.1
Host: example.com
Connection: close
User-Agent: Node.js Simple HTTP Client/1.0
Accept: */*

--- 서버 응답 수신 ---
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
...

```
