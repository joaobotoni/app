import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { InputProps } from '@/app/types';
import { Icon } from './Icon';

/**
 * Interface for input field state configuration
 * Encapsulates input state-related properties
 */
interface InputFieldStateConfiguration {
  readonly hasError: boolean;
  readonly isSecureEntry: boolean;
  readonly hasMaxLength: boolean;
}

/**
 * Interface for responsive input dimensions
 * Defines responsive sizing properties
 */
interface ResponsiveInputDimensions {
  readonly inputHeight: number;
  readonly fontSize: number;
}

/**
 * Interface for input layout configuration
 * Defines layout and spacing properties
 */
interface InputLayoutConfiguration {
  readonly containerMarginBottom: number;
  readonly inputBorderRadius: number;
  readonly inputBorderWidth: number;
  readonly inputPaddingHorizontal: number;
  readonly errorIconSize: number;
  readonly errorIconRightPosition: number;
  readonly errorIconActiveOpacity: number;
}

/**
 * Interface for input color configuration
 * Defines color properties based on input state
 */
interface InputColorConfiguration {
  readonly borderColor: string;
  readonly textColor: string;
  readonly backgroundColor: string;
  readonly placeholderTextColor: string;
  readonly errorIconColor: string;
}

/**
 * Interface for input typography configuration
 * Defines font properties for input text
 */
interface InputTypographyConfiguration {
  readonly fontFamily: string;
}

/**
 * Interface for input padding configuration
 * Defines dynamic padding based on input state
 */
interface InputPaddingConfiguration {
  readonly paddingRight: number;
}

/**
 * CustomInput Component
 * Responsible for rendering a customizable text input with error handling and responsive design
 * Follows single responsibility principle - handles input presentation and user interaction
 */
