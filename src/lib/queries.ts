import { connection } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { DONE_STATUSES, attempts, readingProgress, scheduleItems, subjects, topics, unitPrereqs, units, type TopicStatus } from "@/db/schema";
import { PLAN } from "@/lib/config";
import { addDays, diffDays, maxDate, todayIn } from "@/lib/schedule/dates";
import { paceStatus } from "@/lib/schedule/engine";
import { ensureFreshPlan } from "@/lib/schedule/replan";

const isDone = (s: TopicStatus) => DONE_STATUSES.includes(s);

/** One consistent snapshot used by every page, so numbers can never disagree between screens. */
export async function loadAcademy() {
  await connection();
  const db = await getDb();
  const today = todayIn(PLAN.timeZone);
  await ensureFreshPlan(db, today);

  const [ss, us, ts, sched, prereqs] = await Promise.all([
    db.select().from(subjects).orderBy(subjects.position),
    db.select().from(units).orderBy(units.position),
    db.select().from(topics).orderBy(topics.position),
    db.select().from(scheduleItems),
    db.select().from(unitPrereqs),
  ]);
  const schedByUnit = new Map(sched.map((s) => [s.unitId, s]));

  const unitRows = us.map((u) => {
    const mine = ts.filter((t) => t.unitId === u.id);
    const s = schedByUnit.get(u.id);
    return { ...u, topics: mine, done: mine.every((t) => isDone(t.status)), date: s?.date ?? null, slot: s?.slot ?? 0, prereqs: prereqs.filter((p) => p.unitId === u.id).map((p) => p.prereqId) };
  });

  const totalTopics = ts.length;
  const completedTopics = ts.filter((t) => isDone(t.status)).length;
  const masteredTopics = ts.filter((t) => t.status === "mastered").length;
  const totalUnits = unitRows.length;
  const doneUnits = unitRows.filter((u) => u.done).length;
  const remainingUnits = totalUnits - doneUnits;

  const started = today >= PLAN.startDate;
  const firstDay = maxDate(today, PLAN.startDate);
  const daysRemaining = Math.max(0, diffDays(firstDay, PLAN.deadline) + 1);
  const totalDays = diffDays(PLAN.startDate, PLAN.deadline) + 1;
  // Full days that have already passed. Work expected by now, at the steady pace needed to finish everything.
  const daysElapsed = Math.min(totalDays, Math.max(0, diffDays(PLAN.startDate, today)));
  const expectedDoneUnits = Math.min(totalUnits, Math.floor((totalUnits / totalDays) * daysElapsed));
  const behindUnits = Math.max(0, expectedDoneUnits - doneUnits);

  const focusDate = firstDay;
  const todayUnits = unitRows.filter((u) => u.date === focusDate).sort((a, b) => a.slot - b.slot);
  const completedTodayUnits = unitRows.filter((u) => u.done && u.topics.some((t) => t.completedAt && todayIn(PLAN.timeZone, t.completedAt) === today));

  const minutesByDay = new Map<string, number>();
  for (const u of unitRows) if (!u.done && u.date) minutesByDay.set(u.date, (minutesByDay.get(u.date) ?? 0) + u.estimatedMinutes);
  const heavyDays = [...minutesByDay.values()].filter((m) => m > PLAN.dailyMinutes).length;
  const remainingMinutes = unitRows.filter((u) => !u.done).reduce((n, u) => n + u.estimatedMinutes, 0);
  const availableMinutes = daysRemaining * PLAN.dailyMinutes;
  const overflowUnits = unitRows.filter((u) => !u.done && u.date === null).length;

  const revisionTopics = ts.filter((t) => t.status === "needs_revision" || (t.revisionDate !== null && t.revisionDate <= today && isDone(t.status)));

  // Streak: consecutive days, ending today or yesterday, with at least one topic completed.
  const doneDays = new Set(ts.filter((t) => t.completedAt).map((t) => todayIn(PLAN.timeZone, t.completedAt!)));
  let streak = 0;
  for (let d = doneDays.has(today) ? today : addDays(today, -1); doneDays.has(d); d = addDays(d, -1)) streak++;

  return {
    today,
    started,
    focusDate,
    subjects: ss.map((s) => {
      const sus = unitRows.filter((u) => u.subjectCode === s.code);
      const sts = ts.filter((t) => t.subjectCode === s.code);
      const done = sts.filter((t) => isDone(t.status)).length;
      return { ...s, units: sus, total: sts.length, done, mastered: sts.filter((t) => t.status === "mastered").length };
    }),
    units: unitRows,
    todayUnits,
    completedTodayUnits: completedTodayUnits.length,
    revisionTopics,
    stats: {
      totalTopics, completedTopics, masteredTopics, remainingTopics: totalTopics - completedTopics,
      percent: totalTopics ? Math.floor((completedTopics / totalTopics) * 100) : 0,
      totalUnits, doneUnits, remainingUnits, daysRemaining, totalDays, behindUnits, streak,
      requiredPerDay: daysRemaining > 0 ? remainingUnits / daysRemaining : remainingUnits,
      pace: paceStatus(remainingUnits, daysRemaining, PLAN.unitsPerDay),
      heavyDays, remainingMinutes, availableMinutes, overflowUnits,
    },
  };
}
export type Academy = Awaited<ReturnType<typeof loadAcademy>>;

/** Learner state for one topic's lesson and check. Read after loadAcademy, so it is always fresh. */
export async function loadLessonState(unitId: string, topicId: string) {
  await connection();
  const db = await getDb();
  const [rp] = await db.select().from(readingProgress).where(eq(readingProgress.unitId, unitId));
  const [last] = await db
    .select()
    .from(attempts)
    .where(eq(attempts.topicId, topicId))
    .orderBy(desc(attempts.createdAt))
    .limit(1);
  return {
    lessonRead: (rp?.percent ?? 0) >= 100,
    last: last ? { score: last.score, passed: last.passed, picked: (last.detail as { picked?: (number | null)[] } | null)?.picked ?? [] } : null,
  };
}
