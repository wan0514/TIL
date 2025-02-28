//script 파일

// id map 객체

const timeSegments = {
  오: { id: 'time-1', isActive: false },
  열: { id: 'time-2', isActive: false },
  네: { id: 'time-3', isActive: false },
  일: { id: 'time-4', isActive: false },
  아: { id: 'time-5', isActive: false },
  이: { id: 'time-6', isActive: false },
  십: { id: 'time-7', isActive: false },
  사: { id: 'time-8', isActive: false },
  팔: { id: 'time-9', isActive: false },
  전: { id: 'time-10', isActive: false },
  한: { id: 'time-11', isActive: false },
  다: { id: 'time-12', isActive: false },
  곱: { id: 'time-13', isActive: false },
  홉: { id: 'time-14', isActive: false },
  삼: { id: 'time-15', isActive: false },
  일: { id: 'time-16', isActive: false },
  오: { id: 'time-17', isActive: false },
  구: { id: 'time-18', isActive: false },
  후: { id: 'time-19', isActive: false },
  두: { id: 'time-20', isActive: false },
  여: { id: 'time-21', isActive: false },
  여: { id: 'time-22', isActive: false },
  시: { id: 'time-23', isActive: false },
  사: { id: 'time-24', isActive: false },
  이: { id: 'time-25', isActive: false },
  육: { id: 'time-26', isActive: false },
  분: { id: 'time-27', isActive: false },
  영: { id: 'time-28', isActive: false },
  세: { id: 'time-29', isActive: false },
  섯: { id: 'time-30', isActive: false },
  덧: { id: 'time-31', isActive: false },
  '🌙': { id: 'time-32', isActive: false },
  오: { id: 'time-33', isActive: false },
  삼: { id: 'time-34', isActive: false },
  칠: { id: 'time-35', isActive: false },
  사십일초: { id: 'time-36', isActive: false },
};

//id의 색상을 바꾸는 함수

function changeColorById(id) {
  const element = document.getElementById(id);

  element.style.color = 'white';
}

// 현재 시간을  HH:MM:SS 로 반환 , date : date 객체
function getNowDateWithFormat(date) {
  const formatDate = date.toTimeString().split(' ')[0];
  return formatDate;
}
