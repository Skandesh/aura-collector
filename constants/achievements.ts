/**
 * Achievement Definitions
 * Unlockable achievements for reaching milestones
 */

import { Achievement } from '@/types/task';

export const ACHIEVEMENTS: Achievement[] = [
  // ===== BEGINNER ACHIEVEMENTS =====
  {
    id: 'first_task',
    title: 'First Step',
    description: 'Complete your very first task',
    icon: '🌟',
    category: 'beginner',
    unlockedAt: null,
    condition: {
      type: 'task_count',
      target: 1,
    },
  },
  {
    id: 'tasks_10',
    title: 'Getting Started',
    description: 'Complete 10 tasks',
    icon: '⭐',
    category: 'beginner',
    unlockedAt: null,
    condition: {
      type: 'task_count',
      target: 10,
    },
  },
  {
    id: 'tasks_25',
    title: 'Momentum Builder',
    description: 'Complete 25 tasks',
    icon: '🌠',
    category: 'beginner',
    unlockedAt: null,
    condition: {
      type: 'task_count',
      target: 25,
    },
  },

  // ===== STREAK ACHIEVEMENTS =====
  {
    id: 'streak_3',
    title: 'Three in a Row',
    description: 'Complete tasks 3 days in a row',
    icon: '🔥',
    category: 'streaks',
    unlockedAt: null,
    condition: {
      type: 'streak',
      target: 3,
    },
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Complete tasks 7 days in a row',
    icon: '🔥',
    category: 'streaks',
    unlockedAt: null,
    condition: {
      type: 'streak',
      target: 7,
    },
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Complete tasks 30 days in a row',
    icon: '🔥',
    category: 'streaks',
    unlockedAt: null,
    condition: {
      type: 'streak',
      target: 30,
    },
  },
  {
    id: 'streak_100',
    title: 'Century of Discipline',
    description: 'Complete tasks 100 days in a row',
    icon: '💯',
    category: 'streaks',
    unlockedAt: null,
    condition: {
      type: 'streak',
      target: 100,
    },
  },

  // ===== AURA LEVEL ACHIEVEMENTS =====
  {
    id: 'level_2',
    title: 'Awakened',
    description: 'Reach Aura Level 2',
    icon: '✨',
    category: 'levels',
    unlockedAt: null,
    condition: {
      type: 'level',
      target: 2,
    },
  },
  {
    id: 'level_5',
    title: 'Steady Aura',
    description: 'Reach Aura Level 5',
    icon: '💫',
    category: 'levels',
    unlockedAt: null,
    condition: {
      type: 'level',
      target: 5,
    },
  },
  {
    id: 'level_7',
    title: 'Blazing Spirit',
    description: 'Reach Aura Level 7',
    icon: '🔥',
    category: 'levels',
    unlockedAt: null,
    condition: {
      type: 'level',
      target: 7,
    },
  },
  {
    id: 'level_10',
    title: 'Living Legend',
    description: 'Reach Legendary status (Level 10)',
    icon: '👑',
    category: 'levels',
    unlockedAt: null,
    condition: {
      type: 'level',
      target: 10,
    },
  },

  // ===== AURA TOTAL ACHIEVEMENTS =====
  {
    id: 'aura_500',
    title: 'Aura Collector',
    description: 'Collect 500 total aura points',
    icon: '💎',
    category: 'aura',
    unlockedAt: null,
    condition: {
      type: 'aura_total',
      target: 500,
    },
  },
  {
    id: 'aura_1000',
    title: 'Aura Hoarder',
    description: 'Collect 1,000 total aura points',
    icon: '💰',
    category: 'aura',
    unlockedAt: null,
    condition: {
      type: 'aura_total',
      target: 1000,
    },
  },
  {
    id: 'aura_5000',
    title: 'Aura Master',
    description: 'Collect 5,000 total aura points',
    icon: '⚜️',
    category: 'aura',
    unlockedAt: null,
    condition: {
      type: 'aura_total',
      target: 5000,
    },
  },
  {
    id: 'aura_10000',
    title: 'Aura Legend',
    description: 'Collect 10,000 total aura points',
    icon: '🏆',
    category: 'aura',
    unlockedAt: null,
    condition: {
      type: 'aura_total',
      target: 10000,
    },
  },

  // ===== PHYSICAL ACHIEVEMENTS =====
  {
    id: 'physical_10',
    title: 'Physical Foundation',
    description: 'Complete 10 physical tasks',
    icon: '💪',
    category: 'physical',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 10,
      category: 'physical',
    },
  },
  {
    id: 'physical_30',
    title: 'Gym Rat',
    description: 'Complete 30 physical tasks',
    icon: '🏋️',
    category: 'physical',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 30,
      category: 'physical',
    },
  },
  {
    id: 'physical_100',
    title: 'Fitness Fanatic',
    description: 'Complete 100 physical tasks',
    icon: '💯',
    category: 'physical',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 100,
      category: 'physical',
    },
  },

  // ===== MENTAL ACHIEVEMENTS =====
  {
    id: 'mental_10',
    title: 'Mental Clarity',
    description: 'Complete 10 mental tasks',
    icon: '🧠',
    category: 'mental',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 10,
      category: 'mental',
    },
  },
  {
    id: 'mental_30',
    title: 'Scholar',
    description: 'Complete 30 mental tasks',
    icon: '📚',
    category: 'mental',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 30,
      category: 'mental',
    },
  },
  {
    id: 'mental_100',
    title: 'Sage',
    description: 'Complete 100 mental tasks',
    icon: '🎓',
    category: 'mental',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 100,
      category: 'mental',
    },
  },

  // ===== SOCIAL ACHIEVEMENTS =====
  {
    id: 'social_10',
    title: 'Social Starter',
    description: 'Complete 10 social tasks',
    icon: '👋',
    category: 'social',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 10,
      category: 'social',
    },
  },
  {
    id: 'social_20',
    title: 'Social Butterfly',
    description: 'Complete 20 social tasks',
    icon: '🦋',
    category: 'social',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 20,
      category: 'social',
    },
  },
  {
    id: 'social_50',
    title: 'People Person',
    description: 'Complete 50 social tasks',
    icon: '🤝',
    category: 'social',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 50,
      category: 'social',
    },
  },

  // ===== PRODUCTIVITY ACHIEVEMENTS =====
  {
    id: 'productivity_10',
    title: 'Getting Things Done',
    description: 'Complete 10 productivity tasks',
    icon: '✅',
    category: 'productivity',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 10,
      category: 'productivity',
    },
  },
  {
    id: 'productivity_50',
    title: 'Productivity Master',
    description: 'Complete 50 productivity tasks',
    icon: '⚡',
    category: 'productivity',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 50,
      category: 'productivity',
    },
  },
  {
    id: 'productivity_100',
    title: 'Efficiency Expert',
    description: 'Complete 100 productivity tasks',
    icon: '🚀',
    category: 'productivity',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 100,
      category: 'productivity',
    },
  },

  // ===== HABIT ACHIEVEMENTS =====
  {
    id: 'habits_10',
    title: 'Habit Builder',
    description: 'Complete 10 habit tasks',
    icon: '🌱',
    category: 'habits',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 10,
      category: 'habits',
    },
  },
  {
    id: 'habits_30',
    title: 'Creature of Good Habits',
    description: 'Complete 30 habit tasks',
    icon: '🌿',
    category: 'habits',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 30,
      category: 'habits',
    },
  },
  {
    id: 'habits_100',
    title: 'Discipline Incarnate',
    description: 'Complete 100 habit tasks',
    icon: '🌳',
    category: 'habits',
    unlockedAt: null,
    condition: {
      type: 'category_count',
      target: 100,
      category: 'habits',
    },
  },

  // ===== SPECIAL ACHIEVEMENTS =====
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Wake up before 6 AM for 7 consecutive days',
    icon: '🌅',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'night_owl_reformed',
    title: 'Night Owl Reformed',
    description: 'Sleep before 11 PM for 7 consecutive days',
    icon: '🦉',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'meditation_master',
    title: 'Meditation Master',
    description: 'Meditate for 30 consecutive days',
    icon: '🧘',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'fitness_freak',
    title: 'Fitness Freak',
    description: 'Work out every day for 30 days',
    icon: '💪',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'digital_minimalist',
    title: 'Digital Minimalist',
    description: 'Complete 7 "No Social Media" days',
    icon: '📵',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'well_rounded',
    title: 'Well-Rounded',
    description: 'Complete at least 10 tasks in every category',
    icon: '🎯',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: 'Complete 10 tasks in a single day',
    icon: '🌟',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Maintain a 365-day streak',
    icon: '👑',
    category: 'special',
    unlockedAt: null,
    condition: {
      type: 'streak',
      target: 365,
    },
  },

  // ===== LEGACY ACHIEVEMENTS (for migrating users) =====
  {
    id: 'legacy_veteran',
    title: 'Veteran',
    description: 'You were here from the beginning',
    icon: '🏅',
    category: 'legacy',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'legacy_streak',
    title: 'Legacy Streak',
    description: 'Preserved your original streak during migration',
    icon: '🔥',
    category: 'legacy',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
  {
    id: 'legacy_peak',
    title: 'Peak Discipline',
    description: 'Honored for your best streak before the transition',
    icon: '⛰️',
    category: 'legacy',
    unlockedAt: null,
    condition: {
      type: 'custom',
      target: 1,
    },
  },
];

/**
 * Get achievements by category
 */
export const getAchievementsByCategory = (category: string): Achievement[] => {
  return ACHIEVEMENTS.filter(
    (achievement) => achievement.category === category
  );
};

/**
 * Get unlocked achievements
 */
export const getUnlockedAchievements = (
  achievements: Achievement[]
): Achievement[] => {
  return achievements.filter((a) => a.unlockedAt !== null);
};

/**
 * Get locked achievements
 */
export const getLockedAchievements = (
  achievements: Achievement[]
): Achievement[] => {
  return achievements.filter((a) => a.unlockedAt === null);
};

/**
 * Calculate achievement progress percentage
 */
export const calculateAchievementProgress = (): number => {
  // This will be implemented in the context when we have actual data
  return 0;
};
