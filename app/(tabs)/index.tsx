import { StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabit } from '@/contexts/HabitContext';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { habitData, loading, error, markDaySuccessful, markDayUnsuccessful, resetStreak } = useHabit();
  const [todayMarked, setTodayMarked] = useState(false);
  const [todaySuccessful, setTodaySuccessful] = useState(false);

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
      </ThemedView>

      <ThemedView
        style={styles.streakContainer}
        accessibilityLabel={`Current streak: ${habitData.currentStreak} days`}
        accessibilityRole="text">
        <ThemedText type="subtitle">Current Streak</ThemedText>
        <ThemedText style={styles.streakNumber}>{habitData.currentStreak}</ThemedText>
        <ThemedText type="default">days</ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Best Streak:</ThemedText>
          <ThemedText> {habitData.bestStreak} days</ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Started:</ThemedText>
          <ThemedText> {formatDate(habitData.streakStartDate)}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.statusContainer}>
        <ThemedText type="subtitle">Today's Status</ThemedText>
        {todayMarked ? (
          <ThemedView style={styles.statusBadge}>
            <ThemedText style={todaySuccessful ? styles.successText : styles.failureText}>
              {todaySuccessful ? '✓ Successful' : '✗ Unsuccessful'}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedText style={styles.unmarkedText}>Not marked yet</ThemedText>
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
          <ThemedText style={styles.buttonText}>Mark Today Successful</ThemedText>
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
          <ThemedText style={styles.buttonText}>Mark Today Unsuccessful</ThemedText>
        </Pressable>

        {habitData.currentStreak > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.resetButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleResetStreak}
            accessibilityLabel="Reset streak"
            accessibilityHint={`Resets your current ${habitData.currentStreak} day streak`}
            accessibilityRole="button">
            <ThemedText style={styles.resetButtonText}>Reset Streak</ThemedText>
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
    marginBottom: 40,
    marginTop: 20,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 200, 255, 0.1)',
    minHeight: 180,
  },
  streakNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    marginVertical: 10,
    lineHeight: 90,
  },
  infoContainer: {
    marginBottom: 40,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusBadge: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  failureText: {
    color: '#F44336',
    fontSize: 18,
    fontWeight: '600',
  },
  unmarkedText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.6,
  },
  actionContainer: {
    gap: 16,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  failureButton: {
    backgroundColor: '#F44336',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  resetButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: '600',
  },
});
