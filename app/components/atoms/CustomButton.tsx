import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ButtonProps } from '@/app/types';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoadingDots } from './LoadingDots';

export const CustomButton: React.FC<ButtonProps & { 
  animatedStyle?: any;
  onPressIn?: () => void;
  onPressOut?: () => void;
}> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  animatedStyle,
  onPressIn,
  onPressOut,
}) => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
    },
    button: {
      height: responsive.isTablet ? 64 : 56,
      width: '100%',
      borderRadius: theme.borderRadius.md,
      backgroundColor: loading 
        ? theme.colors.primaryDark 
        : theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.xl 
        : theme.typography.sizes.lg,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>Criando conta</Text>
            <LoadingDots isVisible={loading} />
          </View>
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};