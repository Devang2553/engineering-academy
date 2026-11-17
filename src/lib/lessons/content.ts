/**
 * Hand-written lessons for the units scheduled on 17 November 2026.
 * Add new lessons at the end of this object as the plan advances. Never edit a
 * published lesson's topic ids, because learner progress is keyed by them.
 */
import type { Lesson } from "./model";
import { JS_LESSONS } from "./js";
import { AI_LESSONS } from "./ai-aws";
import { DIAGRAMS } from "./diagrams";

const ALL: Record<string, Lesson> = { ...JS_LESSONS, ...AI_LESSONS };

/** Each lesson gets its unit's picture, so no lesson can be shown without one. */
export const LESSONS: Record<string, Lesson> = Object.fromEntries(
  Object.entries(ALL).map(([id, lesson]) => [id, { ...lesson, diagram: DIAGRAMS[id] }]),
);
