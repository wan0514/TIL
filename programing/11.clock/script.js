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

  // 숫자 10~19 처리 (십구와 같이)
  const convertToKorean = (num, koreanNumbers) => {
    if (num < 10) {
      return koreanNumbers[num]; // 10 미만은 그대로 숫자로 반환
    }

    const tens = Math.floor(num / 10); // 10의 자리를 구함
    const ones = num % 10; // 1의 자리를 구함

    // 10~19: 십일, 십이...
    if (tens === 1) {
      return koreanNumbers[10] + (ones === 0 ? '' : koreanNumbers[ones]);
    }

    // 20 이상: 이십, 삼십... 또는 이십일, 이십이...
    return (
      koreanNumbers[tens] +
      koreanNumbers[10] +
      (ones === 0 ? '' : koreanNumbers[ones])
    );
  };

  // 오전/오후 처리
  const periodKr = periodLetter[period.toUpperCase()];

  // 시 처리 (12시간제)
  let hourKr = convertToKorean(hour12, hourkoreanNumbers); // 시간은 일반화된 방식으로 처리

  // 분 처리
  const minKr = convertToKorean(min, minkoreanNumbers);

  // 초 처리
  const secKr = convertToKorean(second, minkoreanNumbers);

  return { periodKr, hourKr, minKr, secKr };
}

// ====test=====
const time = new Date();
const a = getNowDateWithFormat(time);
const b = formatDateToKr(a);
console.log(a);
console.log(b);
