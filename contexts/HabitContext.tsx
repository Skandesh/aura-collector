import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HabitData, DEFAULT_HABIT_DATA, DailyRecord, StreakHistoryEntry } from '@/types/habit';
import { loadHabitData, saveHabitData, StorageError } from '@/utils/storage';
import { canMarkDate, toISODateString } from '@/utils/dateHelpers';

interface HabitContextType {
  habitData: HabitData;
  loading: boolean;
  error: string | null;
  markDaySuccessful: (date: Date) => Promise<void>;
  markDayUnsuccessful: (date: Date) => Promise<void>;
  resetStreak: (manual: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habitData, setHabitData] = useState<HabitData>(DEFAULT_HABIT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const data = await loadHabitData();
        setHabitData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Save data whenever it changes
  const persistData = useCallback(async (data: HabitData) => {
    try {
      await saveHabitData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
      throw err;
    }
  }, []);

  // Calculate current streak from daily records
  const calculateCurrentStreak = useCallback((records: DailyRecord[]): number => {
    if (records.length === 0) return 0;

    // Sort records by date descending
    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedRecords.length; i++) {
      const record = sortedRecords[i];
      if (!record.successful) break;

      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      // Check if this record is consecutive
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (recordDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // Get streak start date
  const getStreakStartDate = useCallback((records: DailyRecord[], streakLength: number): string | null => {
    if (streakLength === 0) return null;

    const sortedRecords = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const successfulRecords = sortedRecords.filter(r => r.successful).slice(0, streakLength);
    if (successfulRecords.length === 0) return null;

    return successfulRecords[successfulRecords.length - 1].date;
  }, []);

  const markDaySuccessful = useCallback(async (date: Date) => {
    // Validate date
    const validation = canMarkDate(date, habitData.settings.gracePeriodHours);
    if (!validation.isValid) {
      throw new Error(validation.reason || 'Invalid date');
    }

    const dateString = toISODateString(date);

    setHabitData(prevData => {
      // Check if record already exists
      const existingIndex = prevData.dailyRecords.findIndex(r => r.date === dateString);
      let newRecords: DailyRecord[];

      if (existingIndex >= 0) {
        // Update existing record
        newRecords = [...prevData.dailyRecords];
        newRecords[existingIndex] = {
          date: dateString,
          successful: true,
          timestamp: Date.now(),
        };
      } else {
        // Add new record
        newRecords = [
          ...prevData.dailyRecords,
          {
            date: dateString,
            successful: true,
            timestamp: Date.now(),
          },
        ];
      }

      const newStreak = calculateCurrentStreak(newRecords);
      const newStreakStartDate = getStreakStartDate(newRecords, newStreak);
      const newBestStreak = Math.max(prevData.bestStreak, newStreak);

      const updatedData: HabitData = {
        ...prevData,
        dailyRecords: newRecords,
        currentStreak: newStreak,
        streakStartDate: newStreakStartDate,
        bestStreak: newBestStreak,
      };

      persistData(updatedData);
      return updatedData;
    });
  }, [calculateCurrentStreak, getStreakStartDate, persistData, habitData.settings.gracePeriodHours]);

  const markDayUnsuccessful = useCallback(async (date: Date) => {
    // Validate date
    const validation = canMarkDate(date, habitData.settings.gracePeriodHours);
    if (!validation.isValid) {
      throw new Error(validation.reason || 'Invalid date');
    }

    const dateString = toISODateString(date);

    setHabitData(prevData => {
      // Check if record already exists
      const existingIndex = prevData.dailyRecords.findIndex(r => r.date === dateString);
      let newRecords: DailyRecord[];

      if (existingIndex >= 0) {
        // Update existing record
        newRecords = [...prevData.dailyRecords];
        newRecords[existingIndex] = {
          date: dateString,
          successful: false,
          timestamp: Date.now(),
        };
      } else {
        // Add new record
        newRecords = [
          ...prevData.dailyRecords,
          {
            date: dateString,
            successful: false,
            timestamp: Date.now(),
          },
        ];
      }

      // Save current streak to history if it exists
      let newStreakHistory = prevData.streakHistory;
      if (prevData.currentStreak > 0 && prevData.streakStartDate) {
        const historyEntry: StreakHistoryEntry = {
          startDate: prevData.streakStartDate,
          endDate: dateString,
          duration: prevData.currentStreak,
          endReason: 'unsuccessful_day',
        };
        newStreakHistory = [...prevData.streakHistory, historyEntry];
      }

      const updatedData: HabitData = {
        ...prevData,
        dailyRecords: newRecords,
        currentStreak: 0,
        streakStartDate: null,
        streakHistory: newStreakHistory,
      };

      persistData(updatedData);
      return updatedData;
    });
  }, [persistData, habitData.settings.gracePeriodHours]);

  const resetStreak = useCallback(async (manual: boolean = true) => {
    setHabitData(prevData => {
      // Save current streak to history if it exists
      let newStreakHistory = prevData.streakHistory;
      if (prevData.currentStreak > 0 && prevData.streakStartDate) {
        const today = new Date().toISOString().split('T')[0];
        const historyEntry: StreakHistoryEntry = {
          startDate: prevData.streakStartDate,
          endDate: today,
          duration: prevData.currentStreak,
          endReason: manual ? 'manual_reset' : 'unsuccessful_day',
        };
        newStreakHistory = [...prevData.streakHistory, historyEntry];
      }

      const updatedData: HabitData = {
        ...prevData,
        currentStreak: 0,
        streakStartDate: null,
        streakHistory: newStreakHistory,
      };

      persistData(updatedData);
      return updatedData;
    });
  }, [persistData]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loadHabitData();
      setHabitData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: HabitContextType = {
    habitData,
    loading,
    error,
    markDaySuccessful,
    markDayUnsuccessful,
    resetStreak,
    refreshData,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabit = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
