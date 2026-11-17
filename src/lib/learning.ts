/**
 * The learning rules, free of Next.js so they can be tested against a real database.
 *
 * Completion: a topic becomes "completed" only when
 *   (1) its unit's lesson has been marked read, AND
 *   (2) the topic's knowledge check has been passed.
 */
import { and, eq, inArray } from "drizzle-orm";
import type { Db } from "../db/index";
import { attempts, readingProgress, topics } from "../db/schema";
import { LESSONS } from "./lessons/content";
import { gradeCheck, type GradeResult } from "./lessons/model";

const DONE = ["completed", "mastered", "needs_revision"];

/** Marks a unit's lesson as read. Returns the ids of topics newly completed by this step. */
export async function recordLessonRead(db: Db, unitId: string, now: Date): Promise<string[]> {
  if (!LESSONS[unitId]) throw new Error(`No lesson for ${unitId}`);
  await db
    .insert(readingProgress)
    .values({ unitId, section: "lesson", percent: 100, updatedAt: now })
    .onConflictDoUpdate({ target: readingProgress.unitId, set: { percent: 100, section: "lesson", updatedAt: now } });

  // A read-but-unchecked topic is "learning".
  const unitTopics = await db.select().from(topics).where(eq(topics.unitId, unitId));
  const started = unitTopics.filter((t) => t.status === "not_started" || t.status === "scheduled").map((t) => t.id);
  if (started.length) await db.update(topics).set({ status: "learning" }).where(inArray(topics.id, started));

  return completeEligible(db, unitId, now);
}

/**
 * Grades one knowledge check against the questions stored in the lesson content.
 * Returns null when the topic has no check. Returns the newly completed topic ids otherwise.
 */
export async function recordCheck(
  db: Db,
  topicId: string,
  picked: (number | null)[],
  now: Date,
): Promise<{ grade: GradeResult; completed: string[] } | null> {
  const [topic] = await db.select().from(topics).where(eq(topics.id, topicId));
  if (!topic) throw new Error(`Unknown topic ${topicId}`);
  const questions = LESSONS[topic.unitId]?.checks[topicId];
  if (!questions) return null;

  const grade = gradeCheck(questions, picked);
  await db.insert(attempts).values({
    topicId,
    kind: "quiz",
    score: grade.score,
    passed: grade.passed,
    detail: { picked: grade.results.map((r) => r.picked), correct: grade.correct, total: grade.total },
    createdAt: now,
  });

  if (grade.passed) {
    await db.update(topics).set({ masteryScore: Math.max(topic.masteryScore, grade.score) }).where(eq(topics.id, topicId));
  } else if (!DONE.includes(topic.status) && topic.status !== "practicing") {
    await db.update(topics).set({ status: "practicing" }).where(eq(topics.id, topicId));
  }

  const completed = await completeEligible(db, topic.unitId, now);
  return { grade, completed };
}

/** Completes every topic with a passed check, once the unit's lesson is read. */
async function completeEligible(db: Db, unitId: string, now: Date): Promise<string[]> {
  const [progress] = await db.select().from(readingProgress).where(eq(readingProgress.unitId, unitId));
  if ((progress?.percent ?? 0) < 100) return [];

  const unitTopics = await db.select().from(topics).where(eq(topics.unitId, unitId));
  const candidates = unitTopics.filter((t) => !DONE.includes(t.status) && t.status !== "completed").map((t) => t.id);
  if (candidates.length === 0) return [];
  const passed = new Set(
    (await db.select({ topicId: attempts.topicId }).from(attempts).where(and(inArray(attempts.topicId, candidates), eq(attempts.passed, true)))).map((a) => a.topicId),
  );

  const newly = candidates.filter((id) => passed.has(id));
  if (newly.length) await db.update(topics).set({ status: "completed", completedAt: now }).where(inArray(topics.id, newly));
  return newly;
}
