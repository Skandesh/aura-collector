import React, { ReactNode, createContext, useContext } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface ScreenShakeContextType {
  triggerShake: (intensity?: 'light' | 'medium' | 'heavy') => void;
}

const ScreenShakeContext = createContext<ScreenShakeContextType | undefined>(
  undefined
);

interface ScreenShakeProviderProps {
  children: ReactNode;
}

export function ScreenShakeProvider({ children }: ScreenShakeProviderProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const triggerShake = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    'worklet';

    const shakeConfig = {
      light: { distance: 2, duration: 50, springDamping: 20 },
      medium: { distance: 4, duration: 70, springDamping: 15 },
      heavy: { distance: 8, duration: 100, springDamping: 10 },
    };

    const config = shakeConfig[intensity];

    translateX.value = withSequence(
      withTiming(-config.distance, { duration: config.duration }),
      withTiming(config.distance, { duration: config.duration }),
      withTiming(-config.distance / 2, { duration: config.duration }),
      withTiming(config.distance / 2, { duration: config.duration }),
      withTiming(0, { duration: config.duration })
    );

    translateY.value = withSequence(
      withTiming(config.distance, { duration: config.duration }),
      withTiming(-config.distance, { duration: config.duration }),
      withTiming(config.distance / 2, { duration: config.duration }),
      withTiming(-config.distance / 2, { duration: config.duration }),
      withTiming(0, { duration: config.duration })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <ScreenShakeContext.Provider value={{ triggerShake }}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </ScreenShakeContext.Provider>
  );
}

export function useScreenShake() {
  const context = useContext(ScreenShakeContext);
  if (!context) {
    throw new Error('useScreenShake must be used within a ScreenShakeProvider');
  }
  return context;
}
