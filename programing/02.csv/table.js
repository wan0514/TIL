class Table {
  constructor(tableName, columns, dataTypes) {
    this.tableName = tableName;

    this.columns = columns.map((column, index) => ({
      name: column,
      dataType: dataTypes[index],
    }));

    this.records = [];
  }

  // 레코드 추가 메서드
  addRecord(record) {
    const newId = this.records.length + 1;

    const newRecord = { id: newId };
    this.columns.forEach((col, index) => {
      newRecord[col.name] = record[index];
    });

    this.records.push(newRecord);
  }

  // 레코드 삭제 메서드
  removeRecord(recordId) {
    const index = this.records.findIndex((record) => record.id === recordId);
    if (index === -1) {
      throw new Error(`ID ${recordId}인 레코드를 찾을 수 없습니다.`);
    }
    return this.records.splice(index, 1)[0];
  }

  // 테이블 데이터를 CSV 형식으로 변환하는 메서드
  toCSV() {
    const header = this.columns.map((col) => col.name).join(','); // 컬럼명
    const separator = '-'.repeat(header.length); // 칼럼 밑 줄 생성
    const rows = this.records
      .map((record) => this.columns.map((col) => record[col.name]).join(','))
      .join('\n');

    return `${header}\n${separator}\n${rows}`;
  }
}

class Database {
  constructor() {
    this.tables = [];
  }

  addTable(table) {
    this.tables.push(table);
  }

  getTable(tableName) {
    return this.tables.find((table) => table.tableName === tableName);
  }

  isTableExists(tableName) {
    return this.tables.includes((table) => table.tableName === tableName);
  }
}

const database = new Database();

export { database, Table };
