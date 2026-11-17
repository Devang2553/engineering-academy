import { boolean, date, index, integer, jsonb, pgTable, primaryKey, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * Three groups of tables, deliberately separated:
 *  1. Curriculum  — stable, seeded from src/lib/curriculum/data.ts. The scheduler never edits it.
 *  2. Learner     — progress, attempts, revisions, personal notes. Never overwritten by seeding or AI.
 *  3. Generated   — lessons, AI notes, interview questions. Versioned and replaceable.
 */

export const TOPIC_STATUSES = ["not_started", "scheduled", "learning", "practicing", "completed", "needs_revision", "mastered"] as const;
export type TopicStatus = (typeof TOPIC_STATUSES)[number];
/** Statuses that count as "finished" for the checklist and the scheduler. */
export const DONE_STATUSES: TopicStatus[] = ["completed", "needs_revision", "mastered"];

// ── 1. Curriculum ────────────────────────────────────────────────────────────
export const subjects = pgTable("subjects", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  short: text("short").notNull(),
  position: integer("position").notNull(),
});

export const units = pgTable("units", {
  id: text("id").primaryKey(),
  subjectCode: text("subject_code").notNull().references(() => subjects.code),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  difficulty: integer("difficulty").notNull(),
  importance: integer("importance").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
});

export const unitPrereqs = pgTable("unit_prereqs", {
  unitId: text("unit_id").notNull().references(() => units.id),
  prereqId: text("prereq_id").notNull().references(() => units.id),
}, (t) => [primaryKey({ columns: [t.unitId, t.prereqId] })]);

export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  subjectCode: text("subject_code").notNull().references(() => subjects.code),
  unitId: text("unit_id").notNull().references(() => units.id),
  name: text("name").notNull(),
  subtopics: jsonb("subtopics").$type<string[]>().notNull(),
  kind: text("kind").$type<"concept" | "exercise">().notNull(),
  position: integer("position").notNull(),
  difficulty: integer("difficulty").notNull(),
  importance: integer("importance").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  // Learner state lives on the row but is never touched by seeding.
  status: text("status").$type<TopicStatus>().notNull().default("not_started"),
  masteryScore: integer("mastery_score").notNull().default(0),
  targetDate: date("target_date"),
  revisionDate: date("revision_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (t) => [index("topics_unit_idx").on(t.unitId), index("topics_subject_idx").on(t.subjectCode)]);

// ── Schedule (adapts daily; every change is audited) ─────────────────────────
export const scheduleItems = pgTable("schedule_items", {
  unitId: text("unit_id").primaryKey().references(() => units.id),
  date: date("date"), // null = does not fit before the deadline (overflow)
  slot: integer("slot").notNull().default(0),
}, (t) => [index("schedule_date_idx").on(t.date)]);

export const scheduleAudit = pgTable("schedule_audit", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  plannedFor: date("planned_for").notNull(),
  reason: text("reason").notNull(),
  summary: jsonb("summary").$type<{ moved: number; added: number; remainingUnits: number; remainingDays: number; overflow: number; changes: { unitId: string; from: string | null; to: string | null }[] }>().notNull(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

// ── 2. Learner ───────────────────────────────────────────────────────────────
export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull().references(() => topics.id),
  kind: text("kind").$type<"quiz" | "practical" | "revision">().notNull(),
  score: integer("score").notNull(), // 0-100
  passed: boolean("passed").notNull(),
  detail: jsonb("detail"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("attempts_topic_idx").on(t.topicId)]);

export const revisions = pgTable("revisions", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull().references(() => topics.id),
  dueDate: date("due_date").notNull(),
  round: integer("round").notNull().default(1),
  doneAt: timestamp("done_at", { withTimezone: true }),
  passed: boolean("passed"),
}, (t) => [index("revisions_due_idx").on(t.dueDate)]);

/** Personal notes are keyed by topic, not by lesson — regenerating a lesson cannot reach them. */
export const personalNotes = pgTable("personal_notes", {
  topicId: text("topic_id").primaryKey().references(() => topics.id),
  content: text("content").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  pinned: boolean("pinned").notNull().default(false),
  bookmarked: boolean("bookmarked").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const readingProgress = pgTable("reading_progress", {
  unitId: text("unit_id").primaryKey().references(() => units.id),
  section: text("section"),
  percent: integer("percent").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── 3. Generated ─────────────────────────────────────────────────────────────
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: text("unit_id").notNull().references(() => units.id),
  version: integer("version").notNull(),
  status: text("status").$type<"draft" | "validated" | "published" | "failed">().notNull().default("draft"),
  content: jsonb("content"),
  model: text("model"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("lessons_unit_version_idx").on(t.unitId, t.version)]);

export const aiNotes = pgTable("ai_notes", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull().references(() => topics.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  markdown: text("markdown").notNull(),
}, (t) => [index("ai_notes_topic_idx").on(t.topicId)]);

export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").notNull().references(() => topics.id),
  level: text("level").$type<"foundational" | "intermediate" | "advanced">().notNull(),
  type: text("type").$type<"concept" | "coding" | "output" | "scenario" | "tradeoff">().notNull(),
  payload: jsonb("payload").notNull(),
}, (t) => [index("iq_topic_idx").on(t.topicId)]);

export const interviewSessions = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  topicId: text("topic_id").references(() => topics.id),
  transcript: jsonb("transcript").notNull().default([]),
  scores: jsonb("scores"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
