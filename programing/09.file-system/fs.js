import fs, { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  getFileData,
  getFileClusters,
  getNextAvailableCluster,
  saveClusterData,
  addFileToDirectory,
} from './utils.js';

//=== 구현할 기능 ===

//파일 경로
const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE_PATH = getFilePath('myfs.dat');
const DIR_FILE_PATH = getFilePath('myfs.dir');
const INFO_FILE_PATH = getFilePath('myfs.info');
const CLUSTER_SIZE = 512;

// 경로를 반환하는 함수
function getFilePath(fileName) {
  return path.join(CURRENT_DIR, `${fileName}`);
}

//json 파일로 변환하는 함수
// 분리 목적: 추후 바이너리로 변환한다면 이 함수만 수정가능하게 따로 분리
function convertToJSON(data) {
  return JSON.stringify(data, null, 2); // 2는 들여쓰기를 2칸씩 해주는 옵션
}

// 파일 시스템 초기화 함수(디스크 크기 설정)

function initFileSystem(size) {
  // 전체 클러스터 수 계산
  const diskBiteSize = size * 10000;
  const totalClusters = Math.ceil(diskBiteSize / CLUSTER_SIZE);

  //기존 파일이 존재하는지 전부 확인
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const clusters = {};
    for (let i = 1; i <= totalClusters; i++) {
      clusters[i] = null; // 빈 클러스터로 초기화
    }

    // 데이터 파일 생성
    fs.writeFileSync(DATA_FILE_PATH, convertToJSON({ clusters }));
  }

  if (!fs.existsSync(DIR_FILE_PATH)) {
    fs.writeFileSync(
      DIR_FILE_PATH,
      convertToJSON({
        root: { type: 'dir', files: {} },
      })
    );
  }

  if (!fs.existsSync(INFO_FILE_PATH)) {
    const fat = {};
    for (let i = 1; i <= totalClusters; i++) {
      fat[i] = 0; // FAT 테이블 초기화: 모든 클러스터는 0로 시작
    }

    fs.writeFileSync(
      INFO_FILE_PATH,
      convertToJSON({
        totalSize: diskBiteSize,
        usedSpace: 0,
        freeSpace: diskBiteSize,
        clusterSize: CLUSTER_SIZE,
        totalClusters,
        fat,
      })
    );
  }

  console.log(`${size}메가 파일 시스템의 초기화를 완료했습니다.`);
}

// 파일 읽기
function loadFile(fileName) {
  const pathParts = fileName.split('/').filter(Boolean); // ['dir', 'sub', 'start.txt']

  const rawData = fs.readFileSync(DIR_FILE_PATH, 'utf8');
  const data = JSON.parse(rawData);

  // 파일 탐색 로직
  const current = data.root;

  const fileData = getFileData(current, pathParts);
  if (!fileData) {
    console.log('다시 경로를 입력해주세요');
    return;
  }

  // 시작 클러스터 번호
  const startClusterNumber = fileData.startCluster;

  // info 탐색해서 클러스터 번호부터 연속적으로 값 검사 -1이 나온 끝 클라스터 번호 get
  const info = readFileSync(INFO_FILE_PATH, 'utf-8');
  const fatData = JSON.parse(info).fat;

  // 파일이 저장된 클러스터 번호 배열로 얻기
  const clusterNumberArray = getFileClusters(fatData, startClusterNumber);

  // 디스트 데이터 읽기
  const diskData = readFileSync(DATA_FILE_PATH, 'utf-8');
  // 클러스터 데이터 얻기
  const clusters = JSON.parse(diskData).clusters;

  //myfs.dat 에서 시작 클러스터 번호 ~ 끝번호 까지 데이터 결합
  const targetData = clusterNumberArray.reduce((acc, cur) => {
    return (acc += clusters[cur]);
  }, '');

  //결합한 데이터 콘솔로 출력
  console.log(targetData);
}

// 파일 생성
function saveFile(filePath, text) {
  const info = readFileSync(INFO_FILE_PATH, 'utf-8');
  const infoData = JSON.parse(info);

  // 텍스트를 바이트 크기로 변환 (여기서는 UTF-8로 변환)
  const byteLength = Buffer.byteLength(text, 'utf-8');

  // 클라스터가 비어있는지 확인
  if (!isClusterAvailable(infoData)) {
    console.error('남아있는 저장공간이 없습니다.');
  }

  // 필요한 클라스터 계산
  const neededClusters = Math.ceil(byteLength / CLUSTER_SIZE);

  // 비어있는 첫번째 클라스터 찾기
  const firstCluster = getNextAvailableCluster(infoData.fat);

  let currentCluster = firstCluster;
  let remainData = text;

  for (let i = 0; i < neededClusters; i++) {
    // 남은 데이터 중 클러스터 크기만큼 잘라서 저장
    const clusterData = remainData.slice(0, CLUSTER_SIZE);
    remainData = remainData.slice(CLUSTER_SIZE);

    // 다음 클러스터를 찾기 (빈 클러스터가 있을 때까지)
    let nextCluster = getNextAvailableCluster(infoData.fat, currentCluster);

    // 클러스터에 데이터 저장
    if (i < neededClusters - 1) {
      // 마지막 클러스터가 아니면 다음 클러스터 연결
      infoData.fat[currentCluster] = nextCluster;
    } else {
      // 마지막 클러스터면 -1로 종료
      infoData.fat[currentCluster] = -1;
    }

    // 실제로 클러스터에 데이터를 저장하는 작업
    saveClusterData(currentCluster, clusterData);

    // 다음 클러스터로 이동
    currentCluster = nextCluster;
  }

  // 클러스터에 모든 데이터를 저장한 후, 디렉토리 정보 추가
  addFileToDirectory(filePath, size, firstCluster);

  // 사용된 공간 업데이트
  infoData.usedSpace += byteLength;
  infoData.freeSpace -= byteLength;

  // 파일 시스템 정보 업데이트
  fs.writeFileSync(INFO_FILE_PATH, JSON.stringify(infoData, null, 2));
}

// ***추후 구현***
// 디렉토리 조회
function loadDirectory() {}

// 디렉토리 생성
function saveDirectory() {}

// === test ===

// console.log('dataFilePath', DATA_FILE_PATH);
// console.log('dirFilePath', DIR_FILE_PATH);
// console.log('infoFilePath', INFO_FILE_PATH);

// initFileSystem(500);

// loadFile('/sub/start.txt');
