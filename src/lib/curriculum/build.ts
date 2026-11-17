import { CURRICULUM } from "./data";

export type FlatSubject = { code: string; name: string; short: string; position: number };
export type FlatUnit = {
  id: string;
  subjectCode: string;
  title: string;
  position: number;
  difficulty: number;
  importance: number;
  estimatedMinutes: number;
  prereqs: string[];
};
export type FlatTopic = {
  id: string;
  subjectCode: string;
  unitId: string;
  name: string;
  subtopics: string[];
  kind: "concept" | "exercise";
  position: number;
  difficulty: number;
  importance: number;
  estimatedMinutes: number;
};

const pad = (n: number, w: number) => String(n).padStart(w, "0");
const BASE_MINUTES: Record<number, number> = { 1: 25, 2: 33, 3: 42 };

/** Flattens the authored curriculum into rows with stable, position-derived IDs. */
export function buildCurriculum() {
  const subjects: FlatSubject[] = [];
  const units: FlatUnit[] = [];
  const topics: FlatTopic[] = [];

  CURRICULUM.forEach((s, si) => {
    subjects.push({ code: s.code, name: s.name, short: s.short, position: si });
    let topicNo = 0;
    s.units.forEach((un, ui) => {
      const id = `${s.code}-U${pad(ui + 1, 2)}`;
      const prereqs = [...un.after];
      if (ui > 0 && !un.free) prereqs.push(`${s.code}-U${pad(ui, 2)}`);
      const estimatedMinutes = BASE_MINUTES[un.difficulty] + (un.topics.length - 1) * 4;
      units.push({
        id,
        subjectCode: s.code,
        title: un.title,
        position: ui,
        difficulty: un.difficulty,
        importance: un.importance,
        estimatedMinutes,
        prereqs: [...new Set(prereqs)],
      });
      un.topics.forEach((tp) => {
        topicNo += 1;
        topics.push({
          id: `${s.code}-T${pad(topicNo, 3)}`,
          subjectCode: s.code,
          unitId: id,
          name: tp.name,
          subtopics: tp.subtopics,
          kind: tp.kind,
          position: topicNo - 1,
          difficulty: un.difficulty,
          importance: un.importance,
          estimatedMinutes: Math.round(estimatedMinutes / un.topics.length),
        });
      });
    });
  });

  const ids = new Set(units.map((x) => x.id));
  for (const un of units)
    for (const p of un.prereqs) if (!ids.has(p)) throw new Error(`Unit ${un.id} has unknown prerequisite ${p}`);

  return { subjects, units, topics };
}
