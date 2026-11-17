import { eq, sql } from "drizzle-orm";
import type { Db } from "../../db";
import { DONE_STATUSES, scheduleAudit, scheduleItems, settings, topics, unitPrereqs, units } from "../../db/schema";
import { PLAN } from "../config";
import { todayIn } from "./dates";
import { planSchedule, type EngineUnit } from "./engine";

/** Loads units with a `done` flag: a unit is done only when every topic inside it is finished. */
export async function loadEngineUnits(db: Db): Promise<(EngineUnit & { completedOn: string | null })[]> {
  const us = await db.select().from(units);
  const ps = await db.select().from(unitPrereqs);
  const ts = await db.select({ unitId: topics.unitId, status: topics.status, completedAt: topics.completedAt }).from(topics);
  return us.map((u) => {
    const mine = ts.filter((t) => t.unitId === u.id);
    const done = mine.length > 0 && mine.every((t) => DONE_STATUSES.includes(t.status));
    const last = done ? mine.map((t) => t.completedAt?.getTime() ?? 0).sort((a, b) => b - a)[0] : 0;
    return { ...u, prereqs: ps.filter((p) => p.unitId === u.id).map((p) => p.prereqId), done, completedOn: last ? todayIn(PLAN.timeZone, new Date(last)) : null };
  });
}

/**
 * Recalculates the schedule for every unfinished unit and records what changed.
 * Completed units keep their schedule row untouched. Nothing is ever removed.
 */
export async function replan(db: Db, today: string, reason: string) {
  const all = await loadEngineUnits(db);
  const plan = planSchedule({
    units: all,
    startDate: PLAN.startDate,
    deadline: PLAN.deadline,
    today,
    unitsPerDay: PLAN.unitsPerDay,
    dailyMinutes: PLAN.dailyMinutes,
    completedToday: all.filter((u) => u.completedOn === today).length,
  });

  const before = new Map((await db.select().from(scheduleItems)).map((r) => [r.unitId, r]));
  const next: { unitId: string; date: string | null; slot: number }[] = [];
  plan.days.forEach((d) => d.unitIds.forEach((unitId, slot) => next.push({ unitId, date: d.date, slot })));
  plan.overflow.forEach((unitId, slot) => next.push({ unitId, date: null, slot }));

  const changes: { unitId: string; from: string | null; to: string | null }[] = [];
  let added = 0;
  const dirty = next.filter((n) => {
    const old = before.get(n.unitId);
    if (!old) added++;
    else if (old.date !== n.date) changes.push({ unitId: n.unitId, from: old.date, to: n.date });
    return !old || old.date !== n.date || old.slot !== n.slot;
  });

  if (dirty.length > 0) {
    // One statement for the whole plan, then one to mirror it onto unfinished topics.
    await db.insert(scheduleItems).values(dirty).onConflictDoUpdate({ target: scheduleItems.unitId, set: { date: sql`excluded.date`, slot: sql`excluded.slot` } });
    await db.execute(sql`
      update topics t
      set target_date = s.date,
          status = case when t.status = 'not_started' and s.date is not null then 'scheduled' else t.status end
      from schedule_items s
      where s.unit_id = t.unit_id and t.status not in ('completed', 'needs_revision', 'mastered')`);
  }

  if (added > 0 || changes.length > 0)
    await db.insert(scheduleAudit).values({
      plannedFor: today,
      reason,
      summary: { moved: changes.length, added, remainingUnits: plan.remainingUnits, remainingDays: plan.remainingDays, overflow: plan.overflow.length, changes },
    });
  await db.insert(settings).values({ key: "lastPlannedFor", value: today }).onConflictDoUpdate({ target: settings.key, set: { value: today } });
  return plan;
}

/** Rolls the plan forward once per day so missed units are rescheduled honestly. */
export async function ensureFreshPlan(db: Db, today: string) {
  const [row] = await db.select().from(settings).where(eq(settings.key, "lastPlannedFor"));
  if (row?.value === today) return;
  await replan(db, today, row ? "Daily rollover: unfinished units rescheduled" : "Initial schedule");
}
