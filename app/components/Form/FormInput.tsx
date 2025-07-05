import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../providers/ThemeProvider';


interface FormInputProps {
  readonly placeholder: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly error?: string;
  readonly keyboardType?: TextInputProps['keyboardType'];
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  readonly secureTextEntry?: boolean;
  readonly returnKeyType?: TextInputProps['returnKeyType'];
  readonly onSubmitEditing?: (e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  readonly maxLength?: number;
  readonly autoCorrect?: boolean;
}


interface InputFieldConfiguration {
  readonly defaultKeyboardType: TextInputProps['keyboardType'];
  readonly defaultAutoCapitalize: TextInputProps['autoCapitalize'];
  readonly defaultSecureTextEntry: boolean;
  readonly defaultReturnKeyType: TextInputProps['returnKeyType'];
  readonly defaultAutoCorrect: boolean;
  readonly inputHeight: number;
  readonly errorIconSize: number;
}

interface InputFieldLayoutConfiguration {
  readonly containerMarginBottom: number;
  readonly inputPaddingHorizontal: number;
  readonly inputBorderRadius: number;
  readonly inputBorderWidth: number;
  readonly errorIconRightPosition: number;
}


interface InputFieldVisualState {
  readonly hasError: boolean;
  readonly shouldShowErrorIcon: boolean;
  readonly borderColor: string;
  readonly errorIconColor: string;
}


export const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  returnKeyType = 'next',
  onSubmitEditing,
  maxLength,
  autoCorrect = true,
}) => {

  const { theme } = useTheme();

  const getInputFieldConfiguration = (): InputFieldConfiguration => {
    return {
      defaultKeyboardType: 'default',
      defaultAutoCapitalize: 'sentences',
      defaultSecureTextEntry: false,
      defaultReturnKeyType: 'next',
      defaultAutoCorrect: true,
      inputHeight: 56,
      errorIconSize: 24,
    };
  };

  const getInputFieldLayoutConfiguration = (): InputFieldLayoutConfiguration => {
    return {
      containerMarginBottom: theme.spacing.md,
      inputPaddingHorizontal: theme.spacing.md,
      inputBorderRadius: theme.borderRadius.md,
      inputBorderWidth: 1,
      errorIconRightPosition: theme.spacing.sm,
    };
  };

  const determineInputFieldVisualState = (errorMessage?: string): InputFieldVisualState => {
    const hasError = Boolean(errorMessage);
    
    return {
      hasError,
      shouldShowErrorIcon: hasError,
      borderColor: hasError ? theme.colors.error : theme.colors.border,
      errorIconColor: theme.colors.error,
    };
  };

  const handleTextInputChange = (inputText: string): void => {
    onChangeText(inputText);
  };

  const handleTextInputSubmission = (
    event?: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): void => {
    if (onSubmitEditing) {
      onSubmitEditing(event);
    }
  };

  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getInputFieldLayoutConfiguration();
    
    return {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: layoutConfig.containerMarginBottom,
    };
  };

  const createTextInputStyles = (visualState: InputFieldVisualState): TextStyle => {
    const fieldConfig = getInputFieldConfiguration();
    const layoutConfig = getInputFieldLayoutConfiguration();
    
    return {
      flex: 1,
      height: fieldConfig.inputHeight,
      paddingHorizontal: layoutConfig.inputPaddingHorizontal,
      borderRadius: layoutConfig.inputBorderRadius,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.md,
      backgroundColor: theme.colors.surface,
      borderWidth: layoutConfig.inputBorderWidth,
      borderColor: visualState.borderColor,
      ...theme.shadows.light,
    };
  };

  const createErrorIconStyles = (): ViewStyle => {
    const layoutConfig = getInputFieldLayoutConfiguration();
    
    return {
      position: 'absolute',
      right: layoutConfig.errorIconRightPosition,
    };
  };

  const createDynamicStylesheet = (visualState: InputFieldVisualState) => {
    return StyleSheet.create({
      container: createContainerStyles(),
      textInput: createTextInputStyles(visualState),
      errorIcon: createErrorIconStyles(),
    });
  };

  const getTextInputProperties = (inputStyles: TextStyle) => {
    return {
      style: inputStyles,
      placeholder,
      placeholderTextColor: theme.colors.textSecondary,
      value,
      onChangeText: handleTextInputChange,
      keyboardType,
      autoCapitalize,
      secureTextEntry,
      returnKeyType,
      onSubmitEditing: handleTextInputSubmission,
      maxLength,
      autoCorrect,
    };
  };

  const renderTextInputField = (inputStyles: TextStyle): React.ReactElement => {
    const textInputProps = getTextInputProperties(inputStyles);
    
    return (
      <TextInput {...textInputProps} />
    );
  };

  const renderErrorIcon = (
    visualState: InputFieldVisualState,
    iconStyles: ViewStyle
  ): React.ReactElement | null => {
    if (!visualState.shouldShowErrorIcon) {
      return null;
    }

    const fieldConfig = getInputFieldConfiguration();
    
    return (
      <AlertCircle
        size={fieldConfig.errorIconSize}
        color={visualState.errorIconColor}
        style={iconStyles}
      />
    );
  };


  const renderInputFieldContainer = (
    containerStyles: ViewStyle,
    textInputElement: React.ReactElement,
    errorIconElement: React.ReactElement | null
  ): React.ReactElement => {
    return (
      <View style={containerStyles}>
        {textInputElement}
        {errorIconElement}
      </View>
    );
  };

  const visualState = determineInputFieldVisualState(error);
  const dynamicStyles = createDynamicStylesheet(visualState);
  
  const textInputElement = renderTextInputField(dynamicStyles.textInput);
  const errorIconElement = renderErrorIcon(visualState, dynamicStyles.errorIcon);
  
  const inputFieldContainer = renderInputFieldContainer(
    dynamicStyles.container,
    textInputElement,
    errorIconElement
  );

  return inputFieldContainer;
};