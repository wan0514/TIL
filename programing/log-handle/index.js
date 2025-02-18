import { readFileSync } from 'fs';
import path from 'path';
import { LogAnalyzer } from './log.js';

//파일 경로 생성
function getFilePath(fileName, fileFormat) {
  const currentDir = new URL('.', import.meta.url).pathname;
  return path.join(currentDir, fileName + '.' + fileFormat);
}

//로그 파일 저장
function getLogFIle(filePath) {
  const FILE_NAME = getFilePath(filePath, 'log');
  const logData = readFileSync(FILE_NAME, 'utf-8');

  return logData;
}

//로그 파싱
function parseLogFile(filePath) {
  const logData = getLogFIle(filePath);

  const logEntries = []; // 로그들을 담을 배열
  const logLines = logData.split(/\r?\n/); // 개행을 기준으로 나누기
  let currentLog = null; // logEntries에 담을 log 변수 선언

  logLines.forEach((line) => {
    const match = line.match(/^([^\t]+)\t([^\t]+)\t([^\t]+)\t([\s\S]*)$/);
    if (match) {
      // 새 로그 시작
      if (currentLog) logEntries.push(currentLog); // 이전 로그 저장

      // 새 로그 currentLog에 할당
      currentLog = {
        level: match[1],
        timestamp: match[2],
        process: match[3],
        message: match[4],
      };
    } else if (currentLog) {
      // 현재 로그의 연속된 메시지
      currentLog.message += '\n' + line;
    }
  });

  if (currentLog) logEntries.push(currentLog); // 마지막 로그 저장
  return logEntries;
}

const logs = parseLogFile('1701410305471system');

//Log관리하는 class 인스턴스 생성
const myLogs = new LogAnalyzer(logs);

// 파싱된 로그 배열 테스트 : 성공
console.log(myLogs.logs);

// 파싱이 오류 테스트 : 성공
myLogs.getError(); // 결과: 통과!

// 시간순 파싱 테스트 : 성공
console.log(myLogs.sortByTimestamp());
