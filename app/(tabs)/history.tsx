import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHabit } from '@/contexts/HabitContext';
import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

export default function HistoryScreen() {
  const { habitData } = useHabit();
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
        <ThemedView style={styles.monthNavigation}>
          <Pressable
            style={({ pressed }) => [styles.navButton, pressed && styles.buttonPressed]}
            onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
            accessibilityLabel="Previous month"
            accessibilityHint="Navigate to previous month"
            accessibilityRole="button">
            <ThemedText style={styles.navButtonText}>←</ThemedText>
          </Pressable>

          <ThemedText
            type="subtitle"
            accessibilityLabel={`Viewing ${format(currentMonth, 'MMMM yyyy')}`}>
            {format(currentMonth, 'MMMM yyyy')}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [styles.navButton, pressed && styles.buttonPressed]}
            onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
            accessibilityLabel="Next month"
            accessibilityHint="Navigate to next month"
            accessibilityRole="button">
            <ThemedText style={styles.navButtonText}>→</ThemedText>
          </Pressable>
        </ThemedView>

        {/* Calendar */}
        {renderCalendar()}

        {/* Legend */}
        <ThemedView style={styles.legend}>
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
        <ThemedView style={styles.statsContainer}>
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
          <ThemedView style={styles.bestStreakBox}>
            <ThemedText style={styles.bestStreakLabel}>Best Streak</ThemedText>
            <ThemedText style={styles.bestStreakNumber}>{habitData.bestStreak}</ThemedText>
            <ThemedText style={styles.bestStreakLabel}>days</ThemedText>
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
                  <ThemedView key={index} style={styles.streakItem}>
                    <ThemedView style={styles.streakItemHeader}>
                      <ThemedText style={styles.streakDuration}>{streak.duration} days</ThemedText>
                      <ThemedView
                        style={[
                          styles.streakEndBadge,
                          streak.endReason === 'manual_reset'
                            ? styles.manualResetBadge
                            : styles.failureBadge,
                        ]}>
                        <ThemedText style={styles.streakEndText}>
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
    marginBottom: 30,
    marginTop: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  calendar: {
    marginBottom: 30,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  successDay: {
    backgroundColor: '#4CAF50',
  },
  failureDay: {
    backgroundColor: '#F44336',
  },
  unmarkedDay: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  failureText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
  statsContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 200, 255, 0.1)',
    gap: 12,
    marginBottom: 30,
  },
  statsRow: {
    paddingVertical: 4,
  },
  streakHistoryContainer: {
    gap: 20,
    marginBottom: 30,
  },
  bestStreakBox: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#FFD700',
    minHeight: 140,
  },
  bestStreakLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  bestStreakNumber: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFD700',
    marginVertical: 5,
    lineHeight: 60,
  },
  streakList: {
    gap: 12,
  },
  streakListTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  streakItem: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 8,
  },
  streakItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakDuration: {
    fontSize: 18,
    fontWeight: '600',
  },
  streakEndBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  manualResetBadge: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  failureBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  streakEndText: {
    fontSize: 11,
    fontWeight: '600',
  },
  streakDates: {
    marginTop: 4,
  },
  streakDateText: {
    fontSize: 13,
    opacity: 0.7,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    opacity: 0.6,
    textAlign: 'center',
  },
});
