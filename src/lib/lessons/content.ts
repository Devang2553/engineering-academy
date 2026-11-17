/**
 * Hand-written lessons for the units scheduled on 17 November 2026.
 * Add new lessons at the end of this object as the plan advances. Never edit a
 * published lesson's topic ids, because learner progress is keyed by them.
 */
import type { Lesson } from "./model";
import { JS_LESSONS } from "./js";
import { AI_LESSONS } from "./ai-aws";

export const LESSONS: Record<string, Lesson> = { ...JS_LESSONS, ...AI_LESSONS };
