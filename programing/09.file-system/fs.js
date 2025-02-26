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

//json 파일로 변환하는 함수
// 분리 목적: 추후 바이너리로 변환한다면 이 함수만 수정가능하게 따로 분리
function convertToJSON(data) {
  return JSON.stringify(data, null, 2); // 2는 들여쓰기를 2칸씩 해주는 옵션
}

// 파일 시스템 초기화 함수(디스크 크기 설정)

function initFileSystem(size) {
  //기존 파일이 존재하는지 전부 확인
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, convertToJSON({ clusters: {} }));
  }

  if (!fs.existsSync(DIR_FILE_PATH)) {
    fs.writeFileSync(
      DIR_FILE_PATH,
      convertToJSON({
        root: { type: 'dir', files: {}, subdifs: {} },
      })
    );
  }

  if (!fs.existsSync(INFO_FILE_PATH)) {
    fs.writeFileSync(
      INFO_FILE_PATH,
      convertToJSON({
        totalSize: size,
        usedSpace: 0,
        freeSpace: size,
        clusterSize: 512,
        totalClusters: 2048,
        fat: {},
      })
    );
  }
}

// 파일 읽기
function loadFile() {}

// 파일 생성
function saveFile() {
  // - 첫번쨰 클라스터 찾기
  // - 디렉토리에 파일 정보 추가
  // - 사용 공간 업데이트
  // - 파일 저장
}

// 디렉토리 조회
function loadDirectory() {}

// 디렉토리 생성
function saveDirectory() {}

// === test ===

console.log('dataFilePath', DATA_FILE_PATH);
console.log('dirFilePath', DIR_FILE_PATH);
console.log('infoFilePath', INFO_FILE_PATH);

initFileSystem(500);
