import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';


interface FormFooterProps {
  readonly text: string;
  readonly linkText: string;
}

interface FooterLayoutConfiguration {
  readonly containerMarginTop: number;
}


interface FooterTypographyConfiguration {
  readonly mainTextFontSize: number;
  readonly mainTextFontFamily: string;
  readonly mainTextLineHeight: number;
  readonly linkTextFontWeight: '600';
}


interface FooterColorConfiguration {
  readonly mainTextColor: string;
  readonly linkTextColor: string;
}


interface FooterTextContent {
  readonly mainText: string;
  readonly linkText: string;
}


export const FormFooter: React.FC<FormFooterProps> = ({ text, linkText }) => {

  const { theme } = useTheme();

  const getFooterLayoutConfiguration = (): FooterLayoutConfiguration => {
    return {
      containerMarginTop: theme.spacing.xl,
    };
  };


  const getFooterTypographyConfiguration = (): FooterTypographyConfiguration => {
    const MAIN_TEXT_LINE_HEIGHT = 20;

    return {
      mainTextFontSize: theme.typography.sizes.sm,
      mainTextFontFamily: theme.typography.fontFamily,
      mainTextLineHeight: MAIN_TEXT_LINE_HEIGHT,
      linkTextFontWeight: '600',
    };
  };


  const getFooterColorConfiguration = (): FooterColorConfiguration => {
    return {
      mainTextColor: theme.colors.textSecondary,
      linkTextColor: theme.colors.accent,
    };
  };

  const getFooterTextContent = (): FooterTextContent => {
    return {
      mainText: text,
      linkText: linkText,
    };
  };


  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getFooterLayoutConfiguration();

    return {
      alignItems: 'center',
      marginTop: layoutConfig.containerMarginTop,
    };
  };


  const createMainTextStyles = (): TextStyle => {
    const typographyConfig = getFooterTypographyConfiguration();
    const colorConfig = getFooterColorConfiguration();

    return {
      color: colorConfig.mainTextColor,
      fontSize: typographyConfig.mainTextFontSize,
      fontFamily: typographyConfig.mainTextFontFamily,
      textAlign: 'center',
      lineHeight: typographyConfig.mainTextLineHeight,
    };
  };

  const createLinkTextStyles = (): TextStyle => {
    const typographyConfig = getFooterTypographyConfiguration();
    const colorConfig = getFooterColorConfiguration();

    return {
      color: colorConfig.linkTextColor,
      fontWeight: typographyConfig.linkTextFontWeight,
    };
  };


  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      mainText: createMainTextStyles(),
      linkText: createLinkTextStyles(),
    });
  };

  const renderLinkTextElement = (
    linkStyles: TextStyle,
    textContent: FooterTextContent
  ): React.ReactElement => {
    return (
      <Text style={linkStyles}>
        {textContent.linkText}
      </Text>
    );
  };


  const renderMainTextWithEmbeddedLink = (
    mainTextStyles: TextStyle,
    linkStyles: TextStyle,
    textContent: FooterTextContent
  ): React.ReactElement => {
    const linkElement = renderLinkTextElement(linkStyles, textContent);
    const SPACE_SEPARATOR = ' ';

    return (
      <Text style={mainTextStyles}>
        {textContent.mainText}{SPACE_SEPARATOR}{linkElement}
      </Text>
    );
  };


  const renderFooterContentElements = (
    styles: any,
    textContent: FooterTextContent
  ): React.ReactElement => {
    return renderMainTextWithEmbeddedLink(
      styles.mainText,
      styles.linkText,
      textContent
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
  const footerContent = renderFooterContentElements(dynamicStyles, textContent);
  const footerContainer = renderFooterContainer(dynamicStyles.container, footerContent);

  return footerContainer;
};