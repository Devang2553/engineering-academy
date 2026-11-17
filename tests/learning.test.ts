import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { seedCurriculum } from "../src/db/seed";
import { recordCheck, recordLessonRead } from "../src/lib/learning";

const NOW = new Date("2026-11-17T10:00:00Z");
let db: ReturnType<typeof drizzle<typeof schema>>;

beforeAll(async () => {
  db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  await seedCurriculum(db as never);
}, 120_000);

const status = async (id: string) => (await db.select().from(schema.topics).where(eq(schema.topics.id, id)))[0].status;

describe("learning rules (real database)", () => {
  it("does not complete a topic from a passed check alone", async () => {
    const r = await recordCheck(db as never, "JS1-T001", [1, 1, 2], NOW);
    expect(r?.grade.passed).toBe(true);
    expect(r?.completed).toEqual([]);
    expect(await status("JS1-T001")).not.toBe("completed");
  });

  it("completes the passed topic once the unit's lesson is read", async () => {
    const done = await recordLessonRead(db as never, "JS1-U01", NOW);
    expect(done).toEqual(["JS1-T001"]);
    expect(await status("JS1-T001")).toBe("completed");
    expect(await status("JS1-T002")).toBe("learning");
  });

  it("records a failing check as practicing and does not complete the topic", async () => {
    const r = await recordCheck(db as never, "JS1-T002", [0, 0, 0], NOW);
    expect(r?.grade.passed).toBe(false);
    expect(await status("JS1-T002")).toBe("practicing");
  });

  it("completes a topic straight away when its check passes after the lesson is read", async () => {
    const r = await recordCheck(db as never, "JS1-T002", [1, 1, 1], NOW);
    expect(r?.grade.passed).toBe(true);
    expect(r?.completed).toEqual(["JS1-T002"]);
    expect(await status("JS1-T002")).toBe("completed");
  });

  it("keeps the best mastery score across retakes", async () => {
    await recordCheck(db as never, "JS1-T002", [0, 0, 0], NOW);
    const [row] = await db.select().from(schema.topics).where(eq(schema.topics.id, "JS1-T002"));
    expect(row.masteryScore).toBe(100);
    expect(row.status).toBe("completed");
  });

  it("treats a skipped question as wrong and never as a pass", async () => {
    const r = await recordCheck(db as never, "AI-T004", [1, null, 1], NOW);
    expect(r?.grade.score).toBe(67);
    expect(r?.grade.passed).toBe(false);
  });

  it("returns null for a topic with no written check", async () => {
    expect(await recordCheck(db as never, "JS1-T005", [0], NOW)).toBeNull();
  });

  it("rejects an unknown lesson", async () => {
    await expect(recordLessonRead(db as never, "NOPE-U01", NOW)).rejects.toThrow();
  });
});
