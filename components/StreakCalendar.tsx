import { Colors } from '@/constants/theme';
import { useActivities } from '@/contexts/ActivityContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface StreakCalendarProps {
  days?: number; // Number of days to show (default: 30)
}

export function StreakCalendar({ days = 30 }: StreakCalendarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userStats } = useActivities();

  const generateCalendarData = () => {
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const streakEntry = userStats.streakHistory.find(
        (h) => h.date === dateString
      );
      const isCompleted = streakEntry?.completed || false;

      data.push({
        date,
        dateString,
        isCompleted,
        isToday: i === 0,
      });
    }

    return data;
  };

  const calendarData = generateCalendarData();

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getStreakIntensity = (index: number) => {
    // Create a visual intensity based on recent activity
    const recentData = calendarData.slice(Math.max(0, index - 6), index + 1);
    const completedCount = recentData.filter((d) => d.isCompleted).length;
    return Math.min(completedCount / 7, 1); // Normalize to 0-1
  };

  const getCellColor = (data: (typeof calendarData)[0]) => {
    if (data.isCompleted) {
      const intensity = getStreakIntensity(calendarData.indexOf(data));
      const baseColor = '#4ECDC4';
      const opacity = 0.3 + intensity * 0.7;
      return `rgba(78, 205, 196, ${opacity})`;
    }
    return 'rgba(0, 0, 0, 0.05)';
  };

  const getCellBorderColor = (data: (typeof calendarData)[0]) => {
    if (data.isToday) return '#4ECDC4';
    if (data.isCompleted) return '#4ECDC4';
    return 'transparent';
  };

  const groupByWeeks = () => {
    const weeks = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      weeks.push(calendarData.slice(i, i + 7));
    }
    return weeks;
  };

  const weeks = groupByWeeks();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Streak Calendar
        </Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Last {days} days
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.calendar}>
          {/* Day headers */}
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <View key={index} style={styles.dayHeader}>
                <Text
                  style={[styles.dayText, { color: colors.tabIconDefault }]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((dayData, dayIndex) => (
                <View key={dayIndex} style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayCircle,
                      {
                        backgroundColor: getCellColor(dayData),
                        borderColor: getCellBorderColor(dayData),
                        borderWidth: dayData.isToday ? 2 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: dayData.isCompleted
                            ? '#4ECDC4'
                            : colors.tabIconDefault,
                          fontWeight: dayData.isToday ? 'bold' : 'normal',
                        },
                      ]}
                    >
                      {dayData.date.getDate()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.tabIconDefault }]}>
          Completed | Missed | Today
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  calendar: {
    flexDirection: 'column',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    width: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    marginTop: 16,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
