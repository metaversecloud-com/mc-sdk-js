export interface FireToastInterface {
  groupId?: string;
  title: string;
  text?: string;
}

export interface SubmitGradeInterface {
  /** Points earned by the visitor */
  score: number;
  /** Maximum possible points for this grade (must be > 0) */
  scoreMaximum: number;
  /**
   * Stable key for the gradebook column this grade belongs to (e.g. "quiz-1").
   * Repeat submissions with the same gradeKey update the same column. Ignored
   * when the visitor entered from a graded LMS assignment — the grade then
   * goes to that assignment's column automatically.
   */
  gradeKey?: string;
  /** Display name for the gradebook column (defaults to gradeKey) */
  label?: string;
  /** Optional comment shown alongside the grade in the LMS */
  comment?: string;
}
