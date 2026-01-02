import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export interface FloatingTextItem {
  id: string;
  text: string;
  type: 'xp' | 'bonus' | 'combo' | 'achievement';
  x: number;
  y: number;
}

interface FloatingTextProps {
  items: FloatingTextItem[];
  onAnimationComplete: (id: string) => void;
}

export function FloatingText({
  items,
  onAnimationComplete,
}: FloatingTextProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTextStyle = (type: FloatingTextItem['type']) => {
    switch (type) {
      case 'xp':
        return { color: '#4ECDC4' };
      case 'bonus':
        return { color: '#FFD700' };
      case 'combo':
        return { color: '#9C27B0' };
      case 'achievement':
        return { color: '#FF6B6B' };
      default:
        return { color: colors.text };
    }
  };

  const getTextSize = (type: FloatingTextItem['type']) => {
    switch (type) {
      case 'bonus':
      case 'achievement':
        return 18;
      case 'combo':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {items.map((item) => (
        <FloatingTextItemComponent
          key={item.id}
          item={item}
          onComplete={() => onAnimationComplete(item.id)}
          textStyle={getTextStyle(item.type)}
          textSize={getTextSize(item.type)}
        />
      ))}
    </View>
  );
}

interface FloatingTextItemProps {
  item: FloatingTextItem;
  onComplete: () => void;
  textStyle: { color: string };
  textSize: number;
}

function FloatingTextItemComponent({
  item,
  onComplete,
  textStyle,
  textSize,
}: FloatingTextItemProps) {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const startAnimation = () => {
      animation.setValue(0);

      Animated.timing(animation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    };

    // Small delay to ensure smooth animation
    const timer = setTimeout(startAnimation, 50);
    return () => clearTimeout(timer);
  }, [animation, onComplete]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 1, 0],
  });

  const scale = animation.interpolate({
    inputRange: [0, 0.2, 0.5, 1],
    outputRange: [1, 1.3, 0.9, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.floatingItem,
        {
          transform: [{ translateY }, { scale }],
          opacity,
          left: item.x,
          top: item.y,
        },
      ]}
    >
      <Text style={[styles.floatingText, textStyle, { fontSize: textSize }]}>
        {item.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  floatingItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
});
