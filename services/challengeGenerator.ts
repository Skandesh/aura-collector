import { ACTIVITY_CATEGORIES } from '@/constants/categories';
import {
  ActivityCategory,
  ChallengeDifficulty,
  ChallengeType,
  DailyChallenge,
} from '@/types/activity';

export interface ChallengeGenerationOptions {
  userLevel: number;
  currentStreak: number;
  totalCompletedActivities: number;
  favoriteCategory?: ActivityCategory;
  recentCategories: ActivityCategory[];
  todayCompletedActivities: number;
}

export class ChallengeGenerator {
  private static readonly CHALLENGE_TEMPLATES = {
    category: {
      easy: [
        {
          title: 'Health Focus',
          description: 'Complete 2 health activities today',
          target: 2,
          icon: '💚',
        },
        {
          title: 'Productive Day',
          description: 'Complete 2 productivity activities',
          target: 2,
          icon: '⚡',
        },
        {
          title: 'Social Butterfly',
          description: 'Complete 1 social activity',
          target: 1,
          icon: '👥',
        },
        {
          title: 'Mindful Moment',
          description: 'Complete 2 mindfulness activities',
          target: 2,
          icon: '🧘',
        },
      ],
      medium: [
        {
          title: 'Health Enthusiast',
          description: 'Complete 3 health activities today',
          target: 3,
          icon: '💪',
        },
        {
          title: 'Productivity Powerhouse',
          description: 'Complete 3 productivity tasks',
          target: 3,
          icon: '🚀',
        },
        {
          title: 'Social Connector',
          description: 'Complete 2 social activities',
          target: 2,
          icon: '🤝',
        },
        {
          title: 'Mindful Practice',
          description: 'Complete 3 mindfulness sessions',
          target: 3,
          icon: '🧠',
        },
      ],
      hard: [
        {
          title: 'Health Champion',
          description: 'Complete 4 health activities today',
          target: 4,
          icon: '🏆',
        },
        {
          title: 'Productivity Master',
          description: 'Complete 4 productivity activities',
          target: 4,
          icon: '🎯',
        },
        {
          title: 'Social Networker',
          description: 'Complete 3 social activities',
          target: 3,
          icon: '🌟',
        },
        {
          title: 'Mindfulness Expert',
          description: 'Complete 4 mindfulness sessions',
          target: 4,
          icon: '✨',
        },
      ],
    },
    points: {
      easy: [
        {
          title: 'Point Collector',
          description: 'Earn 50 aura points today',
          target: 50,
          icon: '⭐',
        },
        {
          title: 'Daily Goal',
          description: 'Earn 75 aura points today',
          target: 75,
          icon: '🎯',
        },
      ],
      medium: [
        {
          title: 'Point Hunter',
          description: 'Earn 100 aura points today',
          target: 100,
          icon: '💎',
        },
        {
          title: 'Score Seeker',
          description: 'Earn 150 aura points today',
          target: 150,
          icon: '🏅',
        },
      ],
      hard: [
        {
          title: 'Point Master',
          description: 'Earn 200 aura points today',
          target: 200,
          icon: '👑',
        },
        {
          title: 'High Scorer',
          description: 'Earn 250 aura points today',
          target: 250,
          icon: '🌟',
        },
      ],
    },
    combo: {
      easy: [
        {
          title: 'Double Up',
          description: 'Complete 2 activities in a row',
          target: 2,
          icon: '🔥',
        },
        {
          title: 'Triple Threat',
          description: 'Complete 3 activities in a row',
          target: 3,
          icon: '⚡',
        },
      ],
      medium: [
        {
          title: 'Combo Master',
          description: 'Complete 4 activities in a row',
          target: 4,
          icon: '💥',
        },
        {
          title: 'Streak Builder',
          description: 'Complete 5 activities in a row',
          target: 5,
          icon: '🚀',
        },
      ],
      hard: [
        {
          title: 'Combo Champion',
          description: 'Complete 6 activities in a row',
          target: 6,
          icon: '👑',
        },
        {
          title: 'Unstoppable',
          description: 'Complete 7 activities in a row',
          target: 7,
          icon: '💫',
        },
      ],
    },
    time: {
      easy: [
        {
          title: 'Quick Start',
          description: 'Complete an activity within 30 minutes',
          timeLimit: 30,
          target: 1,
          icon: '⏰',
        },
        {
          title: 'Speed Runner',
          description: 'Complete an activity within 15 minutes',
          timeLimit: 15,
          target: 1,
          icon: '⚡',
        },
      ],
      medium: [
        {
          title: 'Time Challenge',
          description: 'Complete 2 activities within 45 minutes',
          timeLimit: 45,
          target: 2,
          icon: '⏱️',
        },
        {
          title: 'Rapid Fire',
          description: 'Complete 2 activities within 30 minutes',
          timeLimit: 30,
          target: 2,
          icon: '🔥',
        },
      ],
      hard: [
        {
          title: 'Blitz Mode',
          description: 'Complete 3 activities within 60 minutes',
          timeLimit: 60,
          target: 3,
          icon: '💨',
        },
        {
          title: 'Speed Demon',
          description: 'Complete 3 activities within 45 minutes',
          timeLimit: 45,
          target: 3,
          icon: '🚀',
        },
      ],
    },
    variety: {
      easy: [
        {
          title: 'Well Rounded',
          description: 'Try 2 different categories today',
          target: 2,
          icon: '🌈',
        },
        {
          title: 'Explorer',
          description: 'Try 3 different categories today',
          target: 3,
          icon: '🗺️',
        },
      ],
      medium: [
        {
          title: 'Diversified',
          description: 'Try 3 different categories today',
          target: 3,
          icon: '🎨',
        },
        {
          title: 'Renaissance',
          description: 'Try 4 different categories today',
          target: 4,
          icon: '🎭',
        },
      ],
      hard: [
        {
          title: 'Polymath',
          description: 'Try 4 different categories today',
          target: 4,
          icon: '🧠',
        },
        {
          title: 'Universal',
          description: 'Try 5 different categories today',
          target: 5,
          icon: '🌟',
        },
      ],
    },
    streak: {
      easy: [
        {
          title: 'Consistency',
          description: 'Maintain your current streak for 2 more days',
          target: 2,
          icon: '📅',
        },
        {
          title: 'Building Momentum',
          description: 'Maintain your streak for 3 more days',
          target: 3,
          icon: '🔥',
        },
      ],
      medium: [
        {
          title: 'Dedicated',
          description: 'Maintain your streak for 5 more days',
          target: 5,
          icon: '💪',
        },
        {
          title: 'Committed',
          description: 'Maintain your streak for 7 more days',
          target: 7,
          icon: '🎯',
        },
      ],
      hard: [
        {
          title: 'Unbreakable',
          description: 'Maintain your streak for 10 more days',
          target: 10,
          icon: '💎',
        },
        {
          title: 'Legendary',
          description: 'Maintain your streak for 14 more days',
          target: 14,
          icon: '👑',
        },
      ],
    },
  };

