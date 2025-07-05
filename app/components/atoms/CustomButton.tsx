import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ButtonProps } from '@/app/types';
import { LoadingDots } from './LoadingDots';

/**
 * Interface for CustomButton component props
 * Extends base ButtonProps with additional animation and interaction properties
 */
interface CustomButtonProps extends ButtonProps {
  readonly animatedStyle?: any;
  readonly onPressIn?: () => void;
  readonly onPressOut?: () => void;
}

/**
 * Interface for button state configuration
 * Encapsulates button state-related properties
 */
interface ButtonStateConfiguration {
  readonly isDisabled: boolean;
  readonly isLoading: boolean;
  readonly hasAnimatedStyle: boolean;
  readonly buttonVariant: string;
}

/**
 * Interface for responsive button dimensions
 * Defines responsive sizing properties
 */
interface ResponsiveButtonDimensions {
  readonly buttonHeight: number;
  readonly fontSize: number;
}

/**
 * Interface for button layout configuration
 * Defines layout and spacing properties
 */
interface ButtonLayoutConfiguration {
  readonly containerMarginTop: number;
  readonly buttonBorderRadius: number;
  readonly activeOpacity: number;
}

/**
 * Interface for button color configuration
 * Defines color properties based on button state
 */
interface ButtonColorConfiguration {
  readonly backgroundColor: string;
  readonly textColor: string;
}

/**
 * Interface for button typography configuration
 * Defines font properties for button text
 */
interface ButtonTypographyConfiguration {
  readonly fontFamily: string;
  readonly fontWeight: '600';
}

/**
 * Interface for button text content
 * Centralizes all text content for the button
 */
interface ButtonTextContent {
  readonly buttonTitle: string;
  readonly loadingText: string;
}

