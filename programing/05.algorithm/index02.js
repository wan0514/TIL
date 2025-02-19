// 문제 출처 : https://www.hackerrank.com/challenges/grading/problem

function gradingStudents(grades) {
  const result = grades.map((grade) => {
    if (grade >= 38 && grade % 5 >= 3) {
      return grade + (5 - (grade % 5));
    }

    return grade;
  });
  return result;
}