  static generateDailyChallenges(
    options: ChallengeGenerationOptions
  ): DailyChallenge[] {
    const challenges: DailyChallenge[] = [];
    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Determine difficulty distribution based on user level
    const difficultyWeights = this.getDifficultyWeights(options.userLevel);

    // Generate 3 challenges per day
    for (let i = 0; i < 3; i++) {
      const challengeType = this.selectChallengeType(options, challenges);
      const difficulty = this.selectDifficulty(difficultyWeights);
      const template = this.getRandomTemplate(challengeType, difficulty);

      let category: ActivityCategory | undefined;
      let target = template.target;

      // Adjust target based on user level and challenge type
      target = this.adjustTargetForUser(template, options);

      // Select category for category-based challenges
      if (challengeType === 'category') {
        category = this.selectCategoryForChallenge(options, template);
      }

      const challenge: DailyChallenge = {
        id: `challenge_${now.getTime()}_${i}`,
        type: challengeType,
        title: template.title,
        description: template.description,
        icon: template.icon,
        target,
        current: 0,
        category,
        timeLimit: template.timeLimit,
        reward: this.calculateReward(
          challengeType,
          difficulty,
          options.userLevel
        ),
        difficulty,
        createdAt: now,
        expiresAt: todayEnd,
        isCompleted: false,
        isExpired: false,
        isClaimed: false,
      };

      challenges.push(challenge);
    }

    return challenges;
  }

  private static getDifficultyWeights(userLevel: number): {
    easy: number;
    medium: number;
    hard: number;
  } {
    if (userLevel <= 5) {
      return { easy: 0.7, medium: 0.25, hard: 0.05 };
    } else if (userLevel <= 15) {
      return { easy: 0.5, medium: 0.4, hard: 0.1 };
    } else {
      return { easy: 0.3, medium: 0.5, hard: 0.2 };
    }
  }

