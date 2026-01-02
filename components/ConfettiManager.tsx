import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface ConfettiManagerProps {
  children: React.ReactNode;
}

export interface ConfettiManagerRef {
  celebrate: (config?: {
    count?: number;
    origin?: { x: number; y: number };
    colors?: string[];
  }) => void;
}

export const ConfettiManager = forwardRef<
  ConfettiManagerRef,
  ConfettiManagerProps
>(({ children }, ref) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const defaultConfig = {
    count: 100,
    origin: { x: -10, y: 0 },
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E77E', '#FFA500', '#9C27B0'],
  };

  useImperativeHandle(ref, () => ({
    celebrate: (config = {}) => {
      const finalConfig = { ...defaultConfig, ...config };
      setShowConfetti(true);
      setConfettiKey((prev) => prev + 1);

      // Auto-hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    },
  }));

  return (
    <View style={{ flex: 1 }}>
      {children}
      {showConfetti && (
        <ConfettiCannon
          key={confettiKey}
          count={defaultConfig.count}
          origin={{ x: defaultConfig.origin.x, y: defaultConfig.origin.y }}
          explosionSpeed={350}
          fallSpeed={3000}
          fadeOut={true}
          colors={defaultConfig.colors}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </View>
  );
});
