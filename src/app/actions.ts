"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { PLAN } from "@/lib/config";
import { recordCheck, recordLessonRead } from "@/lib/learning";
import { todayIn } from "@/lib/schedule/dates";
import { replan } from "@/lib/schedule/replan";

/** Server actions for the lesson page. Every rule lives in src/lib/learning.ts, and the server re-checks it. */

export async function markLessonRead(unitId: string, _formData?: FormData) {
  const db = await getDb();
  const now = new Date();
  const completed = await recordLessonRead(db, unitId, now);
  if (completed.length) await replan(db, todayIn(PLAN.timeZone), `Completed ${completed.join(", ")}`);
  revalidatePath("/", "layout");
}

export async function submitCheck(topicId: string, formData: FormData) {
  const db = await getDb();
  // Answers arrive as q0, q1, … Missing or malformed answers count as wrong.
  const raw = [...formData.keys()].filter((k) => /^q\d+$/.test(k)).length;
  const count = Math.max(raw, 0);
  const picked = Array.from({ length: count }, (_, i) => {
    const v = formData.get(`q${i}`);
    return typeof v === "string" && v !== "" ? Number(v) : null;
  });
  const result = await recordCheck(db, topicId, picked, new Date());
  if (result?.completed.length) await replan(db, todayIn(PLAN.timeZone), `Completed ${result.completed.join(", ")}`);
  revalidatePath("/", "layout");
}
