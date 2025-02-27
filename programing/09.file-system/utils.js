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

//test
// const fatData = {
//   1: -1, // file1.txt (1번 클러스터, EOF)
//   2: 4, // file2.bin (2번 클러스터, EOF)
//   3: -1,
//   4: -1, // report.pdf (3번 클러스터,
//   5: 6,
//   6: -1,
//   7: -1,
// };

// console.log(getFileClusters(fatData, 2));

export { getFileData, getFileClusters };
