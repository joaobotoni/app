import { useState, useCallback } from 'react';
import { Animated } from 'react-native';

export const useLoadingDots = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  const animateDots = useCallback(() => {
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    return Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 200),
      createDotAnimation(dot3, 400),
    ]);
  }, [dot1, dot2, dot3]);

  return { dot1, dot2, dot3, animateDots };
};

export const useButtonAnimation = () => {
  const [buttonScale] = useState(new Animated.Value(1));

  const animateButton = useCallback((scale: number) => {
    Animated.spring(buttonScale, {
      toValue: scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [buttonScale]);

  return { buttonScale, animateButton };
};

export const useModalAnimation = () => {
  const [scaleAnim] = useState(new Animated.Value(0));

  const showModalAnimation = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [scaleAnim]);

  const hideModalAnimation = useCallback(() => {
    scaleAnim.setValue(0);
  }, [scaleAnim]);

  return { scaleAnim, showModalAnimation, hideModalAnimation };
};