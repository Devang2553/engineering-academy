import type { TopicStatus } from "@/db/schema";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-2.5 w-full overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
  );
}

const STATUS: Record<TopicStatus, { label: string; cls: string }> = {
  not_started: { label: "Not started", cls: "text-muted bg-line/60" },
  scheduled: { label: "Scheduled", cls: "text-muted bg-line/60" },
  learning: { label: "Learning", cls: "text-warn bg-warn-soft" },
  practicing: { label: "Practicing", cls: "text-warn bg-warn-soft" },
  completed: { label: "Completed", cls: "text-accent bg-accent-soft" },
  needs_revision: { label: "Needs revision", cls: "text-bad bg-bad-soft" },
  mastered: { label: "Mastered", cls: "text-accent bg-accent-soft" },
};
export function StatusChip({ status }: { status: TopicStatus }) {
  const s = STATUS[status];
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

export function CheckMark({ done }: { done: boolean }) {
  return (
    <span aria-hidden className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${done ? "border-accent bg-accent text-card" : "border-line"}`}>
      {done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>}
    </span>
  );
}

export function Skeleton() {
  return (
    <div aria-busy className="animate-pulse space-y-4">
      <div className="h-8 w-2/3 rounded bg-line" />
      <div className="h-40 rounded-2xl bg-line" />
      <div className="h-24 rounded-2xl bg-line" />
      <div className="h-24 rounded-2xl bg-line" />
    </div>
  );
}
