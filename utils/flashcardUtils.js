/**
 * Maps flashcard grade (1-5) to revision data field name.
 * Used by UserRoute for tracking review outcomes.
 * @param {number} grade - User's self-assessment (1=forgotten, 5=very easy)
 * @returns {string} - Field name for revisionData
 */
export function gradeToRevisionField(grade) {
  switch (grade) {
    case 1:
      return "forgotten";
    case 2:
      return "hard";
    case 3:
      return "medium";
    case 4:
      return "easy";
    case 5:
    default:
      return "very_easy";
  }
}
