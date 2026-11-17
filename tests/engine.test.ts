import { describe, expect, it } from "vitest";
import { buildCurriculum } from "../src/lib/curriculum/build";
import { PLAN } from "../src/lib/config";
import { paceStatus, planSchedule, type EngineUnit } from "../src/lib/schedule/engine";
import { addDays, diffDays } from "../src/lib/schedule/dates";

const { subjects, units, topics } = buildCurriculum();
const engineUnits = (done: Set<string> = new Set()): EngineUnit[] => units.map((u) => ({ ...u, done: done.has(u.id) }));
const base = { startDate: PLAN.startDate, deadline: PLAN.deadline, unitsPerDay: 5, dailyMinutes: 180 };

describe("curriculum", () => {
  it("has 12 subjects and unique ids", () => {
    expect(subjects).toHaveLength(12);
    expect(new Set(units.map((u) => u.id)).size).toBe(units.length);
    expect(new Set(topics.map((t) => t.id)).size).toBe(topics.length);
  });
  it("represents every Namaste JavaScript episode", () => {
    expect(topics.filter((t) => t.subjectCode === "JS1")).toHaveLength(19);
    expect(topics.filter((t) => t.subjectCode === "JS2")).toHaveLength(8);
    const s2 = topics.find((t) => t.name.startsWith("Promise APIs"))!;
    for (const api of ["Promise.all", "Promise.allSettled", "Promise.race", "Promise.any"]) expect(s2.subtopics).toContain(api);
  });
  it("every topic has subtopics", () => {
    for (const t of topics) expect(t.subtopics.length, t.id).toBeGreaterThanOrEqual(3);
  });
  it("prints the size", () => {
    const counts = Object.fromEntries(subjects.map((s) => [s.code, `${topics.filter((t) => t.subjectCode === s.code).length} topics / ${units.filter((u) => u.subjectCode === s.code).length} units`]));
    console.log(counts, "TOTAL", topics.length, "topics", units.length, "units");
  });
});

describe("deadline maths", () => {
  it("counts 34 calendar days", () => {
    expect(diffDays(PLAN.startDate, PLAN.deadline) + 1).toBe(34);
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
});

describe("scheduler", () => {
  const plan = planSchedule({ ...base, units: engineUnits(), today: "2026-11-16" });
  it("never schedules more than five units a day and never drops a unit", () => {
    for (const d of plan.days) expect(d.unitIds.length).toBeLessThanOrEqual(5);
    const placed = plan.days.flatMap((d) => d.unitIds);
    expect(new Set([...placed, ...plan.overflow]).size).toBe(units.length);
    console.log("days", plan.days.length, "capacity", plan.capacity, "placed", placed.length, "overflow", plan.overflow.length, "heavy days", plan.heavyDays.length, "max minutes", Math.max(...plan.days.map((d) => d.minutes)));
    console.log("day 1:", plan.days[0].unitIds.join(", "), "| last day:", plan.days.at(-1)!.unitIds.join(", "));
  });
  it("respects prerequisites", () => {
    const pos = new Map<string, number>();
    plan.days.forEach((d, di) => d.unitIds.forEach((id, si) => pos.set(id, di * 10 + si)));
    for (const u of units) for (const p of u.prereqs) if (pos.has(u.id)) expect(pos.get(p)!, `${p} before ${u.id}`).toBeLessThan(pos.get(u.id)!);
  });
  it("is deterministic", () => {
    expect(planSchedule({ ...base, units: engineUnits(), today: "2026-11-16" })).toEqual(plan);
  });
  it("recalculates when the learner falls behind, without removing anything", () => {
    const done = new Set(plan.days[0].unitIds.slice(0, 2));
    const late = planSchedule({ ...base, units: engineUnits(done), today: "2026-11-27" });
    expect(late.remainingUnits).toBe(units.length - 2);
    expect(late.overloaded).toBe(true);
    expect(late.days.flatMap((d) => d.unitIds).length + late.overflow.length).toBe(units.length - 2);
    expect(paceStatus(late.remainingUnits, late.remainingDays, 5)).toBe("significantly_behind");
  });
  it("judges pace from real workload", () => {
    expect(paceStatus(0, 10, 5)).toBe("complete");
    expect(paceStatus(50, 10, 5)).toBe("on_track");
    expect(paceStatus(60, 10, 5)).toBe("slightly_behind");
    expect(paceStatus(80, 10, 5)).toBe("significantly_behind");
    expect(paceStatus(1, 0, 5)).toBe("significantly_behind");
  });
});
