import { markLessonRead, submitCheck } from "@/app/actions";
import { PASS_MARK, gradeCheck, type Question } from "@/lib/lessons/model";
import type { Lesson } from "@/lib/lessons/model";

type Props = {
  lesson: Lesson;
  topicId: string;
  topicStatus: string;
  lessonRead: boolean;
  last: { score: number; passed: boolean; picked: (number | null)[] } | null;
};

/** The lesson, the mark-as-read step, and this topic's knowledge check. Server-rendered, no client JS needed. */
export function LessonBlock({ lesson, topicId, topicStatus, lessonRead, last }: Props) {
  const questions: Question[] | undefined = lesson.checks[topicId];
  const topicDone = topicStatus === "completed" || topicStatus === "mastered" || topicStatus === "needs_revision";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">The lesson</h2>
          {lessonRead && <span className="text-sm font-medium text-accent">Read ✓</span>}
        </div>
        <p className="mt-2 font-serif text-base leading-relaxed italic text-muted">{lesson.intro}</p>

        {lesson.diagram && (
          <figure className="mt-5 rounded-xl border border-line p-4">
            <div
              className="mx-auto max-w-[520px] [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: lesson.diagram.svg }}
            />
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">{lesson.diagram.caption}</figcaption>
          </figure>
        )}

        {lesson.sections.map((sec) => (
          <div key={sec.heading} className="mt-5">
            <h3 className="font-serif text-xl font-semibold">{sec.heading}</h3>
            <div className="mt-2 space-y-3 text-base leading-relaxed">
              {sec.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        ))}

        <div className="mt-6 rounded-xl bg-accent-soft p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">Keep these in mind</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-relaxed">
            {lesson.takeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {!lessonRead && (
          <form action={markLessonRead.bind(null, lesson.unitId)} className="mt-6">
            <button type="submit" className="min-h-12 w-full rounded-xl bg-accent px-4 text-base font-semibold text-card">
              I have read this lesson
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">Knowledge check</h2>
        {!questions || questions.length === 0 ? (
          <p className="mt-2 text-base text-muted">This topic&apos;s check is not written yet.</p>
        ) : !lessonRead ? (
          <p className="mt-2 text-base text-muted">Read the lesson above to unlock this check. You need {PASS_MARK}% to pass.</p>
        ) : topicDone ? (
          <p className="mt-2 text-base text-accent">This topic is completed. You can review the check below any time.</p>
        ) : (
          <p className="mt-2 text-base text-muted">Answer every question. You need {PASS_MARK}% to pass.</p>
        )}

        {questions && lessonRead && (
          <>
            {last && (
              <p className={`mt-3 rounded-xl p-3 text-base ${last.passed ? "bg-accent-soft text-accent" : "bg-warn-soft text-warn"}`}>
                Your last attempt: {last.score}%. {last.passed ? "Passed." : `Not yet. Review the explanations, then try again.`}
              </p>
            )}
            <form action={submitCheck.bind(null, topicId)} className="mt-4 space-y-6">
              {questions.map((q, i) => (
                <fieldset key={i} className="space-y-2">
                  <legend className="text-base font-medium leading-snug">{i + 1}. {q.prompt}</legend>
                  {q.options.map((opt, j) => (
                    <label key={j} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2 text-base has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
                      <input type="radio" name={`q${i}`} value={j} required className="h-4 w-4 accent-[var(--accent)]" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
              <button type="submit" className="min-h-12 w-full rounded-xl bg-accent px-4 text-base font-semibold text-card">
                Submit check
              </button>
            </form>

            {last && (
              <Review questions={questions} picked={last.picked} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function Review({ questions, picked }: { questions: Question[]; picked: (number | null)[] }) {
  const result = gradeCheck(questions, picked);
  return (
    <details className="mt-5 rounded-xl border border-line p-4">
      <summary className="min-h-11 cursor-pointer text-base font-medium">Review your last answers</summary>
      <ol className="mt-3 space-y-4">
        {questions.map((q, i) => {
          const r = result.results[i];
          return (
            <li key={i} className="text-base leading-relaxed">
              <p className="font-medium">{i + 1}. {r.correct ? "Correct" : "Not quite"}</p>
              <p className="text-muted">Answer: {q.options[q.answer]}</p>
              <p className="text-muted">{q.explanation}</p>
            </li>
          );
        })}
      </ol>
    </details>
  );
}
