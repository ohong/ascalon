import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, startOfDay, format, differenceInDays } from 'date-fns';
import { useMemo } from 'react';

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

  const entryMap = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
      map.set(dateStr, (map.get(dateStr) || 0) + entry.word_count);
    });
    return map;
  }, [entries]);

  const values = useMemo((): HeatmapValue[] => {
    const result: HeatmapValue[] = [];
    const totalDays = differenceInDays(today, startDate) + 1;
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const count = entryMap.get(dateStr) || 0;
      
      result.push({
        date: new Date(currentDate),
        count,
      });
    }
    
    return result;
  }, [entryMap, today, startDate]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    let date = new Date(today);
    
    while (true) {
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
      if (!entryMap.has(dateStr)) break;
      streak++;
      date = subDays(date, 1);
    }
    
    return streak;
  }, [entryMap, today]);

  const longestStreak = useMemo(() => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let maxStreak = 0;
    let currentRun = 0;
    let previousDate: Date | null = null;

    sortedEntries.forEach(entry => {
      const entryDate = startOfDay(new Date(entry.date));
      
      if (previousDate) {
        const dayDiff = differenceInDays(entryDate, previousDate);
        if (dayDiff === 1) {
          currentRun++;
        } else {
          maxStreak = Math.max(maxStreak, currentRun);
          currentRun = 1;
        }
      } else {
        currentRun = 1;
      }
      
      previousDate = entryDate;
    });
    
    return Math.max(maxStreak, currentRun);
  }, [entries]);

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
