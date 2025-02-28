const DIR_FILE_PATH = getFilePath('myfs.dir');

function getFileData(current, pathParts) {
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];

    if (i === pathParts.length - 1) {
      if (current.files && current.files[part]) {
        return current.files[part];
      } else {
        console.error('파일이 존재하지 않습니다.');
        return null;
      }
    }

    if (current[part] && current[part].type === 'dir') {
      current = current[part];
    } else {
      console.error('경로가 존재하지 않습니다.');
      return null;
    }
  }
}

function getFileClusters(fatData, startCluster) {
  let currentCluster = startCluster;
  let fileClusters = [];

  while (currentCluster !== -1) {
    fileClusters.push(currentCluster); // 현재 클러스터를 배열에 추가
    currentCluster = fatData[currentCluster]; // 다음 클러스터로 이동
  }

  return fileClusters; // 모든 클러스터를 반환
}

// 남은 클러스터 개수를 계산하는 함수
function getRemainingClusterCount(data) {
  const usedClusters = Math.ceil(data.usedSpace / data.clusterSize); // 사용된 클러스터 수
  const remainingClusters = data.totalClusters - usedClusters; // 남은 클러스터 수
  return remainingClusters;
}

// 클러스터가 사용 가능한지 확인하는 함수
function isClusterAvailable(data) {
  const remainingClusters = getRemainingClusterCount(data); // 남은 클러스터 수 얻기
  return remainingClusters > 0; // 남은 클러스터가 있으면 true, 없으면 false
}

// 비어있는 클라스터 찾기
function getNextAvailableCluster(fatData, currentCluster = 1) {
  let clusterId = currentCluster; // 주어진 클러스터부터 시작

  while (fatData[clusterId] !== 0) {
    clusterId++;
  }

  return clusterId;
}
// 클러스터에 데이터를 저장하는 함수
function saveClusterData(clusterId, data) {
  const clusterFilePath = `${DIR_FILE_PATH}${clusterId}.txt`;
  fs.writeFileSync(clusterFilePath, data);
}

// 디렉토리에 파일 정보를 추가하는 함수
function addFileToDirectory(filePath, size, firstCluster) {
  const dirFilePath = './dir.json'; // 가상의 디렉토리 파일 경로
  const dirData = JSON.parse(fs.readFileSync(dirFilePath, 'utf-8'));

  dirData[filePath] = {
    firstCluster: firstCluster,
  };

  fs.writeFileSync(dirFilePath, JSON.stringify(dirData, null, 2));
}

//test
const fatData = {
  1: -1, // file1.txt (1번 클러스터, EOF)
  2: 4, // file2.bin (2번 클러스터, EOF)
  3: 0,
  4: -1, // report.pdf (3번 클러스터,
  5: 6,
  6: -1,
  7: 0,
};

// console.log(getFileClusters(fatData, 2));
// console.log(getNextAvailableCluster(fatData));

// const infoData = {
//   totalSize: 1048576, // 1MB 가상 디스크
//   usedSpace: 512000, // 사용된 바이트 수
//   freeSpace: 536576, // 남은 바이트 수
//   clusterSize: 512, // 한 클러스터당 512B
//   totalClusters: 2048, // 총 2048개 클러스터
//   fat: {
//     1: -1, // file1.txt (1번 클러스터, EOF)
//     2: -1, // file2.bin (2번 클러스터, EOF)
//     3: -1, // report.pdf (3번 클러스터, EOF)
//   },
// };

// console.log(isClusterAvailable(infoData));

export {
  getFileData,
  getFileClusters,
  isClusterAvailable,
  getNextAvailableCluster,
  saveClusterData,
  addFileToDirectory,
};
