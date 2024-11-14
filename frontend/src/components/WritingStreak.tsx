import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, startOfDay, format, differenceInDays } from 'date-fns';

interface WordEntry {
  id: number;
  word_count: number;
  date: string;
  description: string | null;
}

interface WritingStreakProps {
  entries: WordEntry[];
}

interface HeatmapValue {
  date: Date;
  count: number;
}

export default function WritingStreak({ entries }: WritingStreakProps) {
  const today = new Date();
  const startDate = subDays(today, 365);

  // Process entries into a format suitable for the heatmap
  const entryMap = new Map<string, number>();
  entries.forEach(entry => {
    const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
    entryMap.set(dateStr, (entryMap.get(dateStr) || 0) + entry.word_count);
  });

  // Create values array for the heatmap
  const values: HeatmapValue[] = [];
  let currentDate = startDate;
  while (differenceInDays(today, currentDate) >= 0) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const count = entryMap.get(dateStr) || 0;
    values.push({
      date: currentDate,
      count,
    });
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  // Calculate current streak
  let currentStreak = 0;
  let date = today;
  while (true) {
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    if (!entryMap.has(dateStr)) break;
    currentStreak++;
    date = subDays(date, 1);
  }

  // Calculate longest streak
  let longestStreak = 0;
  let currentRun = 0;
  let previousDate: Date | null = null;

  entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .forEach(entry => {
      const entryDate = startOfDay(new Date(entry.date));
      
      if (previousDate) {
        const dayDiff = differenceInDays(entryDate, previousDate);
        if (dayDiff === 1) {
          currentRun++;
        } else {
          longestStreak = Math.max(longestStreak, currentRun);
          currentRun = 1;
        }
      } else {
        currentRun = 1;
      }
      
      previousDate = entryDate;
    });
  
  longestStreak = Math.max(longestStreak, currentRun);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Writing Streaks</h2>
        <div className="flex gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-xl font-bold text-indigo-600">{currentStreak} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="text-xl font-bold text-indigo-600">{longestStreak} days</p>
          </div>
        </div>
      </div>
      
      <div className="writing-heatmap">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            if (value.count < 500) return 'color-scale-1';
            if (value.count < 1000) return 'color-scale-2';
            if (value.count < 2000) return 'color-scale-3';
            return 'color-scale-4';
          }}
          titleForValue={(value) => {
            if (!value || value.count === 0) return 'No writing';
            return `${value.count} words on ${format(value.date, 'MMM d, yyyy')}`;
          }}
          showWeekdayLabels={true}
        />
      </div>
    </div>
  );
}
