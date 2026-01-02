import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useActivities } from '@/contexts/ActivityContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ComboMeter() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userStats } = useActivities();

  const [timeLeft, setTimeLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const comboCount = userStats.comboCount;
  const lastActivityTime = userStats.lastComboActivityTime;

  useEffect(() => {
    if (comboCount > 0 && lastActivityTime) {
      setIsVisible(true);

      const updateTimer = () => {
        const now = new Date();
        const timeDiff = now.getTime() - new Date(lastActivityTime).getTime();
        const secondsLeft = Math.max(0, 60 - Math.floor(timeDiff / 1000));
        setTimeLeft(secondsLeft);

        if (secondsLeft <= 0) {
          setIsVisible(false);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 100);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [comboCount, lastActivityTime]);

  if (!isVisible || comboCount <= 0) {
    return null;
  }

  const getComboColor = () => {
    if (comboCount >= 10) return '#FF6B6B'; // Red
    if (comboCount >= 7) return '#FFD700'; // Gold
    if (comboCount >= 5) return '#9B59B6'; // Purple
    if (comboCount >= 3) return '#3498DB'; // Blue
    return '#4ECDC4'; // Teal
  };

  const getComboIcon = () => {
    if (comboCount >= 10) return 'bolt.circle.fill';
    if (comboCount >= 7) return 'bolt.fill';
    if (comboCount >= 5) return 'bolt.horizontal.circle.fill';
    if (comboCount >= 3) return 'bolt.horizontal.fill';
    return 'bolt';
  };

  const getComboSize = () => {
    if (comboCount >= 10) return 40;
    if (comboCount >= 7) return 36;
    if (comboCount >= 5) return 32;
    return 28;
  };

  const progressPercentage = (timeLeft / 60) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.comboHeader}>
        <View style={styles.comboIconContainer}>
          <IconSymbol
            name={getComboIcon()}
            size={getComboSize()}
            color={getComboColor()}
          />
          {comboCount >= 5 && <View style={styles.glowEffect} />}
        </View>
        <View style={styles.comboInfo}>
          <Text style={[styles.comboCount, { color: getComboColor() }]}>
            COMBO x{comboCount}
          </Text>
          <Text style={[styles.comboMultiplier, { color: colors.text }]}>
            {userStats.comboMultiplier.toFixed(1)}x Multiplier
          </Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: colors.tabIconDefault }]}>
          {timeLeft}s
        </Text>
        <View style={styles.timerBar}>
          <View
            style={[
              styles.timerFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getComboColor(),
              },
            ]}
          />
        </View>
      </View>

      {userStats.comboCategory && (
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryText, { color: colors.tabIconDefault }]}>
            {userStats.comboCategory} Chain
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 200,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  comboHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comboIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  glowEffect: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    opacity: 0.6,
    shadowColor: '#FFD700',
    shadowRadius: 10,
    shadowOpacity: 0.8,
  },
  comboInfo: {
    flex: 1,
  },
  comboCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  comboMultiplier: {
    fontSize: 12,
    fontWeight: '600',
  },
  timerContainer: {
    marginBottom: 8,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  timerBar: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
