import { describe, expect, it } from "vitest";
import { buildCurriculum } from "../src/lib/curriculum/build";
import { LESSONS } from "../src/lib/lessons/content";
import { PASS_MARK, gradeCheck } from "../src/lib/lessons/model";

const { units, topics } = buildCurriculum();
const q2 = [
  { prompt: "a", options: ["x", "y"], answer: 1, explanation: "" },
  { prompt: "b", options: ["x", "y", "z"], answer: 2, explanation: "" },
];

describe("grading", () => {
  it("scores all-correct as 100 and passes", () => {
    const g = gradeCheck(q2, [1, 2]);
    expect(g).toMatchObject({ score: 100, passed: true, correct: 2, total: 2 });
  });
  it("uses the pass mark", () => {
    expect(PASS_MARK).toBe(70);
    const three = [...q2, { prompt: "c", options: ["a", "b"], answer: 0, explanation: "" }];
    expect(gradeCheck(three, [1, 2, 1])).toMatchObject({ score: 67, passed: false });
    expect(gradeCheck(three, [1, 2, 0])).toMatchObject({ score: 100, passed: true });
  });
  it("treats missing, out-of-range and non-integer answers as wrong", () => {
    expect(gradeCheck(q2, [null, 9]).score).toBe(0);
    expect(gradeCheck(q2, [1.5, undefined as unknown as number]).score).toBe(0);
    expect(gradeCheck(q2, [-1, 2]).correct).toBe(1);
  });
  it("gives 0 for an empty check rather than dividing by zero", () => {
    expect(gradeCheck([], [])).toMatchObject({ score: 0, passed: false, total: 0 });
  });
});

describe("first-week lessons", () => {
  const firstUnits = ["JS1-U01", "JS1-U02", "AI-U01", "AI-U02", "AWS-U01"];
  const topicIds = new Set(topics.map((t) => t.id));

  it("has a lesson for each of the five units dated 17 November", () => {
    for (const id of firstUnits) expect(LESSONS[id], id).toBeDefined();
  });

  it("only refers to real units and real topics", () => {
    const unitIds = new Set(units.map((u) => u.id));
    for (const [key, lesson] of Object.entries(LESSONS)) {
      expect(lesson.unitId).toBe(key);
      expect(unitIds.has(key)).toBe(true);
      for (const tid of Object.keys(lesson.checks)) expect(topicIds.has(tid), tid).toBe(true);
    }
  });

  it("gives every topic in those units a check of at least three questions with valid answers", () => {
    for (const id of firstUnits) {
      const unitTopics = topics.filter((t) => t.unitId === id);
      for (const t of unitTopics) {
        const qs = LESSONS[id].checks[t.id];
        expect(qs, t.id).toBeDefined();
        expect(qs.length, t.id).toBeGreaterThanOrEqual(3);
        for (const q of qs) {
          expect(q.answer).toBeGreaterThanOrEqual(0);
          expect(q.answer).toBeLessThan(q.options.length);
          expect(new Set(q.options).size, q.prompt).toBe(q.options.length);
          expect(q.explanation.length).toBeGreaterThan(10);
        }
      }
    }
  });

  it("has lesson sections and takeaways for each lesson", () => {
    for (const id of firstUnits) {
      expect(LESSONS[id].sections.length).toBeGreaterThanOrEqual(2);
      expect(LESSONS[id].takeaways.length).toBeGreaterThanOrEqual(3);
    }
  });
});
