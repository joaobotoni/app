import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';

/**
 * Interface for typography configuration
 * Encapsulates text styling properties
 */
interface TypographyConfiguration {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly maxWidth: number;
}

/**
 * Interface for footer text content
 * Defines the structure for footer text elements
 */
interface FooterTextContent {
  readonly mainText: string;
  readonly linkText: string;
}


export const FormFooter: React.FC = () => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const getFooterTextContent = (): FooterTextContent => {
    return {
      mainText: 'By creating an account, you agree to our',
      linkText: 'Terms of Service',
    };
  };

  const calculateResponsiveTypography = (): TypographyConfiguration => {
    if (responsive.isTablet) {
      return {
        fontSize: theme.typography.sizes.md,
        lineHeight: 24,
        maxWidth: 500,
      };
    }

    return {
      fontSize: theme.typography.sizes.sm,
      lineHeight: 20,
      maxWidth: 300,
    };
  };


  const createContainerStyles = (): ViewStyle => {
    return {
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    };
  };


  const createMainTextStyles = (): TextStyle => {
    const typography = calculateResponsiveTypography();

    return {
      color: theme.colors.textSecondary,
      fontSize: typography.fontSize,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: typography.lineHeight,
      maxWidth: typography.maxWidth,
    };
  };


  const createLinkTextStyles = (): TextStyle => {
    return {
      color: theme.colors.accent,
      fontWeight: '600',
    };
  };

  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      mainText: createMainTextStyles(),
      linkText: createLinkTextStyles(),
    });
  };

  const renderTermsOfServiceLink = (
    linkText: string,
    linkStyles: TextStyle
  ): React.ReactElement => {
    return (
      <Text style={linkStyles}>
        {linkText}
      </Text>
    );
  };


  const renderFooterTextContent = (
    textContent: FooterTextContent,
    textStyles: TextStyle,
    linkStyles: TextStyle
  ): React.ReactElement => {
    const termsLink = renderTermsOfServiceLink(
      textContent.linkText,
      linkStyles
    );

    return (
      <Text style={textStyles}>
        {textContent.mainText}{' '}
        {termsLink}
      </Text>
    );
  };

  const renderFooterContainer = (
    containerStyles: ViewStyle,
    footerContent: React.ReactElement
  ): React.ReactElement => {
    return (
      <View style={containerStyles}>
        {footerContent}
      </View>
    );
  };

  const dynamicStyles = createDynamicStylesheet();
  const textContent = getFooterTextContent();
  const textStyles = dynamicStyles.mainText;
  const linkStyles = dynamicStyles.linkText;
  const containerStyles = dynamicStyles.container;

  const footerTextElement = renderFooterTextContent(
    textContent,
    textStyles,
    linkStyles
  );

  const footerContainer = renderFooterContainer(
    containerStyles,
    footerTextElement
  );

  return footerContainer;
};