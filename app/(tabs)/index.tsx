import { StyleSheet, Pressable, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabit } from '@/contexts/HabitContext';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const { habitData, loading, error, markDaySuccessful, markDayUnsuccessful, resetStreak } = useHabit();
  const [todayMarked, setTodayMarked] = useState(false);
  const [todaySuccessful, setTodaySuccessful] = useState(false);
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = habitData.dailyRecords.find(r => r.date === today);

    if (todayRecord) {
      setTodayMarked(true);
      setTodaySuccessful(todayRecord.successful);
    } else {
      setTodayMarked(false);
      setTodaySuccessful(false);
    }
  }, [habitData.dailyRecords]);

  const handleMarkSuccess = async () => {
    try {
      const today = new Date();
      await markDaySuccessful(today);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to mark day as successful'
      );
    }
  };

  const handleMarkFailure = async () => {
    try {
      const today = new Date();
      await markDayUnsuccessful(today);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to mark day as unsuccessful'
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak',
      `Are you sure you want to reset your current streak of ${habitData.currentStreak} days? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetStreak(true);
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to reset streak');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Error</ThemedText>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Habit Tracker</ThemedText>
        <ThemedText style={styles.subtitle}>Stay consistent, build momentum</ThemedText>
      </ThemedView>

      <ThemedView
        style={[
          styles.streakContainer,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
            borderColor: Colors[colorScheme ?? 'light'].highlight,
            shadowColor: Colors[colorScheme ?? 'light'].highlight,
          }
        ]}
        accessibilityLabel={`Current streak: ${habitData.currentStreak} days`}
        accessibilityRole="text">
        <ThemedText style={styles.streakLabel}>Current Streak</ThemedText>
        <ThemedView style={styles.streakNumberContainer}>
          <ThemedText style={[
            styles.streakNumber,
            {
              color: Colors[colorScheme ?? 'light'].highlight,
              fontSize: Math.min(72, screenWidth * 0.15),
            }
          ]}>
            {habitData.currentStreak}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.streakDays}>days</ThemedText>
        {habitData.currentStreak > 0 && (
          <ThemedView style={styles.streakBadge}>
            <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedView style={[
          styles.statCard,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          <ThemedText style={styles.statLabel}>Best Streak</ThemedText>
          <ThemedText style={styles.statValue}>{habitData.bestStreak}</ThemedText>
        </ThemedView>
        <ThemedView style={[
          styles.statCard,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          <ThemedText style={styles.statLabel}>Started</ThemedText>
          <ThemedText style={styles.statDate}>{formatDate(habitData.streakStartDate)}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.statusContainer}>
        <ThemedText style={styles.statusTitle}>Today's Status</ThemedText>
        {todayMarked ? (
          <ThemedView style={[
            styles.statusBadge,
            {
              backgroundColor: todaySuccessful
                ? `${Colors[colorScheme ?? 'light'].success}20`
                : `${Colors[colorScheme ?? 'light'].failure}20`,
              borderColor: todaySuccessful
                ? Colors[colorScheme ?? 'light'].success
                : Colors[colorScheme ?? 'light'].failure,
            }
          ]}>
            <ThemedText style={[
              styles.statusText,
              { color: todaySuccessful
                ? Colors[colorScheme ?? 'light'].success
                : Colors[colorScheme ?? 'light'].failure
              }
            ]}>
              {todaySuccessful ? '✓ Successful' : '✗ Unsuccessful'}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={[
            styles.unmarkedBadge,
            { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
          ]}>
            <ThemedText style={styles.unmarkedText}>Not marked yet</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.actionContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.successButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleMarkSuccess}
          accessibilityLabel="Mark today as successful"
          accessibilityHint="Marks the current day as successful and increments your streak"
          accessibilityRole="button">
          <ThemedText style={styles.buttonText}>✓ Mark Successful</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.failureButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleMarkFailure}
          accessibilityLabel="Mark today as unsuccessful"
          accessibilityHint="Marks the current day as unsuccessful and resets your streak"
          accessibilityRole="button">
          <ThemedText style={styles.buttonText}>✗ Mark Unsuccessful</ThemedText>
        </Pressable>

        {habitData.currentStreak > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.resetButton,
              { borderColor: Colors[colorScheme ?? 'light'].warning },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleResetStreak}
            accessibilityLabel="Reset streak"
            accessibilityHint={`Resets your current ${habitData.currentStreak} day streak`}
            accessibilityRole="button">
            <ThemedText style={[
              styles.resetButtonText,
              { color: Colors[colorScheme ?? 'light'].warning }
            ]}>
              ↻ Reset Streak
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 25,
    borderRadius: 24,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    minHeight: 200,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 10,
  },
  streakNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  streakNumber: {
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 100,
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  streakBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  streakEmoji: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDate: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusBadge: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  unmarkedBadge: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  unmarkedText: {
    fontSize: 16,
    opacity: 0.6,
  },
  actionContainer: {
    gap: 12,
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failureButton: {
    backgroundColor: '#F44336',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
