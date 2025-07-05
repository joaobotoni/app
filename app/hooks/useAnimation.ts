import { useState, useCallback } from 'react';
import { Animated } from 'react-native';

interface UseAnimationReturn {
  buttonScale: Animated.Value;
  animateButton: (scale: number) => void;
}

export const useAnimation = (): UseAnimationReturn => {
  const [buttonScale] = useState(new Animated.Value(1));

  const animateButton = useCallback((scale: number) => {
    Animated.spring(buttonScale, {
      toValue: scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [buttonScale]);

  return {
    buttonScale,
    animateButton,
  };
};