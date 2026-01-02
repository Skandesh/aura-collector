import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useActivities } from '@/contexts/ActivityContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HapticService } from '@/services/hapticService';
import { DailyChallenge } from '@/types/activity';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChallengeCardProps {
  challenge: DailyChallenge;
  onClaim?: () => void;
  style?: any;
}

export function ChallengeCard({
  challenge,
  onClaim,
  style,
}: ChallengeCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { claimChallengeReward } = useActivities();

  const progressPercentage = Math.min(
    (challenge.current / challenge.target) * 100,
    100
  );
  const isExpired = challenge.isExpired;
  const isCompleted = challenge.isCompleted && !challenge.isClaimed;
  const isClaimed = challenge.isClaimed;

  const getCardStyle = () => {
    if (isClaimed) {
      return { backgroundColor: colors.card, opacity: 0.6 };
    }
    if (isExpired) {
      return { backgroundColor: '#FF6B6B20', borderColor: '#FF6B6B' };
    }
    if (isCompleted) {
      return { backgroundColor: '#4ECDC420', borderColor: '#4ECDC4' };
    }
    return { backgroundColor: colors.card };
  };

  const getProgressBarColor = () => {
    if (isClaimed) return '#999';
    if (isExpired) return '#FF6B6B';
    if (isCompleted) return '#4ECDC4';
    return challenge.difficulty === 'hard'
      ? '#FFD700'
      : challenge.difficulty === 'medium'
      ? '#FF8C00'
      : '#4ECDC4';
  };

  const handleClaim = async () => {
    if (isCompleted && !isClaimed && !isExpired) {
      await HapticService.challengeComplete();
      await claimChallengeReward(challenge.id);
      onClaim?.();
    }
  };

  const getStatusIcon = () => {
    if (isClaimed) return 'checkmark.circle.fill';
    if (isExpired) return 'xmark.circle.fill';
    if (isCompleted) return 'star.circle.fill';
    return challenge.icon;
  };

  const getStatusText = () => {
    if (isClaimed) return 'Claimed';
    if (isExpired) return 'Expired';
    if (isCompleted) return 'Ready to claim!';
    return `${challenge.current}/${challenge.target}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, getCardStyle(), style]}
      onPress={handleClaim}
      disabled={!isCompleted || isClaimed || isExpired}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <IconSymbol
            name={getStatusIcon()}
            size={24}
            color={getProgressBarColor()}
          />
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.title, { color: colors.text }]}>
            {challenge.title}
          </Text>
          <Text style={[styles.difficulty, { color: colors.tabIconDefault }]}>
            {challenge.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.tabIconDefault }]}>
        {challenge.description}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.tabIconDefault }]}>
            Progress
          </Text>
          <Text style={[styles.progressValue, { color: colors.text }]}>
            {getStatusText()}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getProgressBarColor(),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.rewardContainer}>
        <IconSymbol name="star.fill" size={16} color="#FFD700" />
        <Text style={[styles.rewardText, { color: '#FFD700' }]}>
          +{challenge.reward.xp} XP
        </Text>
        {challenge.reward.streakFreezes && (
          <Text style={[styles.rewardText, { color: '#4ECDC4' }]}>
            +{challenge.reward.streakFreezes} freezes
          </Text>
        )}
      </View>

      {isCompleted && !isClaimed && (
        <View style={[styles.claimButton, { backgroundColor: '#4ECDC4' }]}>
          <Text style={styles.claimButtonText}>Claim Reward</Text>
        </View>
      )}

      {isExpired && (
        <View style={[styles.expiredOverlay, { backgroundColor: '#FF6B6B80' }]}>
          <Text style={[styles.expiredText, { color: '#fff' }]}>Expired</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 280,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerRight: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  claimButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
