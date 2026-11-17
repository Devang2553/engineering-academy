/** Seeds the master curriculum. Only descriptive columns are updated, so learner progress is never overwritten. */
import { sql } from "drizzle-orm";
import type { Db } from "./index";
import { subjects, topics, unitPrereqs, units } from "./schema";
import { buildCurriculum } from "../lib/curriculum/build";

export async function seedCurriculum(db: Db) {
  const c = buildCurriculum();
  // Guard against an accidentally truncated curriculum file. Update these when topics are appended.
  if (c.units.length !== 165 || c.topics.length !== 280) throw new Error(`Unexpected curriculum size: ${c.units.length} units, ${c.topics.length} topics`);
  const ex = (col: string) => sql.raw(`excluded.${col}`);
  await db.insert(subjects).values(c.subjects).onConflictDoUpdate({ target: subjects.code, set: { name: ex("name"), short: ex("short"), position: ex("position") } });
  await db.insert(units).values(c.units.map((u) => ({ ...u, prereqs: undefined }))).onConflictDoUpdate({
    target: units.id,
    set: { title: ex("title"), position: ex("position"), difficulty: ex("difficulty"), importance: ex("importance"), estimatedMinutes: ex("estimated_minutes") },
  });
  await db.delete(unitPrereqs);
  await db.insert(unitPrereqs).values(c.units.flatMap((u) => u.prereqs.map((p) => ({ unitId: u.id, prereqId: p }))));
  for (let i = 0; i < c.topics.length; i += 100)
    await db.insert(topics).values(c.topics.slice(i, i + 100)).onConflictDoUpdate({
      target: topics.id,
      set: { name: ex("name"), subtopics: ex("subtopics"), kind: ex("kind"), position: ex("position"), unitId: ex("unit_id"), difficulty: ex("difficulty"), importance: ex("importance"), estimatedMinutes: ex("estimated_minutes") },
    });
  return c;
}
