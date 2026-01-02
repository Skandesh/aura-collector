import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, UserStats, DailyLog } from '@/types/activity';

const STORAGE_KEYS = {
  ACTIVITIES: '@aura_collector_activities',
  USER_STATS: '@aura_collector_stats',
  DAILY_LOGS: '@aura_collector_daily_logs',
};

export class StorageService {
  static async saveActivities(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }

  static async getActivities(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  static async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  static async getUserStats(): Promise<UserStats | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user stats:', error);
      return null;
    }
  }

  static async saveDailyLog(log: DailyLog): Promise<void> {
    try {
      const logs = await this.getDailyLogs();
      const existingIndex = logs.findIndex(l => l.date === log.date);

      if (existingIndex >= 0) {
        logs[existingIndex] = log;
      } else {
        logs.push(log);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving daily log:', error);
    }
  }

  static async getDailyLogs(): Promise<DailyLog[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading daily logs:', error);
      return [];
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACTIVITIES,
        STORAGE_KEYS.USER_STATS,
        STORAGE_KEYS.DAILY_LOGS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
