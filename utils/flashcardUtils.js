/**
 * Maps SuperMemo-style grade to revisionData subfield (see models/user.js).
 * Review UI sends 0,2,3,4,5 (Forgotten, Hard, Medium, Easy, Very Easy).
 * @param {number} grade
 * @returns {string}
 */
export function gradeToRevisionField(grade) {
  switch (grade) {
    case 0:
    case 1:
      return "forgotten";
    case 2:
      return "difficult";
    case 3:
      return "medium";
    case 4:
      return "easy";
    case 5:
      return "very_easy";
    default:
      return "very_easy";
  }
}
