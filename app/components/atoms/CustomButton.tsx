import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ButtonProps } from '@/app/types';
import { LoadingDots } from './LoadingDots';

interface CustomButtonProps extends ButtonProps {
  readonly animatedStyle?: any;
  readonly onPressIn?: () => void;
  readonly onPressOut?: () => void;
}

interface ButtonStateConfig {
  readonly isDisabled: boolean;
  readonly isLoading: boolean;
}

interface ButtonDimensions {
  readonly height: number;
  readonly fontSize: number;
}

interface ButtonLayoutConfig {
  readonly marginTop: number;
  readonly borderRadius: number;
  readonly activeOpacity: number;
  readonly maxWidth: number;
}

interface ButtonColorConfig {
  readonly backgroundColor: string;
  readonly textColor: string;
}

interface ButtonTypographyConfig {
  readonly fontFamily: string;
  readonly fontWeight: '600';
}

interface ButtonTextContent {
  readonly title: string;
  readonly loadingText: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
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

  // --- Configurações ---
  const getStateConfig = (): ButtonStateConfig => ({
    isDisabled: disabled || loading,
    isLoading: loading,
  });

  const getDimensions = (): ButtonDimensions => {
    const screenWidth = responsive.screenWidth;
    if (screenWidth >= 1024) {
      return { height: 48, fontSize: theme.typography.sizes.md };
    }
    if (responsive.isTablet) {
      return { height: 64, fontSize: theme.typography.sizes.xl };
    }
    return { height: 56, fontSize: theme.typography.sizes.lg };
  };

  const getLayoutConfig = (): ButtonLayoutConfig => ({
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    activeOpacity: 0.8,
    maxWidth: 360,
  });

  const getColorConfig = (state: ButtonStateConfig): ButtonColorConfig => ({
    backgroundColor: state.isLoading ? theme.colors.primaryDark : theme.colors.accent,
    textColor: '#FFF',
  });

  const getTypographyConfig = (): ButtonTypographyConfig => ({
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
  });

  const getTextContent = (): ButtonTextContent => ({
    title,
    loadingText: 'Creating account',
  });

  // --- Estilos Dinâmicos ---
  const createContainerStyle = (): ViewStyle => {
    const layout = getLayoutConfig();
    return {
      marginTop: layout.marginTop,
      width: '100%',
      maxWidth: layout.maxWidth,
      alignSelf: 'center',
    };
  };

  const createButtonStyle = (
    dimensions: ButtonDimensions,
    colors: ButtonColorConfig,
    layout: ButtonLayoutConfig
  ): ViewStyle => ({
    height: dimensions.height,
    width: '100%',
    backgroundColor: colors.backgroundColor,
    borderRadius: layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  });

  const createTextStyle = (
    dimensions: ButtonDimensions,
    colors: ButtonColorConfig,
    typography: ButtonTypographyConfig
  ): TextStyle => ({
    color: colors.textColor,
    fontSize: dimensions.fontSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight,
  });

  const createLoadingContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // --- Handlers ---
  const handlePress = (): void => onPress();

  const handlePressIn = (): void => {
    if (onPressIn) onPressIn();
  };

  const handlePressOut = (): void => {
    if (onPressOut) onPressOut();
  };

  // --- Render ---
  const renderButtonText = (textStyle: TextStyle, content: ButtonTextContent) => (
    <Text style={textStyle}>{content.title}</Text>
  );

  const renderLoadingContent = (
    textStyle: TextStyle,
    loadingContainerStyle: ViewStyle,
    content: ButtonTextContent
  ) => (
    <Animated.View style={loadingContainerStyle}>
      <Text style={textStyle}>{content.loadingText}</Text>
      <LoadingDots isVisible />
    </Animated.View>
  );

  // --- Execução principal ---
  const state = getStateConfig();
  const dimensions = getDimensions();
  const layout = getLayoutConfig();
  const colors = getColorConfig(state);
  const typography = getTypographyConfig();
  const textContent = getTextContent();

  const containerStyle = createContainerStyle();
  const buttonStyle = createButtonStyle(dimensions, colors, layout);
  const textStyle = createTextStyle(dimensions, colors, typography);
  const loadingContainerStyle = createLoadingContainerStyle();

  const buttonContent = state.isLoading
    ? renderLoadingContent(textStyle, loadingContainerStyle, textContent)
    : renderButtonText(textStyle, textContent);

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        disabled={state.isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={layout.activeOpacity}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;
