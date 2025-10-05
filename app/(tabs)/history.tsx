import { StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabit } from '@/contexts/HabitContext';
import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HistoryScreen() {
  const { habitData } = useHabit();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  const getDayStatus = (date: Date): 'success' | 'failure' | 'unmarked' => {
    const dateString = format(date, 'yyyy-MM-dd');
    const record = habitData.dailyRecords.find(r => r.date === dateString);

    if (!record) return 'unmarked';
    return record.successful ? 'success' : 'failure';
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = monthStart.getDay();

    // Create empty cells for days before the month starts
    const emptyCells = Array(firstDayOfWeek).fill(null);

    const allCells = [...emptyCells, ...daysInMonth];

    // Group into weeks
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < allCells.length; i += 7) {
      weeks.push(allCells.slice(i, i + 7));
    }

    return (
      <ThemedView style={styles.calendar}>
        {/* Day headers */}
        <ThemedView style={styles.weekRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <ThemedView key={day} style={styles.dayHeader}>
              <ThemedText style={styles.dayHeaderText}>{day}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <ThemedView key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <ThemedView key={dayIndex} style={styles.dayCell} />;
              }

              const status = getDayStatus(day);
              const isToday = isSameDay(day, new Date());

              return (
                <ThemedView
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    status === 'success' && styles.successDay,
                    status === 'failure' && styles.failureDay,
                    isToday && styles.todayBorder,
                  ]}>
                  <ThemedText
                    style={[
                      styles.dayText,
                      status === 'success' && styles.successText,
                      status === 'failure' && styles.failureText,
                    ]}>
                    {format(day, 'd')}
                  </ThemedText>
                </ThemedView>
              );
            })}
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">History</ThemedText>
        </ThemedView>

        {/* Month navigation */}
        <ThemedView style={[
          styles.monthNavigation,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
            accessibilityLabel="Previous month"
            accessibilityHint="Navigate to previous month"
            accessibilityRole="button">
            <ThemedText style={[
              styles.navButtonText,
              { color: Colors[colorScheme ?? 'light'].highlight }
            ]}>←</ThemedText>
          </Pressable>

          <ThemedText
            type="subtitle"
            accessibilityLabel={`Viewing ${format(currentMonth, 'MMMM yyyy')}`}>
            {format(currentMonth, 'MMMM yyyy')}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
            accessibilityLabel="Next month"
            accessibilityHint="Navigate to next month"
            accessibilityRole="button">
            <ThemedText style={[
              styles.navButtonText,
              { color: Colors[colorScheme ?? 'light'].highlight }
            ]}>→</ThemedText>
          </Pressable>
        </ThemedView>

        {/* Calendar */}
        <ThemedView style={[
          styles.calendar,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          {renderCalendar()}
        </ThemedView>

        {/* Legend */}
        <ThemedView style={[
          styles.legend,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendBox, styles.successDay]} />
            <ThemedText style={styles.legendText}>Successful</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendBox, styles.failureDay]} />
            <ThemedText style={styles.legendText}>Unsuccessful</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendBox, styles.unmarkedDay]} />
            <ThemedText style={styles.legendText}>Unmarked</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Stats */}
        <ThemedView style={[
          styles.statsContainer,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
        ]}>
          <ThemedText type="subtitle">This Month</ThemedText>
          <ThemedView style={styles.statsRow}>
            <ThemedText type="defaultSemiBold">
              Successful Days:{' '}
              {habitData.dailyRecords.filter(
                r => r.successful && isSameMonth(new Date(r.date), currentMonth)
              ).length}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <ThemedText type="defaultSemiBold">
              Total Records:{' '}
              {habitData.dailyRecords.filter(r => isSameMonth(new Date(r.date), currentMonth)).length}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Streak History */}
        <ThemedView style={styles.streakHistoryContainer}>
          <ThemedText type="subtitle">Streak History</ThemedText>

          {/* Best Streak */}
          <ThemedView style={[
            styles.bestStreakBox,
            {
              backgroundColor: `${Colors[colorScheme ?? 'light'].gold}20`,
              borderColor: Colors[colorScheme ?? 'light'].gold,
              shadowColor: Colors[colorScheme ?? 'light'].gold,
            }
          ]}>
            <ThemedText style={styles.bestStreakLabel}>Best Streak</ThemedText>
            <ThemedText style={[
              styles.bestStreakNumber,
              { color: Colors[colorScheme ?? 'light'].gold }
            ]}>{habitData.bestStreak}</ThemedText>
            <ThemedText style={styles.bestStreakLabel}>days</ThemedText>
            {habitData.bestStreak > 0 && (
              <ThemedView style={styles.streakBadge}>
                <ThemedText style={styles.streakEmoji}>👑</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          {/* Previous Streaks */}
          {habitData.streakHistory.length > 0 ? (
            <ThemedView style={styles.streakList}>
              <ThemedText type="defaultSemiBold" style={styles.streakListTitle}>
                Previous Streaks
              </ThemedText>
              {habitData.streakHistory
                .slice()
                .reverse()
                .map((streak, index) => (
                  <ThemedView key={index} style={[
                    styles.streakItem,
                    { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
                  ]}>
                    <ThemedView style={styles.streakItemHeader}>
                      <ThemedText style={styles.streakDuration}>{streak.duration} days</ThemedText>
                      <ThemedView
                        style={[
                          styles.streakEndBadge,
                          streak.endReason === 'manual_reset'
                            ? {
                                backgroundColor: `${Colors[colorScheme ?? 'light'].warning}20`,
                                borderColor: Colors[colorScheme ?? 'light'].warning,
                              }
                            : {
                                backgroundColor: `${Colors[colorScheme ?? 'light'].failure}20`,
                                borderColor: Colors[colorScheme ?? 'light'].failure,
                              },
                        ]}>
                        <ThemedText style={[
                          styles.streakEndText,
                          {
                            color: streak.endReason === 'manual_reset'
                              ? Colors[colorScheme ?? 'light'].warning
                              : Colors[colorScheme ?? 'light'].failure,
                          }
                        ]}>
                          {streak.endReason === 'manual_reset' ? 'Manual Reset' : 'Unsuccessful Day'}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.streakDates}>
                      <ThemedText style={styles.streakDateText}>
                        {format(new Date(streak.startDate), 'MMM d, yyyy')} -{' '}
                        {format(new Date(streak.endDate), 'MMM d, yyyy')}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                ))}
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No previous streaks yet. Keep building your current streak!
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    padding: 12,
    minWidth: 50,
    alignItems: 'center',
    borderRadius: 12,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  calendar: {
    marginBottom: 25,
    padding: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.7,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  successDay: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  failureDay: {
    backgroundColor: '#F44336',
    shadowColor: '#F44336',
  },
  unmarkedDay: {
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  failureText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todayBorder: {
    borderWidth: 3,
    borderColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsContainer: {
    padding: 22,
    borderRadius: 18,
    gap: 15,
    marginBottom: 25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    paddingVertical: 6,
  },
  streakHistoryContainer: {
    gap: 25,
    marginBottom: 30,
  },
  bestStreakBox: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 20,
    borderWidth: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    minHeight: 160,
  },
  bestStreakLabel: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
  },
  bestStreakNumber: {
    fontSize: Math.min(60, screenWidth * 0.12),
    fontWeight: 'bold',
    marginVertical: 8,
    lineHeight: 65,
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
  streakList: {
    gap: 15,
  },
  streakListTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  streakItem: {
    padding: 18,
    borderRadius: 14,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakDuration: {
    fontSize: 20,
    fontWeight: '700',
  },
  streakEndBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  manualResetBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  failureBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  streakEndText: {
    fontSize: 12,
    fontWeight: '700',
  },
  streakDates: {
    marginTop: 6,
  },
  streakDateText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  emptyStateText: {
    opacity: 0.6,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
