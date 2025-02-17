import { readFileSync } from 'fs';
import path from 'path';

//파일 경로
function getFilePath(fileName, fileFormat) {
  const currentDir = new URL('.', import.meta.url).pathname;
  return path.join(currentDir, fileName + '.' + fileFormat);
}

const FILE_NAME = getFilePath('1701410305471system', 'log');

const logData = readFileSync(FILE_NAME, 'utf-8');

console.log(logData);
