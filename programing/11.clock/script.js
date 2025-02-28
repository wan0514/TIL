//script 파일

// class map 객체

const timeSegments = {
  오: { class: 'm', isActive: false },
  전: { class: 'am', isActive: false },
  후: { class: 'pm', isActive: false },
  한: { class: 'hour-1', isActive: false },
  두: { class: 'hour-5', isActive: false },
  세: { class: 'hour-6', isActive: false },
  네: { class: 'hour-7', isActive: false },
  다: { class: 'hour-8', isActive: false },
  여: { class: 'hour-9', isActive: false },
  일: { class: 'hour-10', isActive: false },
  여: { class: 'hour-11', isActive: false },
  아: { class: 'hour-12', isActive: false },
  열: { class: 'hour-13', isActive: false },
  섯: { class: 'hour-14', isActive: false },
  홉: { class: 'hour-15', isActive: false },
  일: { class: 'hour-16', isActive: false },
  오: { class: 'time-17', isActive: false },
  구: { class: 'time-18', isActive: false },
  후: { class: 'time-19', isActive: false },
  두: { class: 'time-20', isActive: false },
  여: { class: 'time-21', isActive: false },
  여: { class: 'time-22', isActive: false },
  시: { class: 'time-23', isActive: false },
  사: { class: 'time-24', isActive: false },
  이: { class: 'time-25', isActive: false },
  육: { class: 'time-26', isActive: false },
  분: { class: 'time-27', isActive: false },
  영: { class: 'time-28', isActive: false },
  세: { class: 'time-29', isActive: false },
  섯: { class: 'time-30', isActive: false },
  덧: { class: 'time-31', isActive: false },
  '🌙': { class: 'time-32', isActive: false },
  오: { class: 'time-33', isActive: false },
  삼: { class: 'time-34', isActive: false },
  칠: { class: 'time-35', isActive: false },
  사십일초: { class: 'time-36', isActive: false },
};

//class의 색상을 바꾸는 함수

function changeColorByClass(className) {
  const element = document.getElementByClass(className);

  element.style.color = 'white';
}

// 현재 시간을  {PM/AM,HH,MM,SS} 로 반환
function getNowDateWithFormat(date) {
  const formatDate = date.toTimeString().split(' ')[0]; // 시간을 "HH:MM:SS" 형태로 변환
  const [hour, min, second] = formatDate.split(':').map(Number);

  // 12시 기준으로 오전/오후 구분
  const period = hour >= 12 ? 'PM' : 'AM';

  // 12시 이상의 시간을 12시간제로 변환
  const hour12 = hour % 12 || 12; // 12시를 12로 유지하고, 그 외는 12로 나누어줌

  return { hour12, min, second, period };
}

// HH:MM:SS 를 한글로 변환
function formatDateToKr({ hour12, min, second, period }) {
  const hourkoreanNumbers = [
    '영',
    '한',
    '두',
    '세',
    '네',
    '다섯',
    '여섯',
    '일곱',
    '여덟',
    '아홉',
    '열',
  ];
  const minkoreanNumbers = [
    '영',
    '일',
    '이',
    '삼',
    '사',
    '오',
    '육',
    '칠',
    '팔',
    '구',
    '십',
  ];

  const periodLetter = { AM: '오전', PM: '오후' };

  let periodKr = '';
  let hourKr = '';
  let minKr = '';
  let secKr = '';

  //오전 오후
  periodKr = periodLetter[period.toUpperCase()];

  //시
  if (hour12 > 10) {
    hourKr = hourkoreanNumbers[10] + hourkoreanNumbers[hour12 % 10];
  } else {
    hourKr = hourkoreanNumbers[hour12];
  }
  // 분
  if (min >= 20) {
    minKr = minkoreanNumbers[Math.floor(min / 10)] + minkoreanNumbers[10];
    if (min % 10 !== 0) minKr += minkoreanNumbers[min % 10];
  } else if (min > 10) {
    minKr = minkoreanNumbers[10] + minkoreanNumbers[min % 10];
  } else {
    minKr = minkoreanNumbers[min];
  }

  //초

  //todo: 19가 일십구로 나옴
  if (second >= 20) {
    secKr = minkoreanNumbers[Math.floor(second / 10)] + minkoreanNumbers[10];
    if (second % 10 !== 0) secKr += minkoreanNumbers[second % 10];
  } else if (second > 10) {
    secKr = minkoreanNumbers[10] + minkoreanNumbers[second % 10];
  } else {
    secKr = minkoreanNumbers[second];
  }

  return { periodKr, hourKr, minKr, secKr };
}

// ====test=====
const time = new Date();
const a = getNowDateWithFormat(time);
const b = formatDateToKr(a);
console.log(a);
console.log(b);
