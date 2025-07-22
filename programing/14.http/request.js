import readline from "readline";
import { lookup } from "dns/promises"; // DNS 모듈을 Promise 방식으로 사용
import net from "net"; // TCP 연결을 위한 소켓 모듈

// readline 인터페이스를 생성합니다.
const rl = readline.createInterface({
  input: process.stdin, // 표준 입력 스트림(키보드 입력) 사용
  output: process.stdout, // 표준 출력 스트림(콘솔 출력) 사용
});

// 사용자에게 URL 입력을 요청하고 처리합니다.
rl.question(
  "주소창을 입력하세요 (예: http://example.com): ",
  async (answer) => {
    console.log(`입력하신 URL: ${answer}`);
    try {
      await connectAndRequestUrl(answer); // URL 연결 및 요청 함수 호출
    } catch (error) {
      console.error(`프로그램 실행 중 오류 발생: ${error.message}`);
    } finally {
      rl.close(); // readline 인터페이스 닫기
    }
  }
);

/**
 * URL을 파싱하고, DNS 조회 후 TCP 연결을 수립하여 HTTP 요청을 보냅니다.
 * @param {string} urlString - 사용자가 입력한 전체 URL 문자열.
 */
async function connectAndRequestUrl(urlString) {
  let urlComponents;

  try {
    // URL 파싱을 별도의 함수로 분리
    urlComponents = parseUrlComponents(urlString);
  } catch (error) {
    throw new Error(
      `유효하지 않은 URL 형식입니다: ${urlString}. ${error.message}`
    );
  }

  const { hostname, port, requestPath } = urlComponents;

  console.log(`\n--- URL 파싱 정보 ---`);
  console.log(`호스트명: ${hostname}`);
  console.log(`포트: ${port}`);
  console.log(`요청 경로: ${requestPath}`);

  let ipAddress;
  try {
    // 1. DNS 조회: 호스트 이름을 IP 주소로 확인합니다 (별도 함수로 분리).
    ipAddress = await resolveHostnameToIp(hostname);
    console.log(`DNS 조회 성공: ${hostname} -> ${ipAddress}`);
  } catch (error) {
    throw new Error(`DNS 조회 실패 (${hostname}): ${error.message}`);
  }

  // 2. TCP 소켓 연결 수립
  // 각 요청마다 새로운 소켓 인스턴스를 생성하여 독립적으로 관리합니다.
  const client = new net.Socket();

  // 소켓 이벤트 리스너 설정
  client.on("data", (data) => {
    console.log("\n--- 서버 응답 수신 ---");
    console.log(data.toString()); // 서버 응답 (HTTP 헤더 + 본문)
    client.end(); // 응답을 받으면 소켓 연결 종료
  });

  client.on("end", () => {
    console.log("서버가 연결을 종료했습니다.");
  });

  client.on("error", (err) => {
    console.error(`소켓 오류 발생: ${err.message}`);
    client.destroy(); // 오류 발생 시 소켓 강제 종료
  });

  client.on("close", () => {
    console.log("소켓이 완전히 닫혔습니다.");
  });

  // Promise를 사용하여 connect가 완료될 때까지 기다립니다.
  await new Promise((resolve, reject) => {
    client.connect(port, ipAddress, () => {
      console.log(`TCP 소켓 연결 성공: ${ipAddress}:${port}`);
      resolve(); // 연결 성공 시 Promise 해결
    });
    // connect 에러도 여기서 처리하여 Promise를 reject하도록 함
    client.once("error", reject);
  });

  // 3. HTTP Request 메시지 구성
  const httpRequestMessage = createSimpleGetRequestMessage(
    hostname,
    requestPath
  );
  console.log("\n--- 전송할 HTTP Request ---");
  console.log(httpRequestMessage);

  // 4. HTTP Request 메시지 전송
  client.write(httpRequestMessage);
}

/**
 * 주어진 호스트명과 요청 경로를 사용하여 간단한 HTTP GET 요청 메시지를 생성합니다.
 *
 * @param {string} hostname - 요청을 보낼 대상 서버의 호스트명 (예: 'example.com').
 * @param {string} requestPath - 요청할 리소스의 경로 (예: '/', '/some/page').
 * @returns {string} 완성된 HTTP GET 요청 메시지 문자열.
 */
function createSimpleGetRequestMessage(hostname, requestPath) {
  // 요청 라인: GET /path HTTP/1.1
  const requestLine = `GET ${requestPath} HTTP/1.1`;

  // 헤더 구성
  const headers = [
    `Host: ${hostname}`, // 필수: 요청을 받는 서버의 호스트명
    `Connection: close`, // 요청 처리 후 연결을 닫도록 서버에 지시
    `User-Agent: Node.js Simple HTTP Client/1.0`, // 클라이언트 식별 (선택 사항)
    `Accept: */*`, // 모든 종류의 콘텐츠를 받겠다고 명시 (선택 사항)
  ];

  // 요청 메시지 조합
  // 각 줄은 CRLF (\r\n)로 구분되며, 헤더 끝에 빈 줄이 추가됩니다.
  const requestMessage = [
    requestLine,
    ...headers,
    "", // 헤더와 본문 사이의 빈 줄
    "", // GET 요청은 본문이 없으므로 추가적인 빈 줄
  ].join("\r\n"); // 모든 줄을 CRLF로 연결

  return requestMessage;
}

// 문자열 url을 받아서, URL 객체로 생성 후 파싱값을 반환
function parseUrlComponents(urlString) {
  const urlObj = new URL(urlString); // URL 객체 생성 및 파싱
  console.log(urlObj);

  const hostname = urlObj.hostname;
  // URL에 포트가 명시되지 않았다면 HTTP 기본 포트인 80을 사용
  const port = urlObj.port ? parseInt(urlObj.port) : 80;
  const requestPath = urlObj.pathname + urlObj.search; // 경로와 쿼리 문자열 포함

  return { hostname, port, requestPath };
}

//dns를 통해 ip주소 조회
async function resolveHostnameToIp(hostname) {
  try {
    const { address } = await lookup(hostname);
    return address;
  } catch (error) {
    // DNS 조회 실패 시 더 구체적인 오류 메시지를 포함하여 다시 throw
    throw new Error(`DNS lookup failed for ${hostname}: ${error.message}`);
  }
}
