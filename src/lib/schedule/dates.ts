/** All dates are plain "YYYY-MM-DD" strings in the learner's time zone. */
export const toUTC = (d: string) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
export const addDays = (d: string, n: number) => new Date(toUTC(d) + n * 86400000).toISOString().slice(0, 10);
/** Whole days from a to b (b - a). */
export const diffDays = (a: string, b: string) => Math.round((toUTC(b) - toUTC(a)) / 86400000);
export const maxDate = (a: string, b: string) => (a > b ? a : b);
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export function formatDay(d: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(new Date(toUTC(d)));
}
