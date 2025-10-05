export interface DailyRecord {
  date: string; // ISO date string
  successful: boolean;
  timestamp: number;
}

export interface StreakHistoryEntry {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  duration: number; // days
  endReason: 'manual_reset' | 'unsuccessful_day';
}

export interface HabitSettings {
  allowRetroactive: boolean;
  gracePeriodHours: number;
}

export interface HabitData {
  currentStreak: number;
  streakStartDate: string | null; // ISO date string
  bestStreak: number;
  dailyRecords: DailyRecord[];
  streakHistory: StreakHistoryEntry[];
  settings: HabitSettings;
  lastUpdated: number;
}

export const DEFAULT_HABIT_DATA: HabitData = {
  currentStreak: 0,
  streakStartDate: null,
  bestStreak: 0,
  dailyRecords: [],
  streakHistory: [],
  settings: {
    allowRetroactive: true,
    gracePeriodHours: 24,
  },
  lastUpdated: Date.now(),
};
