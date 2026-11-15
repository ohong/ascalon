import { dayNumber } from "./dates";

export type Entry = {
  id: number;
  date: string;
  word_count: number;
  description: string | null;
  created_at: string;
};

export function dateTotals(entries: Entry[]) {
  const totals = new Map<string, number>();
  for (const entry of entries) totals.set(entry.date, (totals.get(entry.date) ?? 0) + entry.word_count);
  return totals;
}

export function stats(entries: Entry[], today: string) {
  const totals = dateTotals(entries);
  const days = [...totals.keys()].map(dayNumber).sort((a, b) => a - b);
  const written = new Set(days);
  let longest = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && days[i] === days[i - 1] + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  let end = dayNumber(today);
  if (!written.has(end)) end--;
  let current = 0;
  while (written.has(end--)) current++;
  return { total: entries.reduce((sum, entry) => sum + entry.word_count, 0), days: days.length, current, longest };
}

export function level(words: number) {
  return words === 0 ? 0 : words < 500 ? 1 : words < 1000 ? 2 : words < 2000 ? 3 : 4;
}
