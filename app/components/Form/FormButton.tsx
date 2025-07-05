import React from 'react';
import { TouchableOpacity, Text, Animated, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { LoadingDots } from '../Animation/LoadingDots';

interface FormButtonProps {
  readonly title: string;
  readonly onPress: () => void;
  readonly isLoading?: boolean;
  readonly loadingText?: string;
  readonly disabled?: boolean;
  readonly scale?: Animated.Value;
  readonly onPressIn?: () => void;
  readonly onPressOut?: () => void;
}


interface ButtonStateConfiguration {
  readonly isDisabled: boolean;
  readonly isLoading: boolean;
  readonly hasScaleAnimation: boolean;
}


interface ButtonLayoutConfiguration {
  readonly containerMarginTop: number;
  readonly buttonHeight: number;
  readonly buttonBorderRadius: number;
  readonly activeOpacity: number;
}

interface ButtonTypographyConfiguration {
  readonly textFontSize: number;
  readonly textFontFamily: string;
  readonly textFontWeight: '600';
}

interface ButtonColorConfiguration {
  readonly backgroundColor: string;
  readonly textColor: string;
}


interface ButtonTextContent {
  readonly buttonTitle: string;
  readonly loadingText: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  loadingText = 'Loading',
  disabled = false,
  scale,
  onPressIn,
  onPressOut,
}) => {

  const { theme } = useTheme();

  const getButtonStateConfiguration = (): ButtonStateConfiguration => {
    return {
      isDisabled: disabled || isLoading,
      isLoading: isLoading,
      hasScaleAnimation: Boolean(scale),
    };
  };


  const getButtonLayoutConfiguration = (): ButtonLayoutConfiguration => {
    return {
      containerMarginTop: theme.spacing.md,
      buttonHeight: 56,
      buttonBorderRadius: theme.borderRadius.md,
      activeOpacity: 0.8,
    };
  };


  const getButtonTypographyConfiguration = (): ButtonTypographyConfiguration => {
    return {
      textFontSize: theme.typography.sizes.lg,
      textFontFamily: theme.typography.fontFamily,
      textFontWeight: '600',
    };
  };


  const getButtonColorConfiguration = (stateConfig: ButtonStateConfiguration): ButtonColorConfiguration => {
    return {
      backgroundColor: stateConfig.isLoading ? theme.colors.primaryDark : theme.colors.accent,
      textColor: '#FFFFFF',
    };
  };


  const getButtonTextContent = (): ButtonTextContent => {
    return {
      buttonTitle: title,
      loadingText: loadingText,
    };
  };


  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getButtonLayoutConfiguration();

    return {
      marginTop: layoutConfig.containerMarginTop,
    };
  };

  const createButtonStyles = (colorConfig: ButtonColorConfiguration): ViewStyle => {
    const layoutConfig = getButtonLayoutConfiguration();

    return {
      height: layoutConfig.buttonHeight,
      width: '100%',
      borderRadius: layoutConfig.buttonBorderRadius,
      backgroundColor: colorConfig.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    };
  };

  const createButtonTextStyles = (
    typographyConfig: ButtonTypographyConfiguration,
    colorConfig: ButtonColorConfiguration
  ): TextStyle => {
    return {
      color: colorConfig.textColor,
      fontSize: typographyConfig.textFontSize,
      fontFamily: typographyConfig.textFontFamily,
      fontWeight: typographyConfig.textFontWeight,
    };
  };

  const createLoadingContainerStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  const createScaleAnimationTransform = (): { transform: Array<{ scale: Animated.Value }> } => {
    return {
      transform: [{ scale: scale! }],
    };
  };


  const createDynamicStylesheet = (stateConfig: ButtonStateConfiguration) => {
    const colorConfig = getButtonColorConfiguration(stateConfig);
    const typographyConfig = getButtonTypographyConfiguration();

    return StyleSheet.create({
      container: createContainerStyles(),
      button: createButtonStyles(colorConfig),
      buttonText: createButtonTextStyles(typographyConfig, colorConfig),
      loadingContainer: createLoadingContainerStyles(),
    });
  };


  const handleButtonPressAction = (): void => {
    onPress();
  };

  const handleButtonPressInAction = (): void => {
    if (onPressIn) {
      onPressIn();
    }
  };

  const handleButtonPressOutAction = (): void => {
    if (onPressOut) {
      onPressOut();
    }
  };

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

  const renderLoadingContentWithDots = (
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

  const renderButtonContentBasedOnState = (
    styles: any,
    textContent: ButtonTextContent,
    stateConfig: ButtonStateConfiguration
  ): React.ReactElement => {
    if (stateConfig.isLoading) {
      return renderLoadingContentWithDots(
        styles.buttonText,
        styles.loadingContainer,
        textContent,
        stateConfig
      );
    }

    return renderButtonTitleText(styles.buttonText, textContent);
  };

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


  const renderAnimatedButtonContainer = (
    containerStyles: ViewStyle,
    scaleTransform: any,
    touchableButton: React.ReactElement
  ): React.ReactElement => {
    return (
      <Animated.View style={[containerStyles, scaleTransform]}>
        {touchableButton}
      </Animated.View>
    );
  };

  const renderStaticButtonContainer = (
    containerStyles: ViewStyle,
    touchableButton: React.ReactElement
  ): React.ReactElement => {
    return (
      <View style={containerStyles}>
        {touchableButton}
      </View>
    );
  };


  const renderButtonContainerBasedOnAnimationState = (
    containerStyles: ViewStyle,
    touchableButton: React.ReactElement,
    stateConfig: ButtonStateConfiguration
  ): React.ReactElement => {
    if (stateConfig.hasScaleAnimation) {
      const scaleTransform = createScaleAnimationTransform();
      return renderAnimatedButtonContainer(containerStyles, scaleTransform, touchableButton);
    }

    return renderStaticButtonContainer(containerStyles, touchableButton);
  };

  const stateConfiguration = getButtonStateConfiguration();
  const layoutConfiguration = getButtonLayoutConfiguration();
  const dynamicStyles = createDynamicStylesheet(stateConfiguration);
  const textContent = getButtonTextContent();

  const buttonContent = renderButtonContentBasedOnState(
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

  const buttonContainer = renderButtonContainerBasedOnAnimationState(
    dynamicStyles.container,
    touchableButton,
    stateConfiguration
  );

  return buttonContainer;
};