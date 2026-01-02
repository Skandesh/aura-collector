import React, { useCallback, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { FloatingText, FloatingTextItem } from './FloatingText';

interface FloatingTextManagerProps {
  children: React.ReactNode;
}

export function FloatingTextManager({ children }: FloatingTextManagerProps) {
  const [floatingItems, setFloatingItems] = useState<FloatingTextItem[]>([]);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const addFloatingText = useCallback(
    (
      text: string,
      type: FloatingTextItem['type'],
      position?: { x: number; y: number }
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const x = position?.x ?? Math.random() * (screenWidth - 100) + 50;
      const y = position?.y ?? screenHeight * 0.3; // Start from middle-top area

      const newItem: FloatingTextItem = {
        id,
        text,
        type,
        x,
        y,
      };

      setFloatingItems((prev) => {
        const newItems = [...prev, newItem];

        // Limit to 5 concurrent animations
        if (newItems.length > 5) {
          return newItems.slice(-5);
        }

        return newItems;
      });
    },
    [screenWidth, screenHeight]
  );

  const removeFloatingItem = useCallback((id: string) => {
    setFloatingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Expose the addFloatingText function globally
  React.useEffect(() => {
    if (typeof global !== 'undefined') {
      (global as any).addFloatingText = addFloatingText;
    }

    return () => {
      if (typeof global !== 'undefined') {
        delete (global as any).addFloatingText;
      }
    };
  }, [addFloatingText]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      <FloatingText
        items={floatingItems}
        onAnimationComplete={removeFloatingItem}
      />
    </View>
  );
}

// Export the addFloatingText function for use in other components
export const useFloatingText = () => {
  const addFloatingText = (global as any).addFloatingText;
  return addFloatingText;
};
