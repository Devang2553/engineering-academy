import { addDays, diffDays, maxDate } from "./dates";

export type EngineUnit = {
  id: string;
  subjectCode: string;
  importance: number;
  difficulty: number;
  estimatedMinutes: number;
  prereqs: string[];
  done: boolean;
};

export type PlanInput = {
  units: EngineUnit[];
  startDate: string;
  deadline: string;
  today: string;
  unitsPerDay: number;
  dailyMinutes: number;
  /** Units already completed today — they use up today's slots. */
  completedToday?: number;
  /** Soft cap that keeps a day varied; relaxed when a day cannot otherwise be filled. */
  subjectCap?: number;
};

export type PlanDay = { date: string; unitIds: string[]; minutes: number };
export type Plan = {
  days: PlanDay[];
  /** Units that do not fit before the deadline. Never dropped — reported. */
  overflow: string[];
  remainingUnits: number;
  remainingDays: number;
  capacity: number;
  requiredPerDay: number;
  overloaded: boolean;
  heavyDays: string[];
};

/**
 * Deterministic schedule: same input, same plan. No randomness, no AI.
 *
 * Priority of an available unit =
 *   critical-path length (how long the chain of work behind it is — deadline urgency)
 *   + interview importance + number of units it directly unlocks.
 * A unit is available once every prerequisite is done or placed earlier.
 */
export function planSchedule(input: PlanInput): Plan {
  const { units, deadline, today, unitsPerDay, dailyMinutes } = input;
  const cap = input.subjectCap ?? 2;
  const first = maxDate(today, input.startDate);
  const remainingDays = Math.max(0, diffDays(first, deadline) + 1);

  const byId = new Map(units.map((u) => [u.id, u]));
  const pending = units.filter((u) => !u.done);
  const dependents = new Map<string, string[]>();
  for (const u of pending)
    for (const p of u.prereqs) {
      if (byId.get(p)?.done) continue;
      dependents.set(p, [...(dependents.get(p) ?? []), u.id]);
    }

  const tailMemo = new Map<string, number>();
  const tail = (id: string, seen: Set<string> = new Set()): number => {
    const hit = tailMemo.get(id);
    if (hit !== undefined) return hit;
    if (seen.has(id)) throw new Error(`Prerequisite cycle at ${id}`);
    seen.add(id);
    let best = 0;
    for (const d of dependents.get(id) ?? []) best = Math.max(best, tail(d, seen));
    seen.delete(id);
    tailMemo.set(id, best + 1);
    return best + 1;
  };
  const score = (u: EngineUnit) => tail(u.id) * 10 + u.importance * 3 + (dependents.get(u.id)?.length ?? 0);

  const placed = new Set<string>();
  const isReady = (u: EngineUnit) => u.prereqs.every((p) => byId.get(p)?.done || placed.has(p));
  const order = [...pending].sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));

  const days: PlanDay[] = [];
  for (let i = 0; i < remainingDays; i++) {
    const date = addDays(first, i);
    const slots = Math.max(0, unitsPerDay - (i === 0 ? input.completedToday ?? 0 : 0));
    const day: PlanDay = { date, unitIds: [], minutes: 0 };
    const perSubject = new Map<string, number>();
    for (const capped of [true, false]) {
      let progress = true;
      while (day.unitIds.length < slots && progress) {
        progress = false;
        for (const u of order) {
          if (placed.has(u.id) || !isReady(u)) continue;
          if (capped && (perSubject.get(u.subjectCode) ?? 0) >= cap) continue;
          placed.add(u.id);
          day.unitIds.push(u.id);
          day.minutes += u.estimatedMinutes;
          perSubject.set(u.subjectCode, (perSubject.get(u.subjectCode) ?? 0) + 1);
          progress = true;
          break; // re-scan from the top: placing a unit can unlock a higher-priority one
        }
      }
    }
    days.push(day);
  }

  const overflow = order.filter((u) => !placed.has(u.id)).map((u) => u.id);
  const capacity = days.reduce((n, d, i) => n + Math.max(0, unitsPerDay - (i === 0 ? input.completedToday ?? 0 : 0)), 0);
  return {
    days,
    overflow,
    remainingUnits: pending.length,
    remainingDays,
    capacity,
    requiredPerDay: remainingDays > 0 ? pending.length / remainingDays : pending.length > 0 ? Infinity : 0,
    overloaded: overflow.length > 0,
    heavyDays: days.filter((d) => d.minutes > dailyMinutes).map((d) => d.date),
  };
}

export type Pace = "complete" | "on_track" | "slightly_behind" | "significantly_behind";

/** Pace is judged only from real remaining workload against real remaining days. */
export function paceStatus(remainingUnits: number, remainingDays: number, unitsPerDay: number): Pace {
  if (remainingUnits === 0) return "complete";
  if (remainingDays <= 0) return "significantly_behind";
  const required = remainingUnits / remainingDays;
  if (required <= unitsPerDay) return "on_track";
  if (required <= unitsPerDay * 1.3) return "slightly_behind";
  return "significantly_behind";
}
