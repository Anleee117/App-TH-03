export function toScale4(score10) {
  const num = Number(score10);
  if (isNaN(num)) {
    return { letter: 'F', scale4: 0.0 };
  }
  if (num >= 8.5) {
    return { letter: 'A', scale4: 4.0 };
  }
  if (num >= 8.0) {
    return { letter: 'B+', scale4: 3.5 };
  }
  if (num >= 7.0) {
    return { letter: 'B', scale4: 3.0 };
  }
  if (num >= 6.5) {
    return { letter: 'C+', scale4: 2.5 };
  }
  if (num >= 5.5) {
    return { letter: 'C', scale4: 2.0 };
  }
  if (num >= 5.0) {
    return { letter: 'D+', scale4: 1.5 };
  }
  if (num >= 4.0) {
    return { letter: 'D', scale4: 1.0 };
  }
  return { letter: 'F', scale4: 0.0 };
}

export function calcGpa(grades = [], courses = []) {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;
  let accumulatedCredits = 0;

  for (let i = 0; i < grades.length; i++) {
    const g = grades[i];
    let cred = 3;
    if (g.course && g.course.credits) {
      cred = Number(g.course.credits);
    } else if (courses && courses.length > 0) {
      const match = courses.find(c => c.id === g.courseId);
      if (match && match.credits) {
        cred = Number(match.credits);
      }
    }

    const conv = toScale4(g.total);
    totalPoints += conv.scale4 * cred;
    totalCredits += cred;

    if (conv.scale4 > 0) {
      accumulatedCredits += cred;
    }
  }

  const gpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  return {
    gpa,
    totalCredits: accumulatedCredits,
  };
}
