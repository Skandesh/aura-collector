/**
 * Aura Level Definitions
 * Defines the progression system for the Aura Collector
 */

import { AuraLevel } from '@/types/task';

export const AURA_LEVELS: AuraLevel[] = [
  {
    level: 1,
    name: 'Dormant',
    minAura: 0,
    maxAura: 99,
    color: '#808080',
    description:
      'Your journey begins. The spark of discipline is yet to ignite.',
  },
  {
    level: 2,
    name: 'Awakening',
    minAura: 100,
    maxAura: 299,
    color: '#90EE90',
    description: 'The first steps are taken. Your aura begins to stir.',
  },
  {
    level: 3,
    name: 'Kindling',
    minAura: 300,
    maxAura: 599,
    color: '#87CEEB',
    description: 'Momentum builds. The flame of self-improvement grows.',
  },
  {
    level: 4,
    name: 'Flickering',
    minAura: 600,
    maxAura: 999,
    color: '#4169E1',
    description: 'Consistency forms. Your presence becomes noticeable.',
  },
  {
    level: 5,
    name: 'Steady',
    minAura: 1000,
    maxAura: 1499,
    color: '#9370DB',
    description:
      'Discipline solidified. Others begin to notice your transformation.',
  },
  {
    level: 6,
    name: 'Radiant',
    minAura: 1500,
    maxAura: 2499,
    color: '#FFD700',
    description: 'Your aura shines bright. Excellence becomes your standard.',
  },
  {
    level: 7,
    name: 'Blazing',
    minAura: 2500,
    maxAura: 3999,
    color: '#FF8C00',
    description: 'Unstoppable force. Your dedication inspires others.',
  },
  {
    level: 8,
    name: 'Brilliant',
    minAura: 4000,
    maxAura: 5999,
    color: '#FF4500',
    description: 'Mastery achieved. Few reach this level of commitment.',
  },
  {
    level: 9,
    name: 'Transcendent',
    minAura: 6000,
    maxAura: 9999,
    color: '#FF1493',
    description: 'Beyond ordinary limits. Your aura transcends the physical.',
  },
  {
    level: 10,
    name: 'Legendary',
    minAura: 10000,
    maxAura: Infinity,
    color: '#8B00FF',
    description: 'Living legend. Your name will be remembered.',
  },
];

/**
 * Get the aura level for a given total aura amount
 */
export const getAuraLevel = (totalAura: number): AuraLevel => {
  for (let i = AURA_LEVELS.length - 1; i >= 0; i--) {
    if (totalAura >= AURA_LEVELS[i].minAura) {
      return AURA_LEVELS[i];
    }
  }
  return AURA_LEVELS[0];
};

/**
 * Get progress within current level
 */
export const getAuraProgress = (totalAura: number) => {
  const currentLevel = getAuraLevel(totalAura);
  const nextLevel = AURA_LEVELS[currentLevel.level]; // Next level (if exists)

  const auraInCurrentLevel = totalAura - currentLevel.minAura;
  const auraNeededForLevel =
    currentLevel.maxAura === Infinity
      ? 0
      : currentLevel.maxAura - currentLevel.minAura;

  const progressPercentage =
    auraNeededForLevel > 0
      ? (auraInCurrentLevel / auraNeededForLevel) * 100
      : 100;

  return {
    currentLevel: currentLevel.level,
    currentLevelName: currentLevel.name,
    currentAura: totalAura,
    auraInCurrentLevel,
    auraNeededForNextLevel:
      currentLevel.maxAura === Infinity ? 0 : currentLevel.maxAura - totalAura,
    progressPercentage: Math.min(progressPercentage, 100),
    nextLevelName: nextLevel ? nextLevel.name : null,
    color: currentLevel.color,
    description: currentLevel.description,
  };
};

/**
 * Check if user leveled up after gaining aura
 */
export const checkLevelUp = (
  oldAura: number,
  newAura: number
): { leveledUp: boolean; newLevel?: number } => {
  const oldLevel = getAuraLevel(oldAura);
  const newLevel = getAuraLevel(newAura);

  return {
    leveledUp: newLevel.level > oldLevel.level,
    newLevel: newLevel.level > oldLevel.level ? newLevel.level : undefined,
  };
};
