import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface FormHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

interface HeaderLayoutConfiguration {
  readonly containerMarginTop: number;
  readonly containerMarginBottom: number;
  readonly titleMarginBottom: number;
  readonly subtitleMarginBottom: number;
}

interface HeaderTypographyConfiguration {
  readonly titleFontSize: number;
  readonly titleFontFamily: string;
  readonly titleFontWeight: '700';
  readonly subtitleFontSize: number;
  readonly subtitleFontFamily: string;
  readonly subtitleLineHeight: number;
  readonly subtitleMaxWidth: number;
}

interface HeaderColorConfiguration {
  readonly titleColor: string;
  readonly subtitleColor: string;
  readonly dividerBackgroundColor: string;
}

interface DividerConfiguration {
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number;
  readonly opacity: number;
}


interface HeaderTextContent {
  readonly titleText: string;
  readonly subtitleText: string;
}


export const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {

  const { theme } = useTheme();

  const getHeaderLayoutConfiguration = (): HeaderLayoutConfiguration => {
    return {
      containerMarginTop: theme.spacing.xl,
      containerMarginBottom: theme.spacing.xl,
      titleMarginBottom: theme.spacing.sm,
      subtitleMarginBottom: theme.spacing.md,
    };
  };

  const getHeaderTypographyConfiguration = (): HeaderTypographyConfiguration => {
    const TITLE_FONT_SIZE_BONUS = 8;
    const SUBTITLE_LINE_HEIGHT = 22;
    const SUBTITLE_MAX_WIDTH = 300;

    return {
      titleFontSize: theme.typography.sizes.xl + TITLE_FONT_SIZE_BONUS,
      titleFontFamily: theme.typography.fontFamily,
      titleFontWeight: '700',
      subtitleFontSize: theme.typography.sizes.md,
      subtitleFontFamily: theme.typography.fontFamily,
      subtitleLineHeight: SUBTITLE_LINE_HEIGHT,
      subtitleMaxWidth: SUBTITLE_MAX_WIDTH,
    };
  };

  const getHeaderColorConfiguration = (): HeaderColorConfiguration => {
    return {
      titleColor: theme.colors.text,
      subtitleColor: theme.colors.textSecondary,
      dividerBackgroundColor: theme.colors.accent,
    };
  };

  const getDividerConfiguration = (): DividerConfiguration => {
    return {
      width: 60,
      height: 2,
      borderRadius: 1,
      opacity: 0.6,
    };
  };

  const getHeaderTextContent = (): HeaderTextContent => {
    return {
      titleText: title,
      subtitleText: subtitle,
    };
  };

  const createContainerStyles = (): ViewStyle => {
    const layoutConfig = getHeaderLayoutConfiguration();

    return {
      alignItems: 'center',
      marginBottom: layoutConfig.containerMarginBottom,
      marginTop: layoutConfig.containerMarginTop,
    };
  };

  const createTitleTextStyles = (): TextStyle => {
    const layoutConfig = getHeaderLayoutConfiguration();
    const typographyConfig = getHeaderTypographyConfiguration();
    const colorConfig = getHeaderColorConfiguration();

    return {
      color: colorConfig.titleColor,
      fontSize: typographyConfig.titleFontSize,
      fontFamily: typographyConfig.titleFontFamily,
      fontWeight: typographyConfig.titleFontWeight,
      textAlign: 'center',
      marginBottom: layoutConfig.titleMarginBottom,
    };
  };


  const createSubtitleTextStyles = (): TextStyle => {
    const layoutConfig = getHeaderLayoutConfiguration();
    const typographyConfig = getHeaderTypographyConfiguration();
    const colorConfig = getHeaderColorConfiguration();

    return {
      color: colorConfig.subtitleColor,
      fontSize: typographyConfig.subtitleFontSize,
      fontFamily: typographyConfig.subtitleFontFamily,
      textAlign: 'center',
      lineHeight: typographyConfig.subtitleLineHeight,
      maxWidth: typographyConfig.subtitleMaxWidth,
      marginBottom: layoutConfig.subtitleMarginBottom,
    };
  };


  const createDividerStyles = (): ViewStyle => {
    const dividerConfig = getDividerConfiguration();
    const colorConfig = getHeaderColorConfiguration();

    return {
      width: dividerConfig.width,
      height: dividerConfig.height,
      backgroundColor: colorConfig.dividerBackgroundColor,
      borderRadius: dividerConfig.borderRadius,
      opacity: dividerConfig.opacity,
    };
  };

  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      title: createTitleTextStyles(),
      subtitle: createSubtitleTextStyles(),
      divider: createDividerStyles(),
    });
  };

  const renderTitleTextElement = (
    titleStyles: TextStyle,
    textContent: HeaderTextContent
  ): React.ReactElement => {
    return (
      <Text style={titleStyles}>
        {textContent.titleText}
      </Text>
    );
  };

  const renderSubtitleTextElement = (
    subtitleStyles: TextStyle,
    textContent: HeaderTextContent
  ): React.ReactElement => {
    return (
      <Text style={subtitleStyles}>
        {textContent.subtitleText}
      </Text>
    );
  };


  const renderDecorativeDividerElement = (dividerStyles: ViewStyle): React.ReactElement => {
    return (
      <View style={dividerStyles} />
    );
  };


  const renderHeaderContentElements = (
    styles: any,
    textContent: HeaderTextContent
  ): React.ReactElement[] => {
    const titleElement = renderTitleTextElement(styles.title, textContent);
    const subtitleElement = renderSubtitleTextElement(styles.subtitle, textContent);
    const dividerElement = renderDecorativeDividerElement(styles.divider);

    return [titleElement, subtitleElement, dividerElement];
  };


  const renderHeaderContainer = (
    containerStyles: ViewStyle,
    headerElements: React.ReactElement[]
  ): React.ReactElement => {
    return (
      <View style={containerStyles}>
        {headerElements.map((element, index) => (
          <React.Fragment key={index}>
            {element}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const dynamicStyles = createDynamicStylesheet();
  const textContent = getHeaderTextContent();
  const headerElements = renderHeaderContentElements(dynamicStyles, textContent);
  const headerContainer = renderHeaderContainer(dynamicStyles.container, headerElements);

  return headerContainer;
};