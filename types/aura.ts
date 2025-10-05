/**
 * Aura Data Type Definitions
 * Phase 2.0 - Extends existing habit tracking with aura collection system
 */

import { HabitData } from './habit';
import {
  Achievement,
  CategoryStats,
  CompletedTask,
  DailyChallenge,
  Task,
  TaskStats,
} from './task';

/**
 * Main data structure for the Aura Collector app
 * Extends the existing HabitData to preserve user progress during migration
 */
export interface AuraData extends HabitData {
  // === New Aura System Fields ===

  /** Total aura points collected all-time */
  totalAura: number;

  /** Current aura level (1-10) */
  currentLevel: number;

  /** Available aura for spending (if we add a shop system later) */
  availableAura: number;

  /** User's custom tasks */
  customTasks: Task[];

  /** All completed task records */
  completedTasks: CompletedTask[];

  /** Unlocked achievements */
  achievements: Achievement[];

  /** Current daily challenge */
  dailyChallenge: DailyChallenge | null;

  /** Task-specific statistics */
  taskStats: Record<string, TaskStats>; // Key is taskId

  /** Category-specific statistics */
  categoryStats: Record<string, CategoryStats>; // Key is category name

  /** User preferences */
  preferences: AuraPreferences;

  // === Inherited from HabitData ===
  // currentStreak: number
  // streakStartDate: string | null
  // bestStreak: number
  // dailyRecords: DailyRecord[]
  // streakHistory: StreakHistoryEntry[]
  // settings: HabitSettings
  // lastUpdated: number
}

/**
 * User preferences for the aura system
 */
export interface AuraPreferences {
  /** Show animations for aura collection */
  showAnimations: boolean;

  /** Play sound effects */
  soundEffects: boolean;

  /** Enable haptic feedback */
  hapticFeedback: boolean;

  /** Show daily challenges */
  showDailyChallenges: boolean;

  /** Preferred task categories (for filtering) */
  favoriteCategories: string[];

  /** Default task difficulty filter */
  defaultDifficulty?: 'easy' | 'medium' | 'hard' | 'legendary' | 'all';

  /** Enable notifications */
  notificationsEnabled: boolean;

  /** Notification time for daily reminders */
  reminderTime?: string; // Format: "HH:MM"
}

/**
 * Default aura preferences
 */
export const DEFAULT_AURA_PREFERENCES: AuraPreferences = {
  showAnimations: true,
  soundEffects: true,
  hapticFeedback: true,
  showDailyChallenges: true,
  favoriteCategories: [],
  defaultDifficulty: 'all',
  notificationsEnabled: false,
};

/**
 * Default aura data structure
 * Extends DEFAULT_HABIT_DATA from habit.ts
 */
export const DEFAULT_AURA_DATA: Omit<AuraData, keyof HabitData> = {
  totalAura: 0,
  currentLevel: 1,
  availableAura: 0,
  customTasks: [],
  completedTasks: [],
  achievements: [],
  dailyChallenge: null,
  taskStats: {},
  categoryStats: {
    physical: { category: 'physical', tasksCompleted: 0, totalAuraEarned: 0 },
    mental: { category: 'mental', tasksCompleted: 0, totalAuraEarned: 0 },
    social: { category: 'social', tasksCompleted: 0, totalAuraEarned: 0 },
    productivity: {
      category: 'productivity',
      tasksCompleted: 0,
      totalAuraEarned: 0,
    },
    habits: { category: 'habits', tasksCompleted: 0, totalAuraEarned: 0 },
  },
  preferences: DEFAULT_AURA_PREFERENCES,
};

/**
 * Helper type for aura level progress
 */
export interface AuraLevelProgress {
  currentLevel: number;
  currentLevelName: string;
  currentAura: number;
  auraInCurrentLevel: number;
  auraNeededForNextLevel: number;
  progressPercentage: number;
  nextLevelName: string | null;
  color: string;
}

/**
 * Helper type for task completion result
 */
export interface TaskCompletionResult {
  success: boolean;
  auraEarned: number;
  newTotalAura: number;
  leveledUp: boolean;
  newLevel?: number;
  achievementsUnlocked: Achievement[];
  message: string;
}

/**
 * Helper type for statistics summary
 */
export interface AuraStatsSummary {
  totalTasksCompleted: number;
  totalAuraEarned: number;
  currentLevel: number;
  currentStreak: number;
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  favoriteCategory: string;
  mostProductiveDay: string; // ISO date string
  achievementsUnlocked: number;
  totalAchievements: number;
}