  private static selectChallengeType(
    options: ChallengeGenerationOptions,
    existingChallenges: DailyChallenge[]
  ): ChallengeType {
    const typeWeights: Record<ChallengeType, number> = {
      category: 0.3,
      points: 0.25,
      combo: 0.15,
      time: 0.1,
      variety: 0.1,
      streak: 0.1,
    };

    // Adjust weights based on user preferences and recent activity
    if (options.favoriteCategory) {
      typeWeights.category += 0.1;
      typeWeights.points += 0.05;
    }

    if (options.todayCompletedActivities > 0) {
      typeWeights.combo += 0.1;
      typeWeights.time += 0.05;
    }

    if (options.currentStreak > 3) {
      typeWeights.streak += 0.1;
    }

    // Reduce weight for types already used today
    existingChallenges.forEach((challenge) => {
      typeWeights[challenge.type] *= 0.7;
    });

    const random = Math.random();
    let cumulativeWeight = 0;

    for (const [type, weight] of Object.entries(typeWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        return type as ChallengeType;
      }
    }

    return 'category'; // fallback
  }

  private static selectDifficulty(weights: {
    easy: number;
    medium: number;
    hard: number;
  }): ChallengeDifficulty {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const [difficulty, weight] of Object.entries(weights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        return difficulty as ChallengeDifficulty;
      }
    }

    return 'easy'; // fallback
  }

  private static getRandomTemplate(
    type: ChallengeType,
    difficulty: ChallengeDifficulty
  ) {
    const templates = this.CHALLENGE_TEMPLATES[type][difficulty];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private static adjustTargetForUser(
    template: any,
    options: ChallengeGenerationOptions
  ): number {
    let target = template.target;

    // Scale based on user level
    if (options.userLevel > 10) {
      target = Math.ceil(target * 1.2);
    }

    // Scale based on current streak
    if (options.currentStreak > 7) {
      target = Math.ceil(target * 1.1);
    }

    return Math.min(target, this.getMaxTargetForType(template.type));
  }

  private static getMaxTargetForType(type: ChallengeType): number {
    const maxTargets = {
      category: 6,
      points: 300,
      combo: 8,
      time: 4,
      variety: 6,
      streak: 21,
    };
    return maxTargets[type];
  }

  private static selectCategoryForChallenge(
    options: ChallengeGenerationOptions,
    template: any
  ): ActivityCategory {
    const availableCategories = Object.keys(
      ACTIVITY_CATEGORIES
    ) as ActivityCategory[];

    // Prefer favorite category if available
    if (options.favoriteCategory && Math.random() < 0.6) {
      return options.favoriteCategory;
    }

    // Avoid recently used categories
    const recentCategoryWeight = options.recentCategories.length > 0 ? 0.3 : 1;
    const nonRecentCategories = availableCategories.filter(
      (cat) => !options.recentCategories.includes(cat)
    );

    if (
      nonRecentCategories.length > 0 &&
      Math.random() < recentCategoryWeight
    ) {
      return nonRecentCategories[
        Math.floor(Math.random() * nonRecentCategories.length)
      ];
    }

    return availableCategories[
      Math.floor(Math.random() * availableCategories.length)
    ];
  }

  private static calculateReward(
    type: ChallengeType,
    difficulty: ChallengeDifficulty,
    userLevel: number
  ): { xp: number; streakFreezes?: number; special?: string } {
    let baseXP = 25;

    // Adjust based on difficulty
    switch (difficulty) {
      case 'easy':
        baseXP = 25;
        break;
      case 'medium':
        baseXP = 50;
        break;
      case 'hard':
        baseXP = 100;
        break;
    }

    // Adjust based on user level
    if (userLevel > 20) {
      baseXP = Math.ceil(baseXP * 1.5);
    } else if (userLevel > 10) {
      baseXP = Math.ceil(baseXP * 1.25);
    }

    const reward: { xp: number; streakFreezes?: number; special?: string } = {
      xp: baseXP,
    };

    // Add bonus rewards for harder challenges
    if (difficulty === 'hard') {
      if (Math.random() < 0.3) {
        reward.streakFreezes = 1;
      }
    }

    // Special rewards for certain challenge types
    if (type === 'streak' && difficulty === 'hard') {
      reward.special = 'Streak Freeze Bonus';
    }

    return reward;
  }
}
