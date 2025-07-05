import React from 'react';
import { TouchableOpacity, Text, Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { LoadingDots } from '../Animation/LoadingDots';

interface FormButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  scale?: Animated.Value;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  loadingText = 'Carregando',
  disabled = false,
  scale,
  onPressIn,
  onPressOut,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: theme.spacing.md,
    },
    button: {
      height: 56,
      width: '100%',
      borderRadius: theme.borderRadius.md,
      backgroundColor: isLoading ? theme.colors.primaryDark : theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const buttonContent = isLoading ? (
    <View style={styles.loadingContainer}>
      <Text style={styles.buttonText}>{loadingText}</Text>
      <LoadingDots isVisible={isLoading} />
    </View>
  ) : (
    <Text style={styles.buttonText}>{title}</Text>
  );

  if (scale) {
    return (
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          disabled={disabled || isLoading}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.8}
        >
          {buttonContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {buttonContent}
      </TouchableOpacity>
    </View>
  );
};