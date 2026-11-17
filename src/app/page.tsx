import Link from "next/link";
import { Suspense } from "react";
import { ProgressBar, Skeleton } from "@/components/ui";
import { PLAN } from "@/lib/config";
import { loadAcademy } from "@/lib/queries";
import { formatDay } from "@/lib/schedule/dates";

const PACE = {
  complete: { label: "Curriculum complete", cls: "text-accent bg-accent-soft" },
  on_track: { label: "On track", cls: "text-accent bg-accent-soft" },
  slightly_behind: { label: "Slightly behind", cls: "text-warn bg-warn-soft" },
  significantly_behind: { label: "Significantly behind", cls: "text-bad bg-bad-soft" },
} as const;

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const a = await loadAcademy();
  const s = a.stats;
  const pace = PACE[s.pace];
  const todayMinutes = a.todayUnits.reduce((n, u) => n + u.estimatedMinutes, 0);
  const doneInPlan = a.todayUnits.filter((u) => u.done).length;
  const subjectShort = new Map(a.subjects.map((x) => [x.code, x.short]));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted">{formatDay(a.today)}</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Engineering Academy</h1>
      </header>

      <section className="rounded-2xl border border-line bg-card p-5">
        <p className="text-base leading-relaxed">Your target: Complete the curriculum by 20 December 2026.</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p><span className="font-serif text-5xl font-semibold tabular-nums">{s.daysRemaining}</span> <span className="text-muted">days remaining</span></p>
          <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${pace.cls}`}>{pace.label}</span>
        </div>
        <div className="mt-4"><ProgressBar value={s.percent} label="Curriculum completed" /></div>
        <p className="mt-2 text-sm text-muted">
          {s.completedTopics} of {s.totalTopics} topics completed ({s.percent}%). {s.remainingUnits} learning units left — that needs {s.requiredPerDay.toFixed(1)} a day; your plan is {PLAN.unitsPerDay}.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Completed" value={s.completedTopics} />
        <Stat label="Remaining" value={s.remainingTopics} />
        <Stat label="Units behind" value={s.behindUnits} tone={s.behindUnits > 0 ? "bad" : undefined} />
        <Stat label="Need revision" value={a.revisionTopics.length} tone={a.revisionTopics.length > 0 ? "warn" : undefined} />
        <Stat label="Day streak" value={s.streak} />
        <Stat label="Mastered" value={s.masteredTopics} />
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold">{a.started ? "Today's five" : `Starts ${formatDay(a.focusDate)}`}</h2>
          <p className="text-sm text-muted">{a.started ? `${doneInPlan} of ${a.todayUnits.length} done · ` : ""}about {todayMinutes} min</p>
        </div>
        {a.todayUnits.length === 0 ? (
          <p className="rounded-2xl border border-line bg-card p-5 text-muted">Nothing is scheduled for today.</p>
        ) : (
          <ol className="space-y-3">
            {a.todayUnits.map((u, i) => (
              <li key={u.id}>
                <Link href={`/topic/${u.topics[0].id}`} className="block rounded-2xl border border-line bg-card p-4 active:bg-accent-soft">
                  <p className="text-sm font-medium text-accent">{i + 1} · {subjectShort.get(u.subjectCode)} · {u.estimatedMinutes} min</p>
                  <p className="mt-1 text-lg font-semibold leading-snug">{u.title}</p>
                  {u.topics.length > 1 && <p className="mt-1 text-sm text-muted">{u.topics.length} checklist topics: {u.topics.map((t) => t.name).join(" · ")}</p>}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {(s.overflowUnits > 0 || s.remainingMinutes > s.availableMinutes || s.heavyDays > 0) && (
        <section className="rounded-2xl border border-line bg-warn-soft p-5 text-base leading-relaxed">
          <h2 className="font-semibold text-warn">Plan load</h2>
          {s.overflowUnits > 0 && <p className="mt-1">{s.overflowUnits} units do not fit before the deadline at {PLAN.unitsPerDay} a day. They stay in the checklist; nothing has been removed.</p>}
          {s.remainingMinutes > s.availableMinutes && <p className="mt-1">Estimated study time left is about {Math.round(s.remainingMinutes / 60)} hours, against {Math.round(s.availableMinutes / 60)} hours available at {PLAN.dailyMinutes / 60} hours a day.</p>}
          {s.heavyDays > 0 && <p className="mt-1">{s.heavyDays} scheduled days are estimated above {PLAN.dailyMinutes / 60} hours.</p>}
        </section>
      )}

      <Link href="/curriculum" className="flex min-h-14 items-center justify-between rounded-2xl border border-line bg-card px-5 text-lg font-medium">
        Full curriculum checklist <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "bad" | "warn" }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className={`font-serif text-3xl font-semibold tabular-nums ${tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : ""}`}>{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
