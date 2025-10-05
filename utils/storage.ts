import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitData, DEFAULT_HABIT_DATA } from '@/types/habit';

const HABIT_DATA_KEY = '@personal_tracker:habit_data';

export class StorageError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Validates habit data structure with detailed checks
 */
export const validateHabitData = (data: any): data is HabitData => {
  if (!data || typeof data !== 'object') return false;

  // Validate basic fields
  if (typeof data.currentStreak !== 'number' || data.currentStreak < 0) return false;
  if (data.streakStartDate !== null && typeof data.streakStartDate !== 'string') return false;
  if (typeof data.bestStreak !== 'number' || data.bestStreak < 0) return false;
  if (!Array.isArray(data.dailyRecords)) return false;
  if (!Array.isArray(data.streakHistory)) return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  if (typeof data.lastUpdated !== 'number') return false;

  // Validate settings
  if (typeof data.settings.allowRetroactive !== 'boolean') return false;
  if (typeof data.settings.gracePeriodHours !== 'number' || data.settings.gracePeriodHours < 0) return false;

  // Validate daily records structure
  for (const record of data.dailyRecords) {
    if (!record || typeof record !== 'object') return false;
    if (typeof record.date !== 'string') return false;
    if (typeof record.successful !== 'boolean') return false;
    if (typeof record.timestamp !== 'number') return false;
  }

  // Validate streak history structure
  for (const streak of data.streakHistory) {
    if (!streak || typeof streak !== 'object') return false;
    if (typeof streak.startDate !== 'string') return false;
    if (typeof streak.endDate !== 'string') return false;
    if (typeof streak.duration !== 'number' || streak.duration <= 0) return false;
    if (streak.endReason !== 'manual_reset' && streak.endReason !== 'unsuccessful_day') return false;
  }

  return true;
};

/**
 * Loads habit data from AsyncStorage with recovery on corruption
 */
export const loadHabitData = async (): Promise<HabitData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABIT_DATA_KEY);

    if (jsonValue === null) {
      // No data exists, return default
      return DEFAULT_HABIT_DATA;
    }

    let data;
    try {
      data = JSON.parse(jsonValue);
    } catch (parseError) {
      // JSON parsing failed - corrupted data
      console.error('Failed to parse habit data, resetting to default');
      await AsyncStorage.removeItem(HABIT_DATA_KEY);
      return DEFAULT_HABIT_DATA;
    }

    if (!validateHabitData(data)) {
      // Data structure is invalid - attempt recovery or reset
      console.error('Invalid habit data structure, resetting to default');
      await AsyncStorage.removeItem(HABIT_DATA_KEY);
      return DEFAULT_HABIT_DATA;
    }

    return data;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(
      'Failed to load habit data',
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Saves habit data to AsyncStorage
 */
export const saveHabitData = async (data: HabitData): Promise<void> => {
  try {
    if (!validateHabitData(data)) {
      throw new StorageError('Invalid habit data structure');
    }

    const updatedData: HabitData = {
      ...data,
      lastUpdated: Date.now(),
    };

    const jsonValue = JSON.stringify(updatedData);
    await AsyncStorage.setItem(HABIT_DATA_KEY, jsonValue);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(
      'Failed to save habit data',
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Clears all habit data from storage
 */
export const clearHabitData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABIT_DATA_KEY);
  } catch (error) {
    throw new StorageError(
      'Failed to clear habit data',
      error instanceof Error ? error : undefined
    );
  }
};

/**
 * Exports habit data as JSON string for backup
 */
export const exportHabitData = async (): Promise<string> => {
  const data = await loadHabitData();
  return JSON.stringify(data, null, 2);
};

/**
 * Imports habit data from JSON string
 */
export const importHabitData = async (jsonString: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonString);

    if (!validateHabitData(data)) {
      throw new StorageError('Invalid habit data format in import');
    }

    await saveHabitData(data);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(
      'Failed to import habit data',
      error instanceof Error ? error : undefined
    );
  }
};
