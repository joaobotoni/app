import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';

/**
 * Interface for header text content
 * Defines the structure for all header text elements
 */
interface HeaderTextContent {
  readonly title: string;
  readonly subtitle: string;
}

/**
 * Interface for responsive typography configuration
 * Encapsulates font sizing and spacing properties
 */
interface ResponsiveTypography {
  readonly titleFontSize: number;
  readonly subtitleFontSize: number;
  readonly subtitleLineHeight: number;
  readonly subtitleMaxWidth: number;
}

/**
 * Interface for divider configuration
 * Defines visual properties for the accent divider
 */
interface DividerConfiguration {
  readonly width: number;
  readonly height: number;
  readonly borderRadius: number;
  readonly opacity: number;
}

/**
 * FormHeader Component
 * Responsible for rendering the welcome header section with title, subtitle and divider
 * Follows single responsibility principle - only handles header rendering
 */
export const FormHeader: React.FC = () => {
  // Dependency injection - similar to Java constructor injection
  const { theme } = useTheme();
  const responsive = useResponsive();

  /**
   * Private method: Get header text content
   * Centralizes all text content for easy maintenance and localization
   * @returns HeaderTextContent object with title and subtitle
   */
  const getHeaderTextContent = (): HeaderTextContent => {
    return {
      title: 'Welcome',
      subtitle: 'Create your account and join our exclusive community',
    };
  };

  /**
   * Private method: Calculate responsive typography configuration
   * Determines font sizes and spacing based on device type
   * @returns ResponsiveTypography object with responsive text properties
   */
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

  /**
   * Private method: Get divider configuration
   * Defines the visual properties for the accent divider
   * @returns DividerConfiguration object with divider properties
   */
  const getDividerConfiguration = (): DividerConfiguration => {
    return {
      width: 60,
      height: 2,
      borderRadius: 1,
      opacity: 0.6,
    };
  };

  /**
   * Private method: Create container styles
   * Encapsulates container styling logic
   * @returns ViewStyle object for main container
   */
  const createContainerStyles = (): ViewStyle => {
    return {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    };
  };

  /**
   * Private method: Create title text styles
   * Encapsulates title styling logic with responsive typography
   * @returns TextStyle object for title text
   */
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

  /**
   * Private method: Create subtitle text styles
   * Encapsulates subtitle styling logic with responsive typography
   * @returns TextStyle object for subtitle text
   */
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

  /**
   * Private method: Create divider styles
   * Encapsulates divider styling logic
   * @returns ViewStyle object for accent divider
   */
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

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      title: createTitleTextStyles(),
      subtitle: createSubtitleTextStyles(),
      divider: createDividerStyles(),
    });
  };

  /**
   * Private method: Render title text
   * Encapsulates the rendering logic for the main title
   * @param titleText - The title text to display
   * @param titleStyles - The styles to apply to the title
   * @returns React.ReactElement containing the styled title
   */
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

  /**
   * Private method: Render subtitle text
   * Encapsulates the rendering logic for the subtitle
   * @param subtitleText - The subtitle text to display
   * @param subtitleStyles - The styles to apply to the subtitle
   * @returns React.ReactElement containing the styled subtitle
   */
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

  /**
   * Private method: Render accent divider
   * Encapsulates the rendering logic for the decorative divider
   * @param dividerStyles - The styles to apply to the divider
   * @returns React.ReactElement containing the styled divider
   */
  const renderAccentDivider = (
    dividerStyles: ViewStyle
  ): React.ReactElement => {
    return (
      <View style={dividerStyles} />
    );
  };

  /**
   * Private method: Render header content
   * Orchestrates the rendering of all header elements
   * @param textContent - The header text content object
   * @param styles - The dynamic stylesheet
   * @returns React.ReactElement containing all header content
   */
  const renderHeaderContent = (
    textContent: HeaderTextContent,
    styles: any
  ): React.ReactElement[] => {
    const titleElement = renderTitleText(textContent.title, styles.title);
    const subtitleElement = renderSubtitleText(textContent.subtitle, styles.subtitle);
    const dividerElement = renderAccentDivider(styles.divider);

    return [titleElement, subtitleElement, dividerElement];
  };

  /**
   * Private method: Render header container
   * Encapsulates the main container rendering logic
   * @param containerStyles - The styles for the container
   * @param headerElements - Array of header content elements
   * @returns React.ReactElement containing the complete header
   */
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

  // Main render method - similar to Java's main execution method
  const dynamicStyles = createDynamicStylesheet();
  const textContent = getHeaderTextContent();
  const headerElements = renderHeaderContent(textContent, dynamicStyles);
  const headerContainer = renderHeaderContainer(dynamicStyles.container, headerElements);

  return headerContainer;
};