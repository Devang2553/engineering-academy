import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton, StatusChip } from "@/components/ui";
import { loadAcademy, loadLessonState } from "@/lib/queries";
import { LESSONS } from "@/lib/lessons/content";
import { LessonBlock } from "@/components/LessonBlock";
import { formatDay } from "@/lib/schedule/dates";

export default function Page(props: PageProps<"/topic/[id]">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Topic params={props.params} />
    </Suspense>
  );
}

async function Topic({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await loadAcademy();
  const unit = a.units.find((u) => u.topics.some((t) => t.id === id));
  const topic = unit?.topics.find((t) => t.id === id);
  if (!unit || !topic) notFound();
  const subject = a.subjects.find((s) => s.code === unit.subjectCode)!;
  const flat = a.subjects.flatMap((s) => s.units.flatMap((u) => u.topics));
  const i = flat.findIndex((t) => t.id === id);
  const prev = flat[i - 1];
  const next = flat[i + 1];
  const prereqUnits = a.units.filter((u) => unit.prereqs.includes(u.id));
  const siblings = unit.topics.filter((t) => t.id !== id);
  const stars = (n: number) => "●".repeat(n) + "○".repeat(3 - n);
  const lessonState = LESSONS[unit.id] ? await loadLessonState(unit.id, topic.id) : null;

  return (
    <article className="space-y-5">
      <header>
        <Link href="/curriculum" className="inline-flex min-h-11 items-center text-sm font-medium text-accent">← {subject.name}</Link>
        <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight">{topic.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          <StatusChip status={topic.status} />
          <span>{topic.id}</span>
          <span>· {unit.done ? "Done" : unit.date ? `Scheduled ${formatDay(unit.date)}` : "Beyond deadline"}</span>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3">
        <Fact k="Difficulty" v={stars(topic.difficulty)} />
        <Fact k="Interview importance" v={stars(topic.importance)} />
        <Fact k="Estimated time" v={`${topic.estimatedMinutes} min`} />
        <Fact k="Mastery" v={`${topic.masteryScore}%`} />
      </dl>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">What this topic covers</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed">
          {topic.subtopics.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">Learning unit</h2>
        <p className="mt-1 text-base">{unit.title}</p>
        {siblings.length > 0 && <p className="mt-1 text-sm text-muted">Studied together with: {siblings.map((t) => t.name).join(" · ")}</p>}
        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">Prerequisites</h3>
        {prereqUnits.length === 0 ? <p className="mt-1 text-base">None — you can start here.</p> : (
          <ul className="mt-1 space-y-1">
            {prereqUnits.map((p) => (
              <li key={p.id}><Link className="inline-flex min-h-11 items-center text-base text-accent underline-offset-4 hover:underline" href={`/topic/${p.topics[0].id}`}>{p.done ? "✓ " : ""}{p.title}</Link></li>
            ))}
          </ul>
        )}
      </section>

      {lessonState ? (
        <LessonBlock
          lesson={LESSONS[unit.id]}
          topicId={topic.id}
          topicStatus={topic.status}
          lessonRead={lessonState.lessonRead}
          last={lessonState.last}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-line p-5 text-base leading-relaxed text-muted">
          The lesson for this unit is not written yet. A topic can only be marked completed once its lesson is read and its check is passed.
        </section>
      )}

      <nav aria-label="Topics" className="grid grid-cols-2 gap-3">
        {prev ? <Link href={`/topic/${prev.id}`} className="rounded-2xl border border-line bg-card p-4"><span className="text-sm text-muted">← Previous</span><span className="mt-1 block text-base font-medium leading-snug">{prev.name}</span></Link> : <span />}
        {next ? <Link href={`/topic/${next.id}`} className="rounded-2xl border border-line bg-card p-4 text-right"><span className="text-sm text-muted">Next →</span><span className="mt-1 block text-base font-medium leading-snug">{next.name}</span></Link> : <span />}
      </nav>
    </article>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <dt className="text-sm text-muted">{k}</dt>
      <dd className="mt-0.5 text-lg font-medium">{v}</dd>
    </div>
  );
}
