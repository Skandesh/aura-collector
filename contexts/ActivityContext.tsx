import { useScreenShake } from '@/components/ScreenShakeManager';
import { ACHIEVEMENTS, ACTIVITY_CATEGORIES } from '@/constants/categories';
import { ChallengeGenerator } from '@/services/challengeGenerator';
import { HapticService } from '@/services/hapticService';
import { StorageService } from '@/services/storage';
import {
  Achievement,
  Activity,
  ActivityCategory,
  DailyChallenge,
  UserStats,
} from '@/types/activity';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import uuid from 'react-native-uuid';

interface ActivityContextType {
  activities: Activity[];
  userStats: UserStats;
  todayActivities: Activity[];
  addActivity: (
    title: string,
    category: ActivityCategory,
    description?: string,
    emoji?: string
  ) => Promise<void>;
  toggleActivity: (
    id: string,
    onNotification?: (
      message: string,
      type: 'challenge' | 'milestone' | 'completed'
    ) => void
  ) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  getTotalAuraPoints: () => number;
  getTodayAuraPoints: () => number;
  refreshData: () => Promise<void>;
  getStreakMultiplier: (streak: number) => number;
  calculatePointsWithMultiplier: (
    basePoints: number,
    categoryMultiplier?: number
  ) => number;
  // Challenge-related methods
  generateDailyChallenges: () => Promise<void>;
  updateChallengeProgress: (
    challengeId: string,
    progress: number
  ) => Promise<void>;
  claimChallengeReward: (challengeId: string) => Promise<void>;
  getActiveChallenges: () => DailyChallenge[];
  getCompletedChallenges: () => DailyChallenge[];
  getChallengeProgress: (challengeId: string) => number;
  getChallengeNotifications: () => {
    challengeId: string;
    message: string;
    type: 'progress' | 'milestone' | 'completed';
  }[];
  // Combo-related methods
  getComboMultiplier: () => number;
  updateCombo: (activity: Activity) => {
    newComboCount: number;
    newComboMultiplier: number;
    isNewCombo: boolean;
    isCategoryBonus: boolean;
  };
  resetCombo: () => void;
  // On Fire mode methods
  getOnFireMultiplier: () => number;
  checkOnFireMode: (activity: Activity) => {
    shouldActivate: boolean;
    shouldDeactivate: boolean;
    onFireMultiplier: number;
  };
  activateOnFireMode: () => void;
  deactivateOnFireMode: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    streakFreezes: 3, // Start with 3 free freezes
    streakHistory: [],
    level: 1,
    completedActivities: 0,
    achievements: [],
    activeChallenges: [],
    challengeProgress: [],
    completedChallenges: [],
    comboCount: 0,
    comboStartTime: undefined,
    lastComboActivityTime: undefined,
    comboCategory: undefined,
    comboMultiplier: 1.0,
    onFireMode: false,
    onFireStartTime: undefined,
    onFireActivities: 0,
    recentActivities: [],
  });

  // Track recent challenge notifications to avoid spam
  const [recentNotifications, setRecentNotifications] = useState<Set<string>>(
    new Set()
  );

  // Screen shake functionality
  const { triggerShake } = useScreenShake();

  useEffect(() => {
    loadData();
    generateDailyChallenges();
  }, []);

  const calculateCurrentStreak = (
    activities: Activity[],
    lastDate: string
  ): number => {
    if (activities.length === 0) return 0;

    const today = getDateString(new Date());
    const todayActivities = activities.filter((activity) => {
      const activityDate = getDateString(new Date(activity.createdAt));
      return activityDate === today;
    });

    // If no activities today, check if streak should continue
    if (todayActivities.length === 0) {
      if (!lastDate) return 0;

      const daysDiff = Math.floor(
        (new Date().getTime() - new Date(lastDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysDiff <= 1) {
        return userStats.currentStreak;
      } else if (daysDiff > 1 && userStats.streakFreezes > 0) {
        return userStats.currentStreak;
      } else {
        return 0;
      }
    }

    return userStats.currentStreak;
  };

  const loadData = async () => {
    const loadedActivities = await StorageService.getActivities();
    const loadedStats = await StorageService.getUserStats();

    setActivities(loadedActivities);
    if (loadedStats) {
      // Calculate current streak based on activities and last date
      const calculatedStreak = calculateCurrentStreak(
        loadedActivities,
        loadedStats.lastActivityDate
      );
      const updatedStats = {
        ...loadedStats,
        currentStreak: calculatedStreak,
        longestStreak: Math.max(loadedStats.longestStreak, calculatedStreak),
      };
      setUserStats(updatedStats);
      // Save the corrected stats
      await StorageService.saveUserStats(updatedStats);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getLocalMidnight = (date: Date = new Date()) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    return localDate;
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Challenge management functions
  const generateDailyChallenges = async () => {
    const today = getTodayDate();
    const lastChallengeGeneration =
      userStats.activeChallenges.length > 0
        ? getDateString(new Date(userStats.activeChallenges[0].createdAt))
        : '';

    // Only generate new challenges if none exist or they're from a previous day
    if (lastChallengeGeneration !== today) {
      const recentCategories = todayActivities.map((a) => a.category);
      const favoriteCategory = userStats.favoriteCategory;

      const options = {
        userLevel: userStats.level,
        currentStreak: userStats.currentStreak,
        totalCompletedActivities: userStats.completedActivities,
        favoriteCategory,
        recentCategories,
        todayCompletedActivities: todayActivities.filter((a) => a.isCompleted)
          .length,
      };

      const newChallenges = ChallengeGenerator.generateDailyChallenges(options);

      const updatedStats = {
        ...userStats,
        activeChallenges: newChallenges,
        challengeProgress: newChallenges.map((c) => ({
          challengeId: c.id,
          progress: 0,
          lastUpdated: new Date(),
        })),
      };

      setUserStats(updatedStats);
      await StorageService.saveUserStats(updatedStats);
    }
  };

  const updateChallengeProgress = async (
    challengeId: string,
    progress: number
  ) => {
    const updatedStats = { ...userStats };

    // Update challenge progress
    const progressIndex = updatedStats.challengeProgress.findIndex(
      (p) => p.challengeId === challengeId
    );

    if (progressIndex >= 0) {
      updatedStats.challengeProgress[progressIndex].progress = progress;
      updatedStats.challengeProgress[progressIndex].lastUpdated = new Date();
    }

    // Update challenge current value
    const challengeIndex = updatedStats.activeChallenges.findIndex(
      (c) => c.id === challengeId
    );

    if (challengeIndex >= 0) {
      updatedStats.activeChallenges[challengeIndex].current = progress;

      // Check if challenge is completed
      if (progress >= updatedStats.activeChallenges[challengeIndex].target) {
        updatedStats.activeChallenges[challengeIndex].isCompleted = true;
      }
    }

    setUserStats(updatedStats);
    await StorageService.saveUserStats(updatedStats);
  };

  const claimChallengeReward = async (challengeId: string) => {
    const challenge = userStats.activeChallenges.find(
      (c) => c.id === challengeId
    );
    if (!challenge || !challenge.isCompleted || challenge.isClaimed) {
      return;
    }

    const updatedStats = { ...userStats };

    // Mark challenge as claimed
    const challengeIndex = updatedStats.activeChallenges.findIndex(
      (c) => c.id === challengeId
    );
    if (challengeIndex >= 0) {
      updatedStats.activeChallenges[challengeIndex].isClaimed = true;
      updatedStats.completedChallenges.push(challengeId);
    }

    // Apply rewards
    updatedStats.totalPoints += challenge.reward.xp;
    updatedStats.level = Math.floor(updatedStats.totalPoints / 100) + 1;

    if (challenge.reward.streakFreezes) {
      updatedStats.streakFreezes += challenge.reward.streakFreezes;
    }

    // Trigger celebration
    if (typeof global !== 'undefined' && (global as any).celebrateConfetti) {
      HapticService.challengeComplete();
      setTimeout(() => {
        (global as any).celebrateConfetti({
          count: 100,
          origin: { x: 0, y: 0 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
        });
      }, 300);
    }

    setUserStats(updatedStats);
    await StorageService.saveUserStats(updatedStats);
  };

  const getActiveChallenges = (): DailyChallenge[] => {
    const now = new Date();
    return userStats.activeChallenges.map((challenge) => ({
      ...challenge,
      isExpired: challenge.expiresAt < now,
    }));
  };

  const getCompletedChallenges = (): DailyChallenge[] => {
    return userStats.activeChallenges.filter(
      (c) => c.isCompleted && !c.isClaimed
    );
  };

  const getChallengeProgress = (challengeId: string): number => {
    const progress = userStats.challengeProgress.find(
      (p) => p.challengeId === challengeId
    );
    return progress?.progress || 0;
  };

  const getChallengeNotifications = (): {
    challengeId: string;
    message: string;
    type: 'progress' | 'milestone' | 'completed';
  }[] => {
    const notifications: {
      challengeId: string;
      message: string;
      type: 'progress' | 'milestone' | 'completed';
    }[] = [];

    userStats.activeChallenges.forEach((challenge) => {
      const progress = getChallengeProgress(challenge.id);
      const progressPercentage = (progress / challenge.target) * 100;

      // Check for milestone notifications
      if (progressPercentage >= 50 && progressPercentage < 60) {
        notifications.push({
          challengeId: challenge.id,
          message: `${challenge.title}: Halfway there!`,
          type: 'milestone',
        });
      } else if (progressPercentage >= 90 && progressPercentage < 100) {
        notifications.push({
          challengeId: challenge.id,
          message: `${challenge.title}: Almost done!`,
          type: 'milestone',
        });
      }

      // Check for completion notifications
      if (challenge.isCompleted && !challenge.isClaimed) {
        notifications.push({
          challengeId: challenge.id,
          message: `${challenge.title}: Challenge completed! Tap to claim reward!`,
          type: 'completed',
        });
      }
    });

    return notifications;
  };

  const getComboMultiplier = (): number => {
    return userStats.comboMultiplier;
  };

  const updateCombo = (
    activity: Activity
  ): {
    newComboCount: number;
    newComboMultiplier: number;
    isNewCombo: boolean;
    isCategoryBonus: boolean;
  } => {
    const now = new Date();
    const timeSinceLastActivity = userStats.lastComboActivityTime
      ? now.getTime() - new Date(userStats.lastComboActivityTime).getTime()
      : Infinity;

    let newComboCount = userStats.comboCount;
    let newComboMultiplier = 1.0;
    let isNewCombo = false;
    let isCategoryBonus = false;

    // Check if combo should continue (within 60 seconds)
    if (timeSinceLastActivity <= 60 * 1000) {
      newComboCount = userStats.comboCount + 1;

      // Calculate base combo multiplier (1.0 + 0.1 * comboCount, max 2.0)
      const baseMultiplier = Math.min(1.0 + newComboCount * 0.1, 2.0);

      // Check for category bonus (+0.2x for same category)
      if (userStats.comboCategory === activity.category) {
        newComboMultiplier = baseMultiplier + 0.2;
        isCategoryBonus = true;
      } else {
        newComboMultiplier = baseMultiplier;
      }
    } else {
      // Start new combo
      newComboCount = 1;
      newComboMultiplier = 1.0;
      isNewCombo = true;
    }

    return {
      newComboCount,
      newComboMultiplier,
      isNewCombo,
      isCategoryBonus,
    };
  };

  const resetCombo = () => {
    const updatedStats = {
      ...userStats,
      comboCount: 0,
      comboStartTime: undefined,
      lastComboActivityTime: undefined,
      comboCategory: undefined,
      comboMultiplier: 1.0,
    };
    setUserStats(updatedStats);
  };

  const getOnFireMultiplier = (): number => {
    return userStats.onFireMode ? 2.0 : 1.0;
  };

  const checkOnFireMode = (
    activity: Activity
  ): {
    shouldActivate: boolean;
    shouldDeactivate: boolean;
    onFireMultiplier: number;
  } => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    // Update recent activities
    const newRecentActivities = [
      ...userStats.recentActivities,
      { timestamp: now, category: activity.category },
    ].slice(-10); // Keep only last 10 activities

    // Check for On Fire activation (5+ activities in 10 minutes)
    const recentCompletedActivities = newRecentActivities.filter(
      (a) => a.timestamp >= tenMinutesAgo
    );

    const shouldActivate =
      recentCompletedActivities.length >= 5 && !userStats.onFireMode;
    const shouldDeactivate =
      userStats.onFireMode &&
      now.getTime() - new Date(userStats.onFireStartTime!).getTime() >
        10 * 60 * 1000;

    const onFireMultiplier = userStats.onFireMode ? 2.0 : 1.0;

    return {
      shouldActivate,
      shouldDeactivate,
      onFireMultiplier,
    };
  };

  const activateOnFireMode = () => {
    const updatedStats = {
      ...userStats,
      onFireMode: true,
      onFireStartTime: new Date(),
      onFireActivities: userStats.onFireActivities + 1,
    };
    setUserStats(updatedStats);
  };

  const deactivateOnFireMode = () => {
    const updatedStats = {
      ...userStats,
      onFireMode: false,
      onFireStartTime: undefined,
      onFireActivities: 0,
    };
    setUserStats(updatedStats);
  };

  const updateChallengeProgressFromActivity = async (
    activity: Activity,
    onNotification?: (
      message: string,
      type: 'challenge' | 'milestone' | 'completed'
    ) => void
  ) => {
    const now = new Date();
    const updatedStats = { ...userStats };

    for (const challenge of updatedStats.activeChallenges) {
      if (challenge.isCompleted || challenge.isExpired) continue;

      let progressIncrement = 0;

      switch (challenge.type) {
        case 'category':
          if (challenge.category === activity.category) {
            progressIncrement = 1;
          }
          break;

        case 'points':
          progressIncrement = activity.points;
          break;

        case 'combo':
          progressIncrement = 1;
          break;

        case 'time':
          progressIncrement = 1;
          break;

        case 'variety':
          const todayCompleted = todayActivities.filter((a) => a.isCompleted);
          const uniqueCategories = new Set(
            todayCompleted.map((a) => a.category)
          );
          progressIncrement = uniqueCategories.size;
          break;

        case 'streak':
          break;
      }

      if (progressIncrement > 0) {
        const currentProgress = updatedStats.challengeProgress.find(
          (p) => p.challengeId === challenge.id
        );

        if (currentProgress) {
          const oldProgress = currentProgress.progress;
          const newProgress = Math.min(
            oldProgress + progressIncrement,
            challenge.target
          );

          const oldPercentage = (oldProgress / challenge.target) * 100;
          const newPercentage = (newProgress / challenge.target) * 100;

          if (oldPercentage < 50 && newPercentage >= 50) {
            const notificationId = `${challenge.id}-50`;
            if (!recentNotifications.has(notificationId)) {
              setRecentNotifications(
                (prev) => new Set([...prev, notificationId])
              );
              onNotification?.(
                `${challenge.title}: Halfway there!`,
                'milestone'
              );

              setTimeout(() => {
                setRecentNotifications((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(notificationId);
                  return newSet;
                });
              }, 5 * 60 * 1000);
            }
          }

          if (oldPercentage < 90 && newPercentage >= 90) {
            const notificationId = `${challenge.id}-90`;
            if (!recentNotifications.has(notificationId)) {
              setRecentNotifications(
                (prev) => new Set([...prev, notificationId])
              );
              onNotification?.(
                `${challenge.title}: Almost done!`,
                'milestone'
              );

              setTimeout(() => {
                setRecentNotifications((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(notificationId);
                  return newSet;
                });
              }, 5 * 60 * 1000);
            }
          }

          if (!challenge.isCompleted && newProgress >= challenge.target) {
            const notificationId = `${challenge.id}-completed`;
            if (!recentNotifications.has(notificationId)) {
              setRecentNotifications(
                (prev) => new Set([...prev, notificationId])
              );
              onNotification?.(
                `${challenge.title}: Challenge completed!`,
                'completed'
              );

              setTimeout(() => {
                triggerShake('light');
              }, 200);
            }
          }

          await updateChallengeProgress(challenge.id, newProgress);
        }
      }
    }
  };

  const updateStreak = (
    lastDate: string,
    currentDate: string
  ): { newStreak: number; usedFreeze: boolean } => {
    if (!lastDate) {
      return { newStreak: 1, usedFreeze: false };
    }

    const lastDateObj = new Date(lastDate);
    const currentDateObj = new Date(currentDate);
    const today = getLocalMidnight();

    if (getDateString(lastDateObj) === getDateString(currentDateObj)) {
      return { newStreak: userStats.currentStreak, usedFreeze: false };
    }

    const daysDiff = Math.floor(
      (today.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      const newStreak = userStats.currentStreak + 1;
      return { newStreak, usedFreeze: false };
    } else if (daysDiff > 1) {
      if (userStats.streakFreezes > 0) {
        return { newStreak: userStats.currentStreak, usedFreeze: true };
      } else {
        return { newStreak: 1, usedFreeze: false };
      }
    }

    return { newStreak: userStats.currentStreak, usedFreeze: false };
  };

  const updateStreakHistory = (date: string, completed: boolean) => {
    const history = [...userStats.streakHistory];
    const existingIndex = history.findIndex((h) => h.date === date);

    if (existingIndex >= 0) {
      history[existingIndex] = { date, completed };
    } else {
      history.push({ date, completed });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);

    const filteredHistory = history.filter(
      (h) => new Date(h.date) >= cutoffDate
    );

    return filteredHistory;
  };

  const getStreakMultiplier = (streak: number): number => {
    if (streak >= 100) return 3.0;
    if (streak >= 30) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
  };

  const calculatePointsWithMultiplier = (
    basePoints: number,
    categoryMultiplier: number = 1
  ): number => {
    const streakMultiplier = getStreakMultiplier(userStats.currentStreak);
    const comboMultiplier = getComboMultiplier();
    const onFireMultiplier = getOnFireMultiplier();
    return Math.round(
      basePoints *
        categoryMultiplier *
        streakMultiplier *
        comboMultiplier *
        onFireMultiplier
    );
  };

  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.createdAt)
      .toISOString()
      .split('T')[0];
    return activityDate === getTodayDate();
  });

  const addActivity = async (
    title: string,
    category: ActivityCategory,
    description?: string,
    emoji?: string
  ) => {
    const categoryConfig = ACTIVITY_CATEGORIES[category];
    const pointsWithMultiplier = calculatePointsWithMultiplier(
      categoryConfig.basePoints
    );

    const newActivity: Activity = {
      id: uuid.v4() as string,
      title,
      description,
      category,
      points: pointsWithMultiplier,
      createdAt: new Date(),
      isCompleted: false,
      emoji,
    };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    await StorageService.saveActivities(updatedActivities);
  };

  const toggleActivity = async (
    id: string,
    onNotification?: (
      message: string,
      type: 'challenge' | 'milestone' | 'completed'
    ) => void
  ) => {
    const updatedActivities = activities.map((activity) => {
      if (activity.id === id) {
        const isNowCompleted = !activity.isCompleted;
        return {
          ...activity,
          isCompleted: isNowCompleted,
          completedAt: isNowCompleted ? new Date() : undefined,
        };
      }
      return activity;
    });

    setActivities(updatedActivities);
    await StorageService.saveActivities(updatedActivities);

    const completedActivity = updatedActivities.find((a) => a.id === id);
    if (completedActivity?.isCompleted) {
      await updateChallengeProgressFromActivity(
        completedActivity,
        onNotification
      );
    }

    await updateUserStats(
      updatedActivities,
      completedActivity?.isCompleted ? completedActivity : undefined
    );
  };

  const deleteActivity = async (id: string) => {
    const updatedActivities = activities.filter(
      (activity) => activity.id !== id
    );
    setActivities(updatedActivities);
    await StorageService.saveActivities(updatedActivities);
    await updateUserStats(updatedActivities);
  };

  const updateUserStats = async (
    updatedActivities: Activity[],
    newCompletedActivity?: Activity
  ) => {
    const completedActivities = updatedActivities.filter((a) => a.isCompleted);
    const totalPoints = completedActivities.reduce(
      (sum, a) => sum + a.points,
      0
    );
    const newLevel = Math.floor(totalPoints / 100) + 1;
    const leveledUp = newLevel > userStats.level;

    let comboUpdates = {
      newComboCount: userStats.comboCount,
      newComboMultiplier: userStats.comboMultiplier,
      isNewCombo: false,
      isCategoryBonus: false,
    };

    let updatedStats = { ...userStats };

    if (newCompletedActivity) {
      comboUpdates = updateCombo(newCompletedActivity);

      const onFireCheck = checkOnFireMode(newCompletedActivity);

      updatedStats = {
        ...userStats,
        comboCount: comboUpdates.newComboCount,
        comboMultiplier: comboUpdates.newComboMultiplier,
        lastComboActivityTime: new Date(),
        comboCategory: newCompletedActivity.category,
        onFireMode: onFireCheck.shouldActivate
          ? true
          : onFireCheck.shouldDeactivate
          ? false
          : userStats.onFireMode,
        onFireActivities: onFireCheck.shouldActivate
          ? 1
          : onFireCheck.shouldDeactivate
          ? 0
          : userStats.onFireActivities,
        recentActivities: [
          ...userStats.recentActivities,
          { timestamp: new Date(), category: newCompletedActivity.category },
        ].slice(-10),
      };

      if (comboUpdates.isNewCombo) {
        updatedStats.comboStartTime = new Date();
      }

      if (onFireCheck.shouldActivate) {
        updatedStats.onFireStartTime = new Date();
      } else if (onFireCheck.shouldDeactivate) {
        updatedStats.onFireStartTime = undefined;
      }
    }

    const newAchievements = [...updatedStats.achievements];

    ACHIEVEMENTS.forEach((achievement) => {
      const alreadyUnlocked = newAchievements.some(
        (a) => a.id === achievement.id
      );

      if (!alreadyUnlocked) {
        let shouldUnlock = false;

        switch (achievement.requirement.type) {
          case 'points':
            shouldUnlock = totalPoints >= achievement.requirement.value;
            break;
          case 'activities':
            shouldUnlock =
              completedActivities.length >= achievement.requirement.value;
            break;
          case 'category':
            const categoryActivities = completedActivities.filter(
              (a) => a.category === achievement.requirement.category
            );
            shouldUnlock =
              categoryActivities.length >= achievement.requirement.value;
            break;
        }

        if (shouldUnlock) {
          newAchievements.push({
            ...achievement,
            unlockedAt: new Date(),
          } as Achievement);

          setTimeout(() => {
            triggerShake('medium');
          }, 200);
        }
      }
    });

    const today = getDateString(new Date());
    const todayCompletedActivities = completedActivities.filter((activity) => {
      const activityDate = getDateString(
        new Date(activity.completedAt || activity.createdAt)
      );
      return activityDate === today;
    });

    let newStreak = updatedStats.currentStreak;
    let usedFreeze = false;
    let newStreakFreezes = updatedStats.streakFreezes;

    if (todayCompletedActivities.length > 0) {
      const streakResult = updateStreak(updatedStats.lastActivityDate, today);
      newStreak = streakResult.newStreak;
      usedFreeze = streakResult.usedFreeze;

      if (usedFreeze) {
        newStreakFreezes = Math.max(0, updatedStats.streakFreezes - 1);
      }
    }

    const newLongestStreak = Math.max(updatedStats.longestStreak, newStreak);

    const updatedHistory = updateStreakHistory(
      today,
      todayCompletedActivities.length > 0
    );

    const newStats: UserStats = {
      ...updatedStats,
      totalPoints,
      level: newLevel,
      completedActivities: completedActivities.length,
      achievements: newAchievements,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActivityDate:
        todayCompletedActivities.length > 0
          ? today
          : updatedStats.lastActivityDate,
      streakFreezes: newStreakFreezes,
      streakHistory: updatedHistory,
    };

    setUserStats(newStats);
    await StorageService.saveUserStats(newStats);

    if (
      leveledUp &&
      typeof global !== 'undefined' &&
      (global as any).celebrateConfetti
    ) {
      HapticService.levelUp();

      setTimeout(() => {
        (global as any).celebrateConfetti({
          count: 150,
          origin: { x: 0, y: 0 },
        });
      }, 500);
    }

    if (
      (newStreak === 7 || newStreak === 30 || newStreak === 100) &&
      typeof global !== 'undefined' &&
      (global as any).celebrateConfetti
    ) {
      HapticService.streakMilestone();

      setTimeout(() => {
        (global as any).celebrateConfetti({
          count: 120,
          origin: { x: 0, y: 0 },
          colors: ['#FF6B6B', '#FFD700', '#FF4500', '#FFA500'],
        });
      }, 800);
    }
  };

  const getTotalAuraPoints = () => {
    return activities
      .filter((a) => a.isCompleted)
      .reduce((sum, a) => sum + a.points, 0);
  };

  const getTodayAuraPoints = () => {
    return todayActivities
      .filter((a) => a.isCompleted)
      .reduce((sum, a) => sum + a.points, 0);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        userStats,
        todayActivities,
        addActivity,
        toggleActivity,
        deleteActivity,
        getTotalAuraPoints,
        getTodayAuraPoints,
        refreshData,
        getStreakMultiplier,
        calculatePointsWithMultiplier,
        generateDailyChallenges,
        updateChallengeProgress,
        claimChallengeReward,
        getActiveChallenges,
        getCompletedChallenges,
        getChallengeProgress,
        getChallengeNotifications,
        getComboMultiplier,
        updateCombo,
        resetCombo,
        getOnFireMultiplier,
        checkOnFireMode,
        activateOnFireMode,
        deactivateOnFireMode,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
}
