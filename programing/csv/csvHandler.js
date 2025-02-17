import fs from 'fs';
import path from 'path';
import { Table, database } from './table.js';

// 현재 파일 경로 생성 함수
function getFilePath(fileName, fileFormat) {
  const currentDir = new URL('.', import.meta.url).pathname;
  return path.join(currentDir, fileName + '.' + fileFormat);
}

// 테이블 생성 함수
function createFile({ tableName, columns, dataTypes }) {
  // 테이블 존재 여부 검사
  if (database.isTableExists(tableName)) {
    throw new Error('이미 존재하는 테이블입니다.');
  }

  // 테이블 추가
  const table = new Table(tableName, columns, dataTypes);
  database.addTable(table);

  // 테이블 데이터를 CSV 파일로 저장
  saveTableAsCsv(tableName);
}

// 테이블 데이터를 기반으로 CSV 파일 저장 : 생성,추가,제거 모두 이 함수 사용
function saveTableAsCsv(tableName) {
  const table = database.getTable(tableName);
  const filePath = getFilePath(tableName, 'csv');

  try {
    fs.writeFileSync(filePath, table.toCSV(), 'utf-8');
    console.log(`${tableName}.csv 파일이 성공적으로 저장되었습니다.`);
  } catch (err) {
    console.error('CSV 저장에 실패했습니다.', err);
    throw new Error('파일 저장에 실패했습니다.');
  }
}

// 데이터 삽입 함수
function insertToFile({ tableName, values }) {
  if (database.isTableExists(tableName)) {
    throw new Error('존재하지 않는 테이블입니다.');
  }

  // 타켓 테이블 변수
  const targetTable = database.getTable(tableName);

  // 테이블에 데이터 삽입
  targetTable.addRecord(values);

  // 변경된 테이블 데이터를 CSV로 저장
  saveTableAsCsv(tableName);

  console.log(`INSERTED (${values.join(', ')})`);
}

// 레코드 삭제 함수
function deleteFrom({ tableName, recordId }) {
  if (database.isTableExists(tableName)) {
    throw new Error('존재하지 않는 테이블입니다.');
  }

  // 타켓 테이블 변수
  const targetTable = database.getTable(tableName);

  // 레코드 삭제
  const deletedRecord = targetTable.removeRecord(recordId);

  // 변경된 테이블 데이터를 CSV로 저장
  saveTableAsCsv(tableName);

  console.log(`DELETED (${Object.values(deletedRecord).join(', ')})`);
}

export { createFile, insertToFile, deleteFrom };
