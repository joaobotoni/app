import { useTheme } from '@/app/contexts/ThemeContext';
import { useLoadingDots } from '@/app/hooks/useAnimations';
import { LoadingDotsProps } from '@/app/types';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  const { theme } = useTheme();
  const { dot1, dot2, dot3, animateDots } = useLoadingDots();

  useEffect(() => {
    if (isVisible) {
      const animation = animateDots();
      animation.start();
      return () => animation.stop();
    }
  }, [isVisible, animateDots]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.dot,
            {
              color: '#FFFFFF',
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.sizes.lg,
              transform: [{ translateY: dot }],
            },
          ]}
        >
          •
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  dot: {
    marginHorizontal: 2,
  },
});