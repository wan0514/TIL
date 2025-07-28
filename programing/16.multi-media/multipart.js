import { writeFileSync } from "fs";
import { sampleHttpMessage } from "./sampleHttpMessage.js";

function parseMultiFormData(data) {
  // 1. 헤더/바디 분리
  const { header, body } = splitHeaderAndBody(data);

  if (!isMultipartFormData(header)) return null;

  // 2. boundary 추출
  const boundary = getMultipartBoundary(header);
  if (!boundary) return null;

  // 3. boundary 기준으로 파트 분리
  // boundary 앞에 -- 붙음, 마지막은 --boundary--로 끝남
  const boundaryDelimiter = `--${boundary}`;
  const parts = body
    .split(boundaryDelimiter)
    .map((part) => part.trim())
    .filter((part) => part && part !== "--");

  // 4. 각 파트 파싱
  const parsedParts = parts.map(parsePart);

  return parsedParts;
}

function isMultipartFormData(header) {
  const match = header.match(/^Content-Type:\s*(.+)$/m);
  if (!match) return false;
  return match[1].includes("multipart/form-data");
}

function getMultipartBoundary(header) {
  const match = header.match(/^Content-Type:\s*(.+)$/m);
  if (!match) return null;
  const contentType = match[1];
  const matchBoundary = contentType.match(/boundary=([^\s;]+)/);
  return matchBoundary ? matchBoundary[1] : null;
}

function splitHeaderAndBody(data) {
  const partDelimiter = data.indexOf("\r\n\r\n") !== -1 ? "\r\n\r\n" : "\n\n";
  const [header, ...bodyParts] = data.split(partDelimiter);
  const body = bodyParts.join(partDelimiter);

  return { header, body };
}

function parsePart(part) {
  const { header, body } = splitHeaderAndBody(part);

  // content-disposition
  const dispositionMatch = header.match(
    /Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i
  );
  const name = dispositionMatch ? dispositionMatch[1] : null;
  const filename =
    dispositionMatch && dispositionMatch[2] ? dispositionMatch[2] : null;

  // content-type
  const typeMatch = header.match(/Content-Type:\s*([^\r\n;]+)/i);
  const contentType = typeMatch ? typeMatch[1].trim() : null;

  // content-transfer-encoding
  const encodingMatch = header.match(
    /Content-Transfer-Encoding:\s*([^\r\n;]+)/i
  );
  const encoding = encodingMatch ? encodingMatch[1].trim() : null;

  // 바디: 인코딩이 지정되어있으면 인코딩, 아니면 원본 그대로 반환
  let data = body;
  if (encoding === "base64") {
    // base64 디코딩
    data = Buffer.from(body.replace(/\r?\n/g, ""), "base64");
  }

  return {
    name,
    filename,
    contentType,
    encoding,
    data,
  };
}

const datas = parseMultiFormData(sampleHttpMessage);

datas.forEach(writeFileFromData);

function writeFileFromData(data) {
  const currentPath = "./programing/16.multi-media/";
  const filePath = `${currentPath}${data.filename}`;
  const content = data.data;
  const encoding = data.encoding; // null, 'utf8', 'base64' 등

  try {
    if (encoding === "base64") {
      // base64 문자열을 Buffer로 변환해서 저장 (이미지 등)
      const buffer = Buffer.from(content, "base64");
      writeFileSync(filePath, buffer);
    } else if (!encoding || encoding === "utf8") {
      // 일반 텍스트 파일
      writeFileSync(filePath, content, "utf8");
    } else {
      // 기타 인코딩 (필요시 추가)
      writeFileSync(filePath, content, encoding);
    }
    console.log("파일이 성공적으로 생성되었습니다.");
  } catch (error) {
    console.error("파일 생성 오류", error);
  }
}