/**
 * CustomButton Component
 * Responsible for rendering a customizable button with loading states, animations and responsive design
 * Follows single responsibility principle - handles button presentation and user interaction
 */
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
  // Dependency injection - similar to Java constructor injection
  const { theme } = useTheme();
  const responsive = useResponsive();

  /**
   * Private method: Get button state configuration
   * Determines the current state of the button based on props
   * @returns ButtonStateConfiguration object with state properties
   */
  const getButtonStateConfiguration = (): ButtonStateConfiguration => {
    return {
      isDisabled: disabled || loading,
      isLoading: loading,
      hasAnimatedStyle: Boolean(animatedStyle),
      buttonVariant: variant,
    };
  };

  /**
   * Private method: Calculate responsive button dimensions
   * Determines button sizing based on device type
   * @returns ResponsiveButtonDimensions object with responsive properties
   */
  const calculateResponsiveButtonDimensions = (): ResponsiveButtonDimensions => {
    const TABLET_BUTTON_HEIGHT = 64;
    const MOBILE_BUTTON_HEIGHT = 56;

    return {
      buttonHeight: responsive.isTablet ? TABLET_BUTTON_HEIGHT : MOBILE_BUTTON_HEIGHT,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.xl 
        : theme.typography.sizes.lg,
    };
  };

  /**
   * Private method: Get button layout configuration
   * Centralizes all layout and spacing values
   * @returns ButtonLayoutConfiguration object with layout properties
   */
  const getButtonLayoutConfiguration = (): ButtonLayoutConfiguration => {
    return {
      containerMarginTop: theme.spacing.md,
      buttonBorderRadius: theme.borderRadius.md,
      activeOpacity: 0.8,
    };
  };

  /**
   * Private method: Get button color configuration
   * Determines colors based on button state and variant
   * @param stateConfig - Button state configuration
   * @returns ButtonColorConfiguration object with color properties
   */
  const getButtonColorConfiguration = (stateConfig: ButtonStateConfiguration): ButtonColorConfiguration => {
    return {
      backgroundColor: stateConfig.isLoading 
        ? theme.colors.primaryDark 
        : theme.colors.accent,
      textColor: '#FFFFFF',
    };
  };

  /**
   * Private method: Get button typography configuration
   * Centralizes all font-related properties
   * @returns ButtonTypographyConfiguration object with typography properties
   */
  const getButtonTypographyConfiguration = (): ButtonTypographyConfiguration => {
    return {
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    };
  };

  /**
   * Private method: Get button text content
   * Centralizes text content extraction and processing
   * @returns ButtonTextContent object with processed text
   */
  const getButtonTextContent = (): ButtonTextContent => {
    return {
      buttonTitle: title,
      loadingText: 'Creating account',
    };
  };

  /**
   * Private method: Create container styles
   * Encapsulates container styling logic
   * @returns ViewStyle object for container
   */
  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getButtonLayoutConfiguration();

    return {
      marginTop: layoutConfig.containerMarginTop,
    };
  };

  /**
   * Private method: Create button styles
   * Encapsulates button styling logic with responsive dimensions
   * @param dimensions - Responsive button dimensions
   * @param colorConfig - Button color configuration
   * @returns ViewStyle object for button
   */
  const createButtonStyles = (
    dimensions: ResponsiveButtonDimensions,
    colorConfig: ButtonColorConfiguration
  ): ViewStyle => {
    const layoutConfig = getButtonLayoutConfiguration();

    return {
      height: dimensions.buttonHeight,
      width: '100%',
      borderRadius: layoutConfig.buttonBorderRadius,
      backgroundColor: colorConfig.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    };
  };

  /**
   * Private method: Create button text styles
   * Encapsulates button text styling logic
   * @param dimensions - Responsive button dimensions
   * @param colorConfig - Button color configuration
   * @param typographyConfig - Button typography configuration
   * @returns TextStyle object for button text
   */
  const createButtonTextStyles = (
    dimensions: ResponsiveButtonDimensions,
    colorConfig: ButtonColorConfiguration,
    typographyConfig: ButtonTypographyConfiguration
  ): TextStyle => {
    return {
      color: colorConfig.textColor,
      fontSize: dimensions.fontSize,
      fontFamily: typographyConfig.fontFamily,
      fontWeight: typographyConfig.fontWeight,
    };
  };

  /**
   * Private method: Create loading container styles
   * Encapsulates loading container styling logic
   * @returns ViewStyle object for loading container
   */
  const createLoadingContainerStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @param stateConfig - Button state configuration
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = (stateConfig: ButtonStateConfiguration) => {
    const dimensions = calculateResponsiveButtonDimensions();
    const colorConfig = getButtonColorConfiguration(stateConfig);
    const typographyConfig = getButtonTypographyConfiguration();

    return StyleSheet.create({
      container: createContainerStyles(),
      button: createButtonStyles(dimensions, colorConfig),
      buttonText: createButtonTextStyles(dimensions, colorConfig, typographyConfig),
      loadingContainer: createLoadingContainerStyles(),
    });
  };

  /**
   * Private method: Handle button press action
   * Encapsulates button press logic
   */
  const handleButtonPressAction = (): void => {
    onPress();
  };

  /**
   * Private method: Handle button press in action
   * Encapsulates button press in logic with null safety
   */
  const handleButtonPressInAction = (): void => {
    if (onPressIn) {
      onPressIn();
    }
  };

  /**
   * Private method: Handle button press out action
   * Encapsulates button press out logic with null safety
   */
  const handleButtonPressOutAction = (): void => {
    if (onPressOut) {
      onPressOut();
    }
  };

  /**
   * Private method: Render button title text
   * Encapsulates button title rendering logic
   * @param textStyles - Styles for button text
   * @param textContent - Button text content
   * @returns React.ReactElement containing button title
   */
  const renderButtonTitleText = (
    textStyles: TextStyle,
    textContent: ButtonTextContent
  ): React.ReactElement => {
    return (
      <Text style={textStyles}>
        {textContent.buttonTitle}
      </Text>
    );
  };

  /**
   * Private method: Render loading content with text and dots
   * Encapsulates loading content rendering logic
   * @param textStyles - Styles for loading text
   * @param loadingContainerStyles - Styles for loading container
   * @param textContent - Button text content
   * @param stateConfig - Button state configuration
   * @returns React.ReactElement containing loading content
   */
  const renderLoadingContentWithTextAndDots = (
    textStyles: TextStyle,
    loadingContainerStyles: ViewStyle,
    textContent: ButtonTextContent,
    stateConfig: ButtonStateConfiguration
  ): React.ReactElement => {
    return (
      <View style={loadingContainerStyles}>
        <Text style={textStyles}>
          {textContent.loadingText}
        </Text>
        <LoadingDots isVisible={stateConfig.isLoading} />
      </View>
    );
  };

  /**
   * Private method: Render button content based on loading state
   * Determines which content to render based on loading state
   * @param styles - Dynamic stylesheet
   * @param textContent - Button text content
   * @param stateConfig - Button state configuration
   * @returns React.ReactElement containing appropriate button content
   */
  const renderButtonContentBasedOnLoadingState = (
    styles: any,
    textContent: ButtonTextContent,
    stateConfig: ButtonStateConfiguration
  ): React.ReactElement => {
    if (stateConfig.isLoading) {
      return renderLoadingContentWithTextAndDots(
        styles.buttonText,
        styles.loadingContainer,
        textContent,
        stateConfig
      );
    }

    return renderButtonTitleText(styles.buttonText, textContent);
  };

  /**
   * Private method: Render touchable button element
   * Encapsulates touchable button rendering logic
   * @param buttonStyles - Styles for button
   * @param buttonContent - Button content element
   * @param stateConfig - Button state configuration
   * @param layoutConfig - Button layout configuration
   * @returns React.ReactElement containing touchable button
   */
  const renderTouchableButtonElement = (
    buttonStyles: ViewStyle,
    buttonContent: React.ReactElement,
    stateConfig: ButtonStateConfiguration,
    layoutConfig: ButtonLayoutConfiguration
  ): React.ReactElement => {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={handleButtonPressAction}
        disabled={stateConfig.isDisabled}
        onPressIn={handleButtonPressInAction}
        onPressOut={handleButtonPressOutAction}
        activeOpacity={layoutConfig.activeOpacity}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  };

  /**
   * Private method: Render animated button container
   * Encapsulates animated container rendering logic
   * @param containerStyles - Styles for container
   * @param animationStyles - Animation styles
   * @param touchableButton - Touchable button element
   * @returns React.ReactElement containing animated container
   */
  const renderAnimatedButtonContainer = (
    containerStyles: ViewStyle,
    animationStyles: any,
    touchableButton: React.ReactElement
  ): React.ReactElement => {
    return (
      <Animated.View style={[containerStyles, animationStyles]}>
        {touchableButton}
      </Animated.View>
    );
  };

  // Main render method - similar to Java's main execution method
  const stateConfiguration = getButtonStateConfiguration();
  const layoutConfiguration = getButtonLayoutConfiguration();
  const dynamicStyles = createDynamicStylesheet(stateConfiguration);
  const textContent = getButtonTextContent();

  const buttonContent = renderButtonContentBasedOnLoadingState(
    dynamicStyles,
    textContent,
    stateConfiguration
  );

  const touchableButton = renderTouchableButtonElement(
    dynamicStyles.button,
    buttonContent,
    stateConfiguration,
    layoutConfiguration
  );

  const animatedButtonContainer = renderAnimatedButtonContainer(
    dynamicStyles.container,
    animatedStyle,
    touchableButton
  );

  return animatedButtonContainer;
};