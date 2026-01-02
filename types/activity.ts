export type ActivityCategory =
  | 'health'
  | 'productivity'
  | 'social'
  | 'mindfulness'
  | 'creativity'
  | 'learning'
  | 'adventure'
  | 'self-care';

export interface ActivityCategoryConfig {
  id: ActivityCategory;
  name: string;
  icon: string;
  color: string;
  basePoints: number;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  points: number;
  createdAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  streak?: number;
  emoji?: string;
}

export interface DailyLog {
  date: string;
  activities: Activity[];
  totalPoints: number;
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date string
  streakFreezes: number; // available streak freeze items
  streakHistory: { date: string; completed: boolean }[]; // last 365 days
  level: number;
  completedActivities: number;
  favoriteCategory?: ActivityCategory;
  achievements: Achievement[];
  activeChallenges: DailyChallenge[];
  challengeProgress: ChallengeProgress[];
  completedChallenges: string[]; // IDs of completed challenges
  comboCount: number; // current combo count
  comboStartTime?: Date; // when the current combo started
  lastComboActivityTime?: Date; // time of the last combo activity
  comboCategory?: ActivityCategory; // category of current combo chain
  comboMultiplier: number; // current combo multiplier
  onFireMode: boolean; // whether On Fire mode is active
  onFireStartTime?: Date; // when On Fire mode started
  onFireActivities: number; // activities completed during On Fire mode
  recentActivities: { timestamp: Date; category: ActivityCategory }[]; // last 10 activities for tracking
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: 'points' | 'streak' | 'activities' | 'category';
    value: number;
    category?: ActivityCategory;
  };
}

export type ChallengeType =
  | 'category'
  | 'points'
  | 'combo'
  | 'time'
  | 'variety'
  | 'streak';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  category?: ActivityCategory;
  timeLimit?: number; // minutes for time-based challenges
  reward: {
    xp: number;
    streakFreezes?: number;
    special?: string;
  };
  difficulty: ChallengeDifficulty;
  createdAt: Date;
  expiresAt: Date;
  isCompleted: boolean;
  isExpired: boolean;
  isClaimed: boolean;
}

export interface ChallengeProgress {
  challengeId: string;
  progress: number;
  lastUpdated: Date;
}
