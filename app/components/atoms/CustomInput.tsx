"use client"

import type React from "react"
import { StyleSheet, TextInput, TouchableOpacity, View, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "@/app/contexts/ThemeContext"
import { useResponsive } from "@/app/hooks/useResponsive"
import type { InputProps } from "@/app/types"
import { Icon } from "./Icon"

interface InputFieldStateConfiguration {
  readonly hasError: boolean
  readonly isSecureEntry: boolean
  readonly hasMaxLength: boolean
}

interface ResponsiveInputDimensions {
  readonly inputHeight: number
  readonly fontSize: number
}

interface InputLayoutConfiguration {
  readonly containerMarginBottom: number
  readonly inputBorderRadius: number
  readonly inputBorderWidth: number
  readonly inputPaddingHorizontal: number
  readonly errorIconSize: number
  readonly errorIconRightPosition: number
  readonly errorIconActiveOpacity: number
}

interface InputColorConfiguration {
  readonly borderColor: string
  readonly textColor: string
  readonly backgroundColor: string
  readonly placeholderTextColor: string
  readonly errorIconColor: string
}

interface InputTypographyConfiguration {
  readonly fontFamily: string
}

interface InputPaddingConfiguration {
  readonly paddingRight: number
}

const CustomInput: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  autoCorrect = false,
  returnKeyType = "next",
  onSubmitEditing,
  maxLength,
}) => {
  const { theme } = useTheme()
  const responsive = useResponsive()

  const getInputFieldStateConfiguration = (): InputFieldStateConfiguration => {
    return {
      hasError: Boolean(error),
      isSecureEntry: secureTextEntry,
      hasMaxLength: Boolean(maxLength),
    }
  }

  const calculateResponsiveInputDimensions = (): ResponsiveInputDimensions => {
    const TABLET_INPUT_HEIGHT = 64
    const MOBILE_INPUT_HEIGHT = 56
    return {
      inputHeight: responsive.isTablet ? TABLET_INPUT_HEIGHT : MOBILE_INPUT_HEIGHT,
      fontSize: responsive.isTablet ? theme.typography.sizes.lg : theme.typography.sizes.md,
    }
  }

  const getInputLayoutConfiguration = (): InputLayoutConfiguration => {
    return {
      containerMarginBottom: theme.spacing.md,
      inputBorderRadius: theme.borderRadius.md,
      inputBorderWidth: 1,
      inputPaddingHorizontal: theme.spacing.md,
      errorIconSize: 20,
      errorIconRightPosition: theme.spacing.md,
      errorIconActiveOpacity: 0.7,
    }
  }

  const getInputColorConfiguration = (stateConfig: InputFieldStateConfiguration): InputColorConfiguration => {
    return {
      borderColor: stateConfig.hasError ? theme.colors.error : theme.colors.border,
      textColor: theme.colors.text,
      backgroundColor: theme.colors.surface,
      placeholderTextColor: theme.colors.textSecondary,
      errorIconColor: theme.colors.error,
    }
  }

  const getInputTypographyConfiguration = (): InputTypographyConfiguration => {
    return {
      fontFamily: theme.typography.fontFamily,
    }
  }

  const calculateInputPaddingConfiguration = (
    stateConfig: InputFieldStateConfiguration,
    layoutConfig: InputLayoutConfiguration,
  ): InputPaddingConfiguration => {
    const ERROR_ICON_SPACE = 48
    return {
      paddingRight: stateConfig.hasError ? ERROR_ICON_SPACE : layoutConfig.inputPaddingHorizontal,
    }
  }

  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getInputLayoutConfiguration()
    return {
      marginBottom: layoutConfig.containerMarginBottom,
    }
  }

  const createInputContainerStyles = (): ViewStyle => {
    return {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
    }
  }

  const createTextInputStyles = (
    dimensions: ResponsiveInputDimensions,
    colorConfig: InputColorConfiguration,
    typographyConfig: InputTypographyConfiguration,
    paddingConfig: InputPaddingConfiguration,
  ): TextStyle => {
    const layoutConfig = getInputLayoutConfiguration()
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
    }
  }

  const createErrorIconContainerStyles = (): ViewStyle => {
    const layoutConfig = getInputLayoutConfiguration()
    return {
      position: "absolute",
      right: layoutConfig.errorIconRightPosition,
      zIndex: 1,
      justifyContent: "center",
      alignItems: "center",
    }
  }

  const createDynamicStylesheet = (stateConfig: InputFieldStateConfiguration) => {
    const dimensions = calculateResponsiveInputDimensions()
    const layoutConfig = getInputLayoutConfiguration()
    const colorConfig = getInputColorConfiguration(stateConfig)
    const typographyConfig = getInputTypographyConfiguration()
    const paddingConfig = calculateInputPaddingConfiguration(stateConfig, layoutConfig)

    return StyleSheet.create({
      container: createContainerStyles(),
      inputContainer: createInputContainerStyles(),
      textInput: createTextInputStyles(dimensions, colorConfig, typographyConfig, paddingConfig),
      errorIconContainer: createErrorIconContainerStyles(),
    })
  }

  const handleTextInputChange = (inputText: string): void => {
    onChangeText(inputText)
  }

  const handleTextInputSubmission = (): void => {
    if (onSubmitEditing) {
      onSubmitEditing()
    }
  }

  const getTextInputProperties = (
    inputStyles: TextStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration,
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
    }
  }

  const renderTextInputField = (
    inputStyles: TextStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration,
  ): React.ReactElement => {
    const textInputProps = getTextInputProperties(inputStyles, colorConfig, layoutConfig)
    return <TextInput {...textInputProps} />
  }

  const renderErrorIconElement = (
    iconContainerStyles: ViewStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration,
  ): React.ReactElement => {
    return (
      <TouchableOpacity style={iconContainerStyles} activeOpacity={layoutConfig.errorIconActiveOpacity}>
        <Icon name="alert-circle" size={layoutConfig.errorIconSize} color={colorConfig.errorIconColor} />
      </TouchableOpacity>
    )
  }

  const renderErrorIconBasedOnState = (
    stateConfig: InputFieldStateConfiguration,
    iconContainerStyles: ViewStyle,
    colorConfig: InputColorConfiguration,
    layoutConfig: InputLayoutConfiguration,
  ): React.ReactElement | null => {
    if (!stateConfig.hasError) {
      return null
    }
    return renderErrorIconElement(iconContainerStyles, colorConfig, layoutConfig)
  }

  const renderInputContainerWithElements = (
    inputContainerStyles: ViewStyle,
    textInputElement: React.ReactElement,
    errorIconElement: React.ReactElement | null,
  ): React.ReactElement => {
    return (
      <View style={inputContainerStyles}>
        {textInputElement}
        {errorIconElement}
      </View>
    )
  }

  const renderMainContainerWithInput = (
    containerStyles: ViewStyle,
    inputContainer: React.ReactElement,
  ): React.ReactElement => {
    return <View style={containerStyles}>{inputContainer}</View>
  }

  const stateConfiguration = getInputFieldStateConfiguration()
  const layoutConfiguration = getInputLayoutConfiguration()
  const colorConfiguration = getInputColorConfiguration(stateConfiguration)
  const dynamicStyles = createDynamicStylesheet(stateConfiguration)

  const textInputElement = renderTextInputField(dynamicStyles.textInput, colorConfiguration, layoutConfiguration)

  const errorIconElement = renderErrorIconBasedOnState(
    stateConfiguration,
    dynamicStyles.errorIconContainer,
    colorConfiguration,
    layoutConfiguration,
  )

  const inputContainer = renderInputContainerWithElements(
    dynamicStyles.inputContainer,
    textInputElement,
    errorIconElement,
  )

  const mainContainer = renderMainContainerWithInput(dynamicStyles.container, inputContainer)

  return mainContainer
}

export default CustomInput

