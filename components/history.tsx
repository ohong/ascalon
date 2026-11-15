import { formatDate } from "@/lib/dates";
import { Entry } from "@/lib/stats";

export function History({ entries }: { entries: Entry[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">History</h2>
      <ul data-testid="history" className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {entries.map(entry => (
          <li key={entry.id} data-testid="history-item" className="py-4">
            <div className="flex justify-between gap-4 text-sm">
              <time dateTime={entry.date}>{formatDate(entry.date, { weekday: "short", month: "short", day: "numeric" })}</time>
              <span className="tabular-nums">{entry.word_count.toLocaleString("en-US")} words</span>
            </div>
            {entry.description && <p className="mt-1 break-words text-sm text-neutral-500 dark:text-neutral-400">{entry.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
