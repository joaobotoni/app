import React, { useState, useEffect, useCallback } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface LoadingDotsProps {
  isVisible: boolean;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  const { theme } = useTheme();
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
        ])
      );
    };

    return Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 200),
      createDotAnimation(dot3, 400),
    ]);
  }, [dot1, dot2, dot3]);

  useEffect(() => {
    if (isVisible) {
      const animation = animateDots();
      animation.start();
      return () => animation.stop();
    }
  }, [isVisible, animateDots]);

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginLeft: theme.spacing.xs,
    },
    dot: {
      color: '#FFFFFF',
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.fontFamily,
      marginHorizontal: 2,
    },
  });

  return (
    <View style={styles.container}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.dot,
            {
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