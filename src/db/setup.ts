/** Applies migrations and seeds the master curriculum. Safe to run on every deploy. */
import { databaseUrl, getDb } from "./index";
import { seedCurriculum } from "./seed";
import { PLAN } from "../lib/config";
import { todayIn } from "../lib/schedule/dates";
import { ensureFreshPlan } from "../lib/schedule/replan";

async function main() {
  const db = await getDb();
  if (databaseUrl()) {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    await migrate(db as never, { migrationsFolder: "./drizzle" });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    await migrate(db, { migrationsFolder: "./drizzle" });
  }

  const c = await seedCurriculum(db);
  await ensureFreshPlan(db, todayIn(PLAN.timeZone));
  console.log(`Curriculum ready: ${c.subjects.length} subjects, ${c.units.length} learning units, ${c.topics.length} topics.`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
