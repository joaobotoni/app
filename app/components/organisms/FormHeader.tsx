import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';

interface HeaderTextContent {
  readonly title: string;
  readonly subtitle: string;
}

interface ResponsiveTypography {
  readonly titleFontSize: number;
  readonly subtitleFontSize: number;
  readonly subtitleLineHeight: number;
  readonly subtitleMaxWidth: number;
}

interface DividerConfiguration {
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number;
  readonly opacity: number;
}

export const FormHeader: React.FC = () => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const getHeaderTextContent = (): HeaderTextContent => {
    return {
      title: 'Welcome',
      subtitle: 'Create your account and join our exclusive community',
    };
  };

  const calculateResponsiveTypography = (): ResponsiveTypography => {
    const TITLE_SIZE_BONUS_TABLET = 16;
    const TITLE_SIZE_BONUS_MOBILE = 8;
    const SUBTITLE_LINE_HEIGHT_TABLET = 28;
    const SUBTITLE_LINE_HEIGHT_MOBILE = 22;
    const SUBTITLE_MAX_WIDTH_TABLET = 500;
    const SUBTITLE_MAX_WIDTH_MOBILE = 300;

    if (responsive.isTablet) {
      return {
        titleFontSize: theme.typography.sizes.xl + TITLE_SIZE_BONUS_TABLET,
        subtitleFontSize: theme.typography.sizes.lg,
        subtitleLineHeight: SUBTITLE_LINE_HEIGHT_TABLET,
        subtitleMaxWidth: SUBTITLE_MAX_WIDTH_TABLET,
      };
    }

    return {
      titleFontSize: theme.typography.sizes.xl + TITLE_SIZE_BONUS_MOBILE,
      subtitleFontSize: theme.typography.sizes.md,
      subtitleLineHeight: SUBTITLE_LINE_HEIGHT_MOBILE,
      subtitleMaxWidth: SUBTITLE_MAX_WIDTH_MOBILE,
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

  const createContainerStyles = (): ViewStyle => {
    return {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    };
  };

  const createTitleTextStyles = (): TextStyle => {
    const typography = calculateResponsiveTypography();

    return {
      color: theme.colors.text,
      fontSize: typography.titleFontSize,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    };
  };

  const createSubtitleTextStyles = (): TextStyle => {
    const typography = calculateResponsiveTypography();

    return {
      color: theme.colors.textSecondary,
      fontSize: typography.subtitleFontSize,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: typography.subtitleLineHeight,
      maxWidth: typography.subtitleMaxWidth,
      marginBottom: theme.spacing.md,
    };
  };

  const createDividerStyles = (): ViewStyle => {
    const dividerConfig = getDividerConfiguration();

    return {
      width: dividerConfig.width,
      height: dividerConfig.height,
      backgroundColor: theme.colors.accent,
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

  const renderTitleText = (
    titleText: string,
    titleStyles: TextStyle
  ): React.ReactElement => {
    return (
      <Text style={titleStyles}>
        {titleText}
      </Text>
    );
  };

  const renderSubtitleText = (
    subtitleText: string,
    subtitleStyles: TextStyle
  ): React.ReactElement => {
    return (
      <Text style={subtitleStyles}>
        {subtitleText}
      </Text>
    );
  };

  const renderAccentDivider = (
    dividerStyles: ViewStyle
  ): React.ReactElement => {
    return (
      <View style={dividerStyles} />
    );
  };

  const renderHeaderContent = (
    textContent: HeaderTextContent,
    styles: any
  ): React.ReactElement[] => {
    const titleElement = renderTitleText(textContent.title, styles.title);
    const subtitleElement = renderSubtitleText(textContent.subtitle, styles.subtitle);
    const dividerElement = renderAccentDivider(styles.divider);

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
  const headerElements = renderHeaderContent(textContent, dynamicStyles);
  const headerContainer = renderHeaderContainer(dynamicStyles.container, headerElements);

  return headerContainer;
};