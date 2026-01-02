import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MultiplierBadgeProps {
  multiplier: number;
  basePoints: number;
  categoryColor?: string;
  showDetails?: boolean;
  animated?: boolean;
}

export function MultiplierBadge({
  multiplier,
  basePoints,
  categoryColor = '#4ECDC4',
  showDetails = true,
  animated = true,
}: MultiplierBadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getMultiplierColor = () => {
    if (multiplier >= 3.0) return ['#FFD700', '#FFA500']; // Diamond/Gold
    if (multiplier >= 2.0) return ['#FFA500', '#FF6347']; // Gold/Orange
    if (multiplier >= 1.5) return ['#FF6347', '#FF4500']; // Orange/Red
    if (multiplier >= 1.2) return ['#FF4500', '#FF5722']; // Red/Dark Orange
    return ['#666666', '#888888']; // Gray
  };

  const getMultiplierSymbol = () => {
    if (multiplier >= 3.0) return '💎';
    if (multiplier >= 2.0) return '🥇';
    if (multiplier >= 1.5) return '🥈';
    if (multiplier >= 1.2) return '🥉';
    return '⚪';
  };

  const finalPoints = Math.round(basePoints * multiplier);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getMultiplierColor()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.symbol}>{getMultiplierSymbol()}</Text>
          <Text style={[styles.multiplierText, { color: '#fff' }]}>
            {multiplier}x
          </Text>
        </View>
      </LinearGradient>

      {showDetails && (
        <View style={styles.details}>
          <Text style={[styles.pointsText, { color: categoryColor }]}>
            +{finalPoints} pts
          </Text>
          {multiplier > 1.0 && (
            <Text style={[styles.breakdown, { color: colors.tabIconDefault }]}>
              ({basePoints} base × {multiplier} streak)
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradient: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  symbol: {
    fontSize: 14,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    alignItems: 'flex-start',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  breakdown: {
    fontSize: 10,
    opacity: 0.7,
  },
});
