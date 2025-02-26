import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

//=== 구현할 기능 ===

//파일 경로
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = getFilePath('myfs', 'dat');
const DIR_FILE_PATH = getFilePath('myfs', 'dir');
const INFO_FILE_PATH = getFilePath('myfs', 'info');

// 경로를 반환하는 함수
function getFilePath(fileName, fileFormat) {
  return path.join(CURRENT_DIR, `${fileName}.${fileFormat}`);
}

console.log('dataFilePath', DATA_FILE_PATH);
console.log('dirFilePath', DIR_FILE_PATH);
console.log('infoFilePath', INFO_FILE_PATH);

// 파일 읽기
// 파일 쓰기
// 파일 쓰기
// 파일 시스템 초기화 함수(디스크 크기 설정)

// 파일 저장
// - 첫번쨰 클라스터 찾기
// - 디렉토리에 파일 정보 추가
// - 사용 공간 업데이트
// - 파일 저장

// 디렉토리 조회
// 디렉토리 생성
