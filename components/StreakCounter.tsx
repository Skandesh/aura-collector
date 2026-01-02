import { Colors } from '@/constants/theme';
import { useActivities } from '@/contexts/ActivityContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StreakCounterProps {
  onPress?: () => void;
  showFreezeIndicators?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function StreakCounter({
  onPress,
  showFreezeIndicators = true,
  size = 'medium',
}: StreakCounterProps) {
  const { userStats } = useActivities();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const getStreakEmoji = () => {
    const streak = userStats.currentStreak;
    if (streak >= 100) return '💎🔥';
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '🔥';
  };

  const getStreakLabel = () => {
    const streak = userStats.currentStreak;
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return 'Day Streak';
    return 'Day Streak';
  };

  const getIntensityLevel = () => {
    const streak = userStats.currentStreak;
    if (streak >= 100) return 'legendary';
    if (streak >= 30) return 'epic';
    if (streak >= 7) return 'rare';
    if (streak >= 3) return 'common';
    return 'basic';
  };

  const getContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallContainer;
      case 'large':
        return styles.largeContainer;
      default:
        return styles.mediumContainer;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const renderFreezeIndicators = () => {
    if (!showFreezeIndicators || size === 'small') return null;

    const freezes = [];
    for (let i = 0; i < 3; i++) {
      freezes.push(
        <Text key={i} style={styles.freezeEmoji}>
          {i < userStats.streakFreezes ? '❄️' : '🔓'}
        </Text>
      );
    }
    return <View style={styles.freezeContainer}>{freezes}</View>;
  };

  const intensity = getIntensityLevel();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/streak-calendar');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        getContainerStyle(),
        {
          backgroundColor:
            intensity === 'legendary'
              ? 'rgba(255, 215, 0, 0.2)'
              : intensity === 'epic'
              ? 'rgba(255, 165, 0, 0.2)'
              : intensity === 'rare'
              ? 'rgba(255, 69, 0, 0.2)'
              : 'rgba(255, 87, 34, 0.1)',
          borderColor:
            intensity === 'legendary'
              ? '#FFD700'
              : intensity === 'epic'
              ? '#FFA500'
              : intensity === 'rare'
              ? '#FF4500'
              : '#FF5722',
        },
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          intensity === 'legendary'
            ? ['#FFD700', '#FFA500']
            : intensity === 'epic'
            ? ['#FFA500', '#FF6347']
            : intensity === 'rare'
            ? ['#FF6347', '#FF4500']
            : ['#FF5722', '#FF6B6B']
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.streakMain}>
            <Text
              style={[
                styles.streakEmoji,
                {
                  fontSize: size === 'large' ? 32 : size === 'small' ? 20 : 24,
                },
              ]}
            >
              {getStreakEmoji()}
            </Text>
            <View style={styles.streakTextContainer}>
              <Text
                style={[getTextStyle(), styles.streakNumber, { color: '#fff' }]}
              >
                {userStats.currentStreak}
              </Text>
              <Text
                style={[
                  getTextStyle(),
                  styles.streakLabel,
                  { color: 'rgba(255,255,255,0.9)' },
                ]}
              >
                {getStreakLabel()}
              </Text>
            </View>
          </View>

          {renderFreezeIndicators()}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  smallContainer: {
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    minWidth: 80,
  },
  mediumContainer: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    minWidth: 120,
  },
  largeContainer: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 3,
    minWidth: 160,
  },
  gradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakTextContainer: {
    alignItems: 'flex-start',
  },
  smallText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mediumText: {
    fontSize: 16,
    fontWeight: '700',
  },
  largeText: {
    fontSize: 20,
    fontWeight: '800',
  },
  streakNumber: {
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
    opacity: 0.9,
  },
  freezeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  freezeEmoji: {
    fontSize: 16,
  },
});
