import { EXPECTATIONS, OPPORTUNITIES, RESUME, SKILL_GAPS, skillPostingCount, type Opportunity } from "@/lib/careers/data";

export const metadata = { title: "Career · Engineering Academy" };

type Verdict = "match" | "check" | "fails";

function verdict(o: Opportunity): { level: Verdict; reasons: string[] } {
  const reasons: string[] = [];
  let failed = false;
  let unknown = false;

  if (o.minYears === null) unknown = true;
  else if (o.minYears > EXPECTATIONS.maxRequiredYears) { failed = true; reasons.push(`Asks for ${o.minYears}+ years, above ${EXPECTATIONS.maxRequiredYears}`); }

  if (o.headcount === null) unknown = true;
  else if (o.headcount < EXPECTATIONS.minHeadcount) { failed = true; reasons.push(`Headcount ${o.headcountLabel}, under ${EXPECTATIONS.minHeadcount}`); }

  if (o.yearlyLpa === null) unknown = true;
  else if (o.yearlyLpa < EXPECTATIONS.minYearlyLpa) { failed = true; reasons.push(`Pay ${o.payLabel}, under ₹80k a month`); }

  if (failed) return { level: "fails", reasons };
  if (unknown) return { level: "check", reasons: ["Headcount or pay not listed. Confirm before applying."] };
  return { level: "match", reasons: [] };
}

const GROUPS: { level: Verdict; title: string; note: string }[] = [
  { level: "match", title: "Meets your filters", note: "200+ employees and pay at or above ₹80k a month." },
  { level: "check", title: "Needs checking", note: "Headcount or pay isn't listed. Ask the recruiter before you invest time." },
  { level: "fails", title: "Doesn't meet your filters", note: "Kept for reference, so you can see why it was ruled out." },
];

export default function Page() {
  const rows = OPPORTUNITIES.map((o) => ({ o, ...verdict(o) }));
  const lastUpdated = OPPORTUNITIES.reduce((latest, o) => (o.addedOn > latest ? o.addedOn : latest), "");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted">Career tracker</p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Opportunities</h1>
        <p className="mt-1 text-muted">{OPPORTUNITIES.length} listings · last added {lastUpdated}</p>
      </header>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-xl font-semibold">My expectations</h2>
        <ul className="mt-3 space-y-2 text-base leading-relaxed">
          <li>Roles: {EXPECTATIONS.roles.join(", ")}</li>
          <li>Minimum pay: ₹{EXPECTATIONS.minMonthlyPay.toLocaleString("en-IN")} a month (about {EXPECTATIONS.minYearlyLpa} LPA). Target {EXPECTATIONS.targetLpa}.</li>
          <li>Company size: {EXPECTATIONS.minHeadcount}+ people.</li>
          <li>Locations: {EXPECTATIONS.locations.join(", ")}. No relocation.</li>
          <li>Deadline: new role by {EXPECTATIONS.deadline}. {EXPECTATIONS.rule}</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-xl font-semibold">My resume</h2>
        <p className="mt-1 text-muted">{RESUME.headline}</p>
        <ul className="mt-3 space-y-2">
          {RESUME.experience.map((e) => (
            <li key={e.org} className="text-base">
              <span className="font-medium">{e.role}</span> · {e.org} <span className="text-muted">({e.period})</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">{RESUME.education}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RESUME.skills.map((s) => (
            <span key={s} className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">{s}</span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold">Skills to learn</h2>
        <p className="mb-3 text-sm text-muted">Gaps between what postings ask for and what your resume shows. The curriculum column shows where Engineering Academy already covers it.</p>
        <ul className="space-y-3">
          {SKILL_GAPS.filter((g) => !g.onResume).map((g) => (
            <li key={g.skill} className="rounded-2xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{g.skill}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${g.inCurriculum ? "bg-accent-soft text-accent" : "bg-warn-soft text-warn"}`}>
                  {g.inCurriculum ? "In curriculum" : "Not in curriculum"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{skillPostingCount(g.match)} of {OPPORTUNITIES.length} listings · {g.why}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Already on your resume: {SKILL_GAPS.filter((g) => g.onResume).map((g) => g.skill).join(", ")}.</p>
      </section>

      {GROUPS.map((group) => {
        const items = rows.filter((r) => r.level === group.level);
        if (items.length === 0) return null;
        return (
          <section key={group.level}>
            <h2 className="text-xl font-semibold">{group.title} <span className="text-base font-normal text-muted">({items.length})</span></h2>
            <p className="mb-3 text-sm text-muted">{group.note}</p>
            <ul className="space-y-3">
              {items.map(({ o, reasons }) => (
                <li key={o.id} className="rounded-2xl border border-line bg-card p-4">
                  <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold leading-snug underline-offset-4 hover:underline">
                    {o.title}
                  </a>
                  <p className="mt-1 text-base">{o.company} · {o.location}</p>
                  <p className="mt-1 text-sm text-muted">Posted {o.posted} · Added {o.addedOn} · Experience: {o.experience}</p>
                  <p className="mt-1 text-sm text-muted">Headcount: {o.headcountLabel} · Pay: {o.payLabel}</p>
                  {reasons.length > 0 && <p className="mt-2 text-sm text-warn">{reasons.join(". ")}.</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {o.skills.map((s) => (
                      <span key={s} className="rounded-full bg-line/60 px-2.5 py-1 text-xs text-muted">{s}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
