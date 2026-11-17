import Link from "next/link";
import { Suspense } from "react";
import { CheckMark, ProgressBar, Skeleton, StatusChip } from "@/components/ui";
import { DONE_STATUSES } from "@/db/schema";
import { loadAcademy } from "@/lib/queries";
import { formatDay } from "@/lib/schedule/dates";

export const metadata = { title: "Curriculum · Engineering Academy" };

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Curriculum />
    </Suspense>
  );
}

async function Curriculum() {
  const a = await loadAcademy();
  const s = a.stats;
  const currentSubjects = new Set(a.todayUnits.map((u) => u.subjectCode));
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Curriculum</h1>
        <p className="mt-1 text-muted">
          {s.totalTopics} topics in {s.totalUnits} learning units · {s.completedTopics} completed · {s.remainingTopics} remaining · {s.daysRemaining} days to 20 December
        </p>
        <div className="mt-3"><ProgressBar value={s.percent} label="Curriculum completed" /></div>
      </header>

      {a.subjects.map((sub) => {
        const pct = sub.total ? Math.floor((sub.done / sub.total) * 100) : 0;
        const mastery = sub.total ? Math.floor((sub.mastered / sub.total) * 100) : 0;
        return (
          <details key={sub.code} open={currentSubjects.has(sub.code)} className="rounded-2xl border border-line bg-card">
            <summary className="p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold leading-snug">{sub.name}</h2>
                <svg className="chev mt-1 shrink-0 text-muted transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 6 6 6-6 6" /></svg>
              </div>
              <p className="mt-1 mb-2 text-sm text-muted">{sub.done} of {sub.total} topics · {pct}% complete · {mastery}% mastered</p>
              <ProgressBar value={pct} label={`${sub.name} completed`} />
            </summary>
            <div className="border-t border-line">
              {sub.units.map((u) => (
                <div key={u.id} className="border-b border-line px-4 py-3 last:border-b-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {u.done ? "Done" : u.date ? formatDay(u.date) : "Beyond deadline"} · {u.estimatedMinutes} min{u.topics.length > 1 ? ` · ${u.title}` : ""}
                  </p>
                  <ul>
                    {u.topics.map((t) => (
                      <li key={t.id}>
                        <Link href={`/topic/${t.id}`} className="flex min-h-12 items-start gap-3 py-2">
                          <CheckMark done={DONE_STATUSES.includes(t.status)} />
                          <span className="flex-1 text-base leading-snug">{t.name}</span>
                          {t.status !== "not_started" && t.status !== "scheduled" && <StatusChip status={t.status} />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
