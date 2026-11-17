/**
 * Lesson content model. Lessons are written by hand and kept in version control,
 * so they cost nothing to run and never change without a visible code change.
 *
 * A lesson belongs to one learning unit. Each topic inside that unit has its own
 * knowledge check. A topic counts as completed only when the unit's lesson has been
 * marked read AND that topic's check has been passed.
 */

export type Question = {
  prompt: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
};

export type LessonSection = { heading: string; body: string[] };

export type Lesson = {
  unitId: string;
  intro: string;
  sections: LessonSection[];
  takeaways: string[];
  checks: Record<string, Question[]>; // keyed by topic id, e.g. "JS1-T001"
};

export const PASS_MARK = 70;

export type GradeResult = {
  score: number; // 0-100
  passed: boolean;
  correct: number;
  total: number;
  results: { correct: boolean; picked: number | null; answer: number }[];
};

/** Grades one knowledge check. Missing or out-of-range answers count as wrong. */
export function gradeCheck(questions: Question[], picked: (number | null | undefined)[]): GradeResult {
  const results = questions.map((q, i) => {
    const p = picked[i];
    const valid = typeof p === "number" && Number.isInteger(p) && p >= 0 && p < q.options.length;
    return { correct: valid && p === q.answer, picked: valid ? p : null, answer: q.answer };
  });
  const correct = results.filter((r) => r.correct).length;
  const total = questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { score, passed: score >= PASS_MARK, correct, total, results };
}
