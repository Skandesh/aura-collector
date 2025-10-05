/**
 * Task Type Definitions for Aura Collector
 * Phase 2.0 - New type definitions for the task system
 */

export type TaskCategory =
  | 'physical'
  | 'mental'
  | 'social'
  | 'productivity'
  | 'habits';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type TaskFrequency = 'daily' | 'weekly' | 'once' | 'anytime';

/**
 * Represents a task that can be completed to earn aura points
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  auraPoints: number;
  icon: string;
  isCustom: boolean;
  frequency?: TaskFrequency;
  requiredLevel?: number; // Minimum aura level required to unlock
  createdAt: number; // timestamp
}

/**
 * Represents a completed task instance
 */
export interface CompletedTask {
  id: string; // Unique completion ID
  taskId: string; // Reference to the Task
  completedAt: number; // timestamp
  auraEarned: number;
  streakDay?: number; // If part of a streak
  notes?: string; // Optional user notes
}

/**
 * Aura level definition
 */
export interface AuraLevel {
  level: number;
  name: string;
  minAura: number;
  maxAura: number;
  color: string;
  description?: string;
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: number | null; // null if not yet unlocked
  condition: AchievementCondition;
}

/**
 * Defines what triggers an achievement
 */
export interface AchievementCondition {
  type:
    | 'task_count'
    | 'streak'
    | 'aura_total'
    | 'level'
    | 'category_count'
    | 'custom';
  target: number; // Required count/level
  category?: TaskCategory; // For category-specific achievements
  customCheck?: (data: any) => boolean; // For complex conditions
}

/**
 * Daily challenge - special tasks that rotate
 */
export interface DailyChallenge {
  id: string;
  date: string; // ISO date string
  tasks: string[]; // Task IDs
  bonusMultiplier: number; // e.g., 1.5x aura for completing all
  completed: boolean;
}

/**
 * Task statistics
 */
export interface TaskStats {
  taskId: string;
  timesCompleted: number;
  totalAuraEarned: number;
  lastCompletedAt: number | null;
  averageCompletionTime?: number; // in minutes
  currentStreak: number;
  bestStreak: number;
}

/**
 * Category statistics
 */
export interface CategoryStats {
  category: TaskCategory;
  tasksCompleted: number;
  totalAuraEarned: number;
  favoriteTask?: string; // Task ID of most completed task
}

/**
 * Helper type for task creation
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;

/**
 * Default task template
 */
export const DEFAULT_TASK: Omit<Task, 'id'> = {
  title: '',
  description: '',
  category: 'habits',
  difficulty: 'easy',
  auraPoints: 10,
  icon: '⭐',
  isCustom: true,
  frequency: 'anytime',
  createdAt: Date.now(),
};
