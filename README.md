# Engineering Academy

Deadline-driven learning platform: complete curriculum, daily schedule, notes and interview preparation.
Target: finish the curriculum by 20 December 2026 (start 17 November 2026, five learning units a day).

## Run locally
    npm install --legacy-peer-deps
    npm run db:setup   # creates tables and seeds the curriculum (embedded Postgres in ./.data when DATABASE_URL is not set)
    npm run dev

## Deploy (Vercel)
Set `DATABASE_URL` to a Postgres connection string (for example Neon). The build runs `db:setup`,
which applies migrations and seeds the curriculum without touching progress or notes.

## Where things live
- `src/lib/curriculum/data.ts` — the master curriculum (stable, append-only)
- `src/lib/schedule/engine.ts` — deterministic scheduler and pace rules
- `src/lib/schedule/replan.ts` — recalculation with audit trail
- `src/db/schema.ts` — database schema
- `tests/` — `npm test`

## Status
Phase 1 done: curriculum database, hierarchical checklist, deadline maths, schedule engine.
Next: lessons, knowledge checks and topic completion (Phase 2).
