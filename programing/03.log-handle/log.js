class LogAnalyzer {
  constructor(logs = []) {
    this.logs = logs;
  }

  filterByKeyValue(key, value) {
    return this.logs.filter((log) => log[key] === value);
  }
  sortByTimestamp() {
    //깊은 복사 : 원본 배열 영향 x
    const logs = JSON.parse(JSON.stringify(this.logs));

    // 타임스탬프 변환 후 Date 객체로 정렬
    return logs.sort((a, b) => {
      if (b.timestamp === undefined) {
        throw new Error('b: ', b);
      }
      // 변환된 문자열을 Date 객체로 변환
      const dateA = new Date(replaceTimestamp(a.timestamp));
      const dateB = new Date(replaceTimestamp(b.timestamp));

      return dateA - dateB; // 시간 순으로 정렬
    });
  }

  sortByProcess() {
    const logs = JSON.parse(JSON.stringify(this.logs));

    return logs.sort((a, b) => {
      //소문자 대문자 상관없이 정렬해야함
      const processA = a.process.toUpperCase();
      const processB = b.process.toUpperCase();

      return processA.localeCompare(processB);
    });
  }

  countByKeyValue(key, value) {
    const filteredLogs = this.logs.filter((log) => log[key] === value);
    return filteredLogs.length;
  }

  getError() {
    return this.logs.filter((log) => Object.values(log).includes(undefined));
  }
}

export { LogAnalyzer };

function replaceTimestamp(timestamp) {
  // timestamp의 정규식
  const regex = /^(\d{2}:\d{2}:\d{2}\.\d{6})\+(\d{4})$/;
  // 오늘 날짜 (예: '2025-02-17')
  const currentDate = new Date().toISOString().split('T')[0];

  return timestamp.replace(regex, (match, time, timezone) => {
    return `${currentDate}T${time}+${timezone}`;
  });
}
