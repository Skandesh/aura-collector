import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useActivities } from '@/contexts/ActivityContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function OnFireIndicator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userStats } = useActivities();

  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (userStats.onFireMode && userStats.onFireStartTime) {
      setIsVisible(true);

      const updateTimer = () => {
        const now = new Date();
        const timeDiff =
          now.getTime() - new Date(userStats.onFireStartTime!).getTime();
        const secondsLeft = Math.max(0, 600 - Math.floor(timeDiff / 1000)); // 10 minutes
        setTimeLeft(secondsLeft);

        if (secondsLeft <= 0) {
          setIsVisible(false);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 100);

      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        clearInterval(interval);
        pulseAnimation.stop();
      };
    } else {
      setIsVisible(false);
      pulseAnim.setValue(1);
    }
  }, [userStats.onFireMode, userStats.onFireStartTime]);

  if (!isVisible) {
    return null;
  }

  const progressPercentage = (timeLeft / 600) * 100; // 10 minutes total
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="flame.fill" size={32} color="#FF4500" />
            <View style={styles.fireEffect} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              ON FIRE!
            </Text>
            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
              2x Points Active
            </Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: colors.tabIconDefault }]}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
          <View style={styles.timerBar}>
            <View
              style={[
                styles.timerFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: '#FF4500',
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, { color: '#FF4500' }]}>
            Activities: {userStats.onFireActivities}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 220,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FF4500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  fireEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    backgroundColor: '#FF4500',
    opacity: 0.3,
    shadowColor: '#FF4500',
    shadowRadius: 8,
    shadowOpacity: 0.6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  timerContainer: {
    marginBottom: 8,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  timerBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