export const CustomInput: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  returnKeyType = 'next',
  onSubmitEditing,
  maxLength,
}) => {
  // Dependency injection - similar to Java constructor injection
  const { theme } = useTheme();
  const responsive = useResponsive();

  /**
   * Private method: Get input field state configuration
   * Determines the current state of the input field based on props
   * @returns InputFieldStateConfiguration object with state properties
   */
  const getInputFieldStateConfiguration = (): InputFieldStateConfiguration => {
    return {
      hasError: Boolean(error),
      isSecureEntry: secureTextEntry,
      hasMaxLength: Boolean(maxLength),
    };
  };

  /**
   * Private method: Calculate responsive input dimensions
   * Determines input sizing based on device type
   * @returns ResponsiveInputDimensions object with responsive properties
   */
  const calculateResponsiveInputDimensions = (): ResponsiveInputDimensions => {
    const TABLET_INPUT_HEIGHT = 64;
    const MOBILE_INPUT_HEIGHT = 56;

    return {
      inputHeight: responsive.isTablet ? TABLET_INPUT_HEIGHT : MOBILE_INPUT_HEIGHT,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.lg 
        : theme.typography.sizes.md,
    };
  };

  /**
   * Private method: Get input layout configuration
   * Centralizes all layout and spacing values
   * @returns InputLayoutConfiguration object with layout properties
   */
  const getInputLayoutConfiguration = (): InputLayoutConfiguration => {
    return {
      containerMarginBottom: theme.spacing.md,
      inputBorderRadius: theme.borderRadius.md,
      inputBorderWidth: 1,
      inputPaddingHorizontal: theme.spacing.md,
      errorIconSize: 20,
      errorIconRightPosition: theme.spacing.md,
      errorIconActiveOpacity: 0.7,
    };
  };

  /**
   * Private method: Get input color configuration
   * Determines colors based on input state
   * @param stateConfig - Input field state configuration
   * @returns InputColorConfiguration object with color properties
   */
  const getInputColorConfiguration = (stateConfig: InputFieldStateConfiguration): InputColorConfiguration => {
    return {
      borderColor: stateConfig.hasError ? theme.colors.error : theme.colors.border,
      textColor: theme.colors.text,
      backgroundColor: theme.colors.surface,
      placeholderTextColor: theme.colors.textSecondary,
      errorIconColor: theme.colors.error,
    };
  };

  /**
   * Private method: Get input typography configuration
   * Centralizes all font-related properties
   * @returns InputTypographyConfiguration object with typography properties
   */
  const getInputTypographyConfiguration = (): InputTypographyConfiguration => {
    return {
      fontFamily: theme.typography.fontFamily,
    };
  };

  /**
   * Private method: Calculate input padding configuration
   * Determines padding based on error state to accommodate error icon
   * @param stateConfig - Input field state configuration
   * @param layoutConfig - Input layout configuration
   * @returns InputPaddingConfiguration object with padding properties
   */
  const calculateInputPaddingConfiguration = (
    stateConfig: InputFieldStateConfiguration,
    layoutConfig: InputLayoutConfiguration
  ): InputPaddingConfiguration => {
    const ERROR_ICON_SPACE = 48;

    return {
      paddingRight: stateConfig.hasError 
        ? ERROR_ICON_SPACE 
        : layoutConfig.inputPaddingHorizontal,
    };
  };

  /**
   * Private method: Create container styles
   * Encapsulates container styling logic
   * @returns ViewStyle object for main container
   */
  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getInputLayoutConfiguration();

    return {
      marginBottom: layoutConfig.containerMarginBottom,
    };
  };

  /**
   * Private method: Create input container styles
   * Encapsulates input container styling logic
   * @returns ViewStyle object for input container
   */
  const createInputContainerStyles = (): ViewStyle => {
    return {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    };
  };

  /**
   * Private method: Create text input styles
   * Encapsulates text input styling logic with responsive dimensions
   * @param dimensions - Responsive input dimensions
   * @param colorConfig - Input color configuration
   * @param typographyConfig - Input typography configuration
   * @param paddingConfig - Input padding configuration
   * @returns TextStyle object for text input
   */
  const createTextInputStyles = (
    dimensions: ResponsiveInputDimensions,
    colorConfig: InputColorConfiguration,
    typographyConfig: InputTypographyConfiguration,
    paddingConfig: InputPaddingConfiguration
  ): TextStyle => {
    const layoutConfig = getInputLayoutConfiguration();

    return {
      flex: 1,
      height: dimensions.inputHeight,
      paddingHorizontal: layoutConfig.inputPaddingHorizontal,
      paddingRight: paddingConfig.paddingRight,
      borderRadius: layoutConfig.inputBorderRadius,
      color: colorConfig.textColor,
      fontFamily: typographyConfig.fontFamily,
      fontSize: dimensions.fontSize,
      backgroundColor: colorConfig.backgroundColor,
      borderWidth: layoutConfig.inputBorderWidth,
      borderColor: colorConfig.borderColor,
      ...theme.shadows.light,
    };
  };

  /**
   * Private method: Create error icon container styles
   * Encapsulates error icon container styling logic
   * @returns ViewStyle object for error icon container
   */
  const createErrorIconContainerStyles = (): ViewStyle => {
    const layoutConfig = getInputLayoutConfiguration();

    return {
      position: 'absolute',
      right: layoutConfig.errorIconRightPosition,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @param stateConfig - Input field state configuration
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = (stateConfig: InputFieldStateConfiguration) => {
    const dimensions = calculateResponsiveInputDimensions();
    const layoutConfig = getInputLayoutConfiguration();
    const colorConfig = getInputColorConfiguration(stateConfig);
    const typographyConfig = getInputTypographyConfiguration();
    const paddingConfig = calculateInputPaddingConfiguration(stateConfig, layoutConfig);

    return StyleSheet.create({
      container: createContainerStyles(),
      inputContainer: createInputContainerStyles(),
      textInput: createTextInputStyles(dimensions, colorConfig, typographyConfig, paddingConfig),
      errorIconContainer: createErrorIconContainerStyles(),
    });
  };

  /**
   * Private method: Handle text input change
   * Encapsulates text change logic
   * @param inputText - The new text value
   */
  const handleTextInputChange = (inputText: string): void => {
    onChangeText(inputText);
  };

  /**
   * Private method: Handle text input submission
   * Encapsulates submit editing logic with null safety
   */
  const handleTextInputSubmission = (): void => {
    if (onSubmitEditing) {
      onSubmitEditing();
    }
  };

  /**
   * Private method: Get text input properties
   * Centralizes all TextInput props for better organization
   * @param inputStyles - Styles for the text input
   * @param colorConfig - Input color configuration
   * @param layoutConfig - Input layout configuration
   * @returns Object with all TextInput properties
   */
  const getTextInputProperties = (
    inputStyles: TextStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration
  ) => {
    return {
      style: inputStyles,
      placeholderTextColor: colorConfig.placeholderTextColor,
      placeholder,
      value,
      onChangeText: handleTextInputChange,
      keyboardType,
      secureTextEntry,
      autoCapitalize,
      autoCorrect,
      returnKeyType,
      onSubmitEditing: handleTextInputSubmission,
      maxLength,
    };
  };

  /**
   * Private method: Render text input field
   * Encapsulates text input rendering logic
   * @param inputStyles - Styles for text input
   * @param colorConfig - Input color configuration
   * @param layoutConfig - Input layout configuration
   * @returns React.ReactElement containing text input
   */
  const renderTextInputField = (
    inputStyles: TextStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration
  ): React.ReactElement => {
    const textInputProps = getTextInputProperties(inputStyles, colorConfig, layoutConfig);

    return (
      <TextInput {...textInputProps} />
    );
  };

  /**
   * Private method: Render error icon element
   * Encapsulates error icon rendering logic
   * @param iconContainerStyles - Styles for icon container
   * @param colorConfig - Input color configuration
   * @param layoutConfig - Input layout configuration
   * @returns React.ReactElement containing error icon
   */
  const renderErrorIconElement = (
    iconContainerStyles: ViewStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration
  ): React.ReactElement => {
    return (
      <TouchableOpacity 
        style={iconContainerStyles}
        activeOpacity={layoutConfig.errorIconActiveOpacity}
      >
        <Icon 
          name="alert-circle"
          size={layoutConfig.errorIconSize}
          color={colorConfig.errorIconColor}
        />
      </TouchableOpacity>
    );
  };

  /**
   * Private method: Render error icon based on state
   * Determines whether to render error icon based on error state
   * @param stateConfig - Input field state configuration
   * @param iconContainerStyles - Styles for icon container
   * @param colorConfig - Input color configuration
   * @param layoutConfig - Input layout configuration
   * @returns React.ReactElement containing error icon or null
   */
  const renderErrorIconBasedOnState = (
    stateConfig: InputFieldStateConfiguration,
    iconContainerStyles: ViewStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration
  ): React.ReactElement | null => {
    if (!stateConfig.hasError) {
      return null;
    }

    return renderErrorIconElement(iconContainerStyles, colorConfig, layoutConfig);
  };

  /**
   * Private method: Render input container with elements
   * Orchestrates the rendering of input container with text input and error icon
   * @param inputContainerStyles - Styles for input container
   * @param textInputElement - Text input element
   * @param errorIconElement - Error icon element or null
   * @returns React.ReactElement containing input container
   */
  const renderInputContainerWithElements = (
    inputContainerStyles: ViewStyle,
    textInputElement: React.ReactElement,
    errorIconElement: React.ReactElement | null
  ): React.ReactElement => {
    return (
      <View style={inputContainerStyles}>
        {textInputElement}
        {errorIconElement}
      </View>
    );
  };

  /**
   * Private method: Render main container with input
   * Encapsulates the main container rendering logic
   * @param containerStyles - Styles for main container
   * @param inputContainer - Input container element
   * @returns React.ReactElement containing complete input component
   */
  const renderMainContainerWithInput = (
    containerStyles: ViewStyle,
    inputContainer: React.ReactElement
  ): React.ReactElement => {
    return (
      <View style={containerStyles}>
        {inputContainer}
      </View>
    );
  };

  // Main render method - similar to Java's main execution method
  const stateConfiguration = getInputFieldStateConfiguration();
  const layoutConfiguration = getInputLayoutConfiguration();
  const colorConfiguration = getInputColorConfiguration(stateConfiguration);
  const dynamicStyles = createDynamicStylesheet(stateConfiguration);

  const textInputElement = renderTextInputField(
    dynamicStyles.textInput,
    colorConfiguration,
    layoutConfiguration
  );

  const errorIconElement = renderErrorIconBasedOnState(
    stateConfiguration,
    dynamicStyles.errorIconContainer,
    colorConfiguration,
    layoutConfiguration
  );

  const inputContainer = renderInputContainerWithElements(
    dynamicStyles.inputContainer,
    textInputElement,
    errorIconElement
  );

  const mainContainer = renderMainContainerWithInput(
    dynamicStyles.container,
    inputContainer
  );

  return mainContainer;
};