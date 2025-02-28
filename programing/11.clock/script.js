//script 파일

// class map 객체
const timeWords = {
  period: {
    오: { className: 'period-m' },
    전: { className: 'period-a' },
    후: { className: 'period-p' },
  },
  hour: {
    열: { className: 'hour-ten' },
    한: { className: 'hour-one' },
    두: { className: 'hour-two' },
    세: { className: 'hour-three' },
    네: { className: 'hour-four' },
    다: { className: 'hour-five' }, // 다섯과 여섯에 공통 사용
    여: { className: 'hour-six, hour-eight' }, // 다섯과 여섯에 공통 사용
    섯: { className: 'hour-five, hour-six' }, // 다섯과 여섯에서 공통되는 '섯'
    일: { className: 'hour-seven' },
    곱: { className: 'hour-seven' },
    덟: { className: 'hour-eight' }, // '여덟'에서 '덟' 부분
    아: { className: 'hour-nine' },
    홉: { className: 'hour-nine' }, // '아홉'에서 '홉' 부분
    시: { className: 'hour-label' }, // '시' 자체
  },
  minTens: {
    이: { className: 'minute-tens-two' },
    삼: { className: 'minute-tens-three' },
    사: { className: 'minute-tens-four' },
    오: { className: 'minute-tens-five' },
    십: { className: 'minute-tens' }, // 10의 자리 표현
  },
  minOnes: {
    일: { className: 'minute-ones-one' },
    이: { className: 'minute-ones-two' },
    삼: { className: 'minute-ones-three' },
    사: { className: 'minute-ones-four' },
    오: { className: 'minute-ones-five' },
    육: { className: 'minute-ones-six' },
    칠: { className: 'minute-ones-seven' },
    팔: { className: 'minute-ones-eight' },
    구: { className: 'minute-ones-nine' },
    분: { className: 'minute-label' }, // '분' 자체
  },
  영: { className: 'minute-zero' }, // 분이 0일 때 '영'
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
