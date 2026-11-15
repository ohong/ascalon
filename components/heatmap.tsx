import { dateString, dayNumber, formatDate } from "@/lib/dates";
import { dateTotals, Entry, level } from "@/lib/stats";

export function Heatmap({ entries, today }: { entries: Entry[]; today: string }) {
  const totals = dateTotals(entries);
  const end = dayNumber(today);
  const sunday = end - new Date(end * 86400000).getUTCDay();
  const start = sunday - 52 * 7;
  return (
    <section aria-label="Writing activity" className="space-y-3">
      <h2 className="text-sm font-medium">Activity</h2>
      <div data-testid="heatmap" className="flex flex-row-reverse overflow-x-auto">
        <div className="grid shrink-0 grid-flow-col grid-rows-7 gap-[3px]">
          {Array.from({ length: 53 * 7 }, (_, index) => {
            const day = start + index;
            if (day > end) return <span key={day} className="size-[11px]" />;
            const date = dateString(day);
            const words = totals.get(date) ?? 0;
            return <span key={date} data-date={date} data-level={level(words)} className="heat-cell size-[11px] rounded-[2px]" title={`${words.toLocaleString("en-US")} words on ${formatDate(date, { month: "short", day: "numeric", year: "numeric" })}`} />;
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-[3px] text-[10px] text-neutral-500">
        <span className="mr-1">Less</span>
        {[0, 1, 2, 3, 4].map(value => <span key={value} data-level={value} className="heat-cell size-[11px] rounded-[2px]" />)}
        <span className="ml-1">More</span>
      </div>
    </section>
  );
}
