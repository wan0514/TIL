/**
 * HTTP 요청 메시지 문자열을 생성합니다.
 * @param {object} options - 요청 정보를 담은 객체
 * @param {string} [options.method='GET'] - HTTP 메서드
 * @param {string} options.path - 요청 경로 (필수)
 * @param {object} [options.body] - 요청 본문에 포함할 데이터 객체
 * @param {string} [options.host='localhost'] - 요청을 보낼 호스트 이름
 * @returns {string} 생성된 HTTP 요청 메시지 문자열
 */
function createHttpRequestMessage({
  method = "GET",
  path,
  body,
  host = "localhost",
}) {
  // path는 필수 값이므로 확인합니다.
  if (!path) {
    throw new Error("요청 경로(path)는 반드시 지정해야 합니다.");
  }

  const upperCaseMethod = method.toUpperCase();

  // 1. 요청 라인 (Request Line)
  const requestLine = `${upperCaseMethod} ${path} HTTP/1.1`;

  // 2. 헤더 (Headers)
  const headers = [`Host: ${host}`, "Accept: */*", "Connection: keep-alive"];

  let bodyString = "";
  // GET, HEAD 메서드는 body를 가질 수 없습니다.
  if (body && upperCaseMethod !== "GET") {
    bodyString = typeof body === "object" ? JSON.stringify(body) : String(body);
    headers.push("Content-Type: application/json");
    const byteLength = new TextEncoder().encode(bodyString).length;
    headers.push(`Content-Length: ${byteLength}`);
  }

  // 3. 메시지 조합
  let message = `${requestLine}\r\n`;
  message += `${headers.join("\r\n")}\r\n`;
  message += `\r\n`; // 헤더와 본문을 구분하는 빈 줄
  message += bodyString;

  return message;
}

const getMessage = createHttpRequestMessage({
  path: "/logout",
  host: "api.example.com",
});

const body = {
  nickname: "bob",
};

const postMessage = createHttpRequestMessage({
  method: "POST",
  path: "/login",
  host: "api.example.com",
  body: body,
});

console.log(getMessage);
console.log(postMessage);
