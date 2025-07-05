"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../providers/ThemeProvider"

/**
 * Interface for LoadingDots component props
 * Defines the contract for component initialization
 */
interface LoadingDotsProps {
  readonly isVisible: boolean
}

/**
 * Interface for loading dots visibility state
 * Encapsulates component visibility properties
 */
interface LoadingDotsVisibilityState {
  readonly isVisible: boolean
  readonly shouldRender: boolean
}

/**
 * Interface for loading dots animation configuration
 * Defines animation-related properties and timing
 */
interface LoadingDotsAnimationConfiguration {
  readonly animatedValues: Animated.Value[]
  readonly numberOfDots: number
  readonly bounceHeight: number
  readonly animationDuration: number
  readonly delayBetweenDots: number
}

/**
 * Interface for loading dots layout configuration
 * Defines layout and spacing properties
 */
interface LoadingDotsLayoutConfiguration {
  readonly containerMarginLeft: number
  readonly dotMarginHorizontal: number
}

/**
 * Interface for loading dots visual configuration
 * Defines visual properties for dots
 */
interface LoadingDotsVisualConfiguration {
  readonly dotColor: string
  readonly dotFontSize: number
  readonly dotFontFamily: string
  readonly dotSymbol: string
}

/**
 * Interface for loading dots animation delays
 * Defines delay timing for each dot animation
 */
interface LoadingDotsAnimationDelays {
  readonly firstDotDelay: number
  readonly secondDotDelay: number
  readonly thirdDotDelay: number
}

/**
 * Interface for animated dot style configuration
 * Defines the complete style object for animated dots
 */
interface AnimatedDotStyleConfiguration {
  readonly color: string
  readonly fontSize: number
  readonly fontFamily: string
  readonly marginHorizontal: number
  readonly transform: Array<{ translateY: Animated.Value }>
}

/**
 * LoadingDots Component
 * Responsible for rendering animated loading dots with smooth bounce transitions
 * Follows single responsibility principle - handles loading animation presentation
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  // Dependency injection - similar to Java constructor injection
  const { theme } = useTheme()

  // Animation references - similar to Java instance variables
  const firstDotAnimatedValue = useRef(new Animated.Value(0)).current
  const secondDotAnimatedValue = useRef(new Animated.Value(0)).current
  const thirdDotAnimatedValue = useRef(new Animated.Value(0)).current

  /**
   * Private method: Get loading dots visibility state
   * Determines the current visibility state of the component
   * @returns LoadingDotsVisibilityState object with visibility properties
   */
  const getLoadingDotsVisibilityState = (): LoadingDotsVisibilityState => {
    return {
      isVisible: isVisible,
      shouldRender: isVisible,
    }
  }

  /**
   * Private method: Get loading dots animation configuration
   * Centralizes all animation-related configuration values
   * @returns LoadingDotsAnimationConfiguration object with animation properties
   */
  const getLoadingDotsAnimationConfiguration = (): LoadingDotsAnimationConfiguration => {
    const animatedValues = [firstDotAnimatedValue, secondDotAnimatedValue, thirdDotAnimatedValue]

    return {
      animatedValues,
      numberOfDots: animatedValues.length,
      bounceHeight: -8,
      animationDuration: 400,
      delayBetweenDots: 200,
    }
  }

  /**
   * Private method: Get loading dots layout configuration
   * Centralizes all layout and spacing values
   * @returns LoadingDotsLayoutConfiguration object with layout properties
   */
  const getLoadingDotsLayoutConfiguration = (): LoadingDotsLayoutConfiguration => {
    return {
      containerMarginLeft: theme.spacing.xs,
      dotMarginHorizontal: 2,
    }
  }

  /**
   * Private method: Get loading dots visual configuration
   * Centralizes all visual properties for dots
   * @returns LoadingDotsVisualConfiguration object with visual properties
   */
  const getLoadingDotsVisualConfiguration = (): LoadingDotsVisualConfiguration => {
    return {
      dotColor: "#FFFFFF",
      dotFontSize: theme.typography.sizes.lg,
      dotFontFamily: theme.typography.fontFamily,
      dotSymbol: "•",
    }
  }

  /**
   * Private method: Get loading dots animation delays
   * Calculates delay timing for staggered animation effect
   * @param animationConfig - Animation configuration
   * @returns LoadingDotsAnimationDelays object with delay values
   */
  const getLoadingDotsAnimationDelays = (
    animationConfig: LoadingDotsAnimationConfiguration,
  ): LoadingDotsAnimationDelays => {
    return {
      firstDotDelay: 0,
      secondDotDelay: animationConfig.delayBetweenDots,
      thirdDotDelay: animationConfig.delayBetweenDots * 2,
    }
  }

  /**
   * Private method: Create container styles
   * Encapsulates container styling logic
   * @param layoutConfig - Layout configuration
   * @returns ViewStyle object for dots container
   */
  const createDotsContainerStyles = (layoutConfig: LoadingDotsLayoutConfiguration): ViewStyle => {
    return {
      flexDirection: "row",
      marginLeft: layoutConfig.containerMarginLeft,
    }
  }

  /**
   * Private method: Create base dot styles
   * Encapsulates base dot styling logic without animation
   * @param visualConfig - Visual configuration for dots
   * @param layoutConfig - Layout configuration
   * @returns TextStyle object for base dot styles
   */
  const createBaseDotStyles = (
    visualConfig: LoadingDotsVisualConfiguration,
    layoutConfig: LoadingDotsLayoutConfiguration,
  ): TextStyle => {
    return {
      color: visualConfig.dotColor,
      fontSize: visualConfig.dotFontSize,
      fontFamily: visualConfig.dotFontFamily,
      marginHorizontal: layoutConfig.dotMarginHorizontal,
    }
  }

  /**
   * Private method: Create animated dot styles
   * Combines base styles with animation transform
   * @param animatedValue - Animated value for the dot
   * @param baseDotStyles - Base styles for the dot
   * @returns Array of style objects for animated dot
   */
  const createAnimatedDotStyles = (
    animatedValue: Animated.Value,
    baseDotStyles: TextStyle,
  ): Array<TextStyle | { transform: Array<{ translateY: Animated.Value }> }> => {
    return [
      baseDotStyles,
      {
        transform: [{ translateY: animatedValue }],
      },
    ]
  }

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @param visualConfig - Visual configuration
   * @param layoutConfig - Layout configuration
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = (
    visualConfig: LoadingDotsVisualConfiguration,
    layoutConfig: LoadingDotsLayoutConfiguration,
  ) => {
    return StyleSheet.create({
      container: createDotsContainerStyles(layoutConfig),
      baseDot: createBaseDotStyles(visualConfig, layoutConfig),
    })
  }

  /**
   * Private method: Create individual bounce animation
   * Encapsulates the logic for a single dot bounce animation
   * @param animatedValue - The animated value to animate
   * @param delayTime - Delay before animation starts
   * @param animationConfig - Animation configuration
   * @returns Animated.CompositeAnimation for single dot bounce
   */
  const createIndividualBounceAnimation = (
    animatedValue: Animated.Value,
    delayTime: number,
    animationConfig: LoadingDotsAnimationConfiguration,
  ): Animated.CompositeAnimation => {
    return Animated.sequence([
      Animated.delay(delayTime),
      Animated.timing(animatedValue, {
        toValue: animationConfig.bounceHeight,
        duration: animationConfig.animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: animationConfig.animationDuration,
        useNativeDriver: true,
      }),
    ])
  }

  /**
   * Private method: Create all dots bounce animations
   * Orchestrates the creation of all individual dot animations
   * @param animationConfig - Animation configuration
   * @param animationDelays - Animation delay configuration
   * @returns Array of Animated.CompositeAnimation for all dots
   */
  const createAllDotsBounceAnimations = (
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): Animated.CompositeAnimation[] => {
    return [
      createIndividualBounceAnimation(firstDotAnimatedValue, animationDelays.firstDotDelay, animationConfig),
      createIndividualBounceAnimation(secondDotAnimatedValue, animationDelays.secondDotDelay, animationConfig),
      createIndividualBounceAnimation(thirdDotAnimatedValue, animationDelays.thirdDotDelay, animationConfig),
    ]
  }

  /**
   * Private method: Create complete animation sequence
   * Combines all dot animations into a looped parallel animation
   * @param animationConfig - Animation configuration
   * @param animationDelays - Animation delay configuration
   * @returns Animated.CompositeAnimation for complete sequence
   */
  const createCompleteAnimationSequence = (
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): Animated.CompositeAnimation => {
    const allDotAnimations = createAllDotsBounceAnimations(animationConfig, animationDelays)

    return Animated.loop(Animated.parallel(allDotAnimations))
  }

  /**
   * Private method: Execute animation lifecycle management
   * Manages the start and stop of animations based on visibility
   * @param visibilityState - Current visibility state
   * @param animationConfig - Animation configuration
   * @param animationDelays - Animation delay configuration
   * @returns Cleanup function for animation
   */
  const executeAnimationLifecycleManagement = (
    visibilityState: LoadingDotsVisibilityState,
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): (() => void) | undefined => {
    if (!visibilityState.shouldRender) {
      return undefined
    }

    const completeAnimation = createCompleteAnimationSequence(animationConfig, animationDelays)
    completeAnimation.start()

    return () => completeAnimation.stop()
  }

  /**
   * Private method: Render individual animated dot
   * Encapsulates single dot rendering logic
   * @param animatedValue - Animated value for the dot
   * @param dotIndex - Index of the dot for key prop
   * @param baseDotStyles - Base styles for the dot
   * @param visualConfig - Visual configuration
   * @returns React.ReactElement containing animated dot
   */
  const renderIndividualAnimatedDot = (
    animatedValue: Animated.Value,
    dotIndex: number,
    baseDotStyles: TextStyle,
    visualConfig: LoadingDotsVisualConfiguration,
  ): React.ReactElement => {
    const animatedDotStyles = createAnimatedDotStyles(animatedValue, baseDotStyles)

    return (
      <Animated.Text key={dotIndex} style={animatedDotStyles}>
        {visualConfig.dotSymbol}
      </Animated.Text>
    )
  }

  /**
   * Private method: Render all animated dots collection
   * Orchestrates the rendering of all dots
   * @param animationConfig - Animation configuration
   * @param baseDotStyles - Base styles for dots
   * @param visualConfig - Visual configuration
   * @returns Array of React.ReactElement containing all animated dots
   */
  const renderAllAnimatedDotsCollection = (
    animationConfig: LoadingDotsAnimationConfiguration,
    baseDotStyles: TextStyle,
    visualConfig: LoadingDotsVisualConfiguration,
  ): React.ReactElement[] => {
    return animationConfig.animatedValues.map((animatedValue, index) =>
      renderIndividualAnimatedDot(animatedValue, index, baseDotStyles, visualConfig),
    )
  }

  /**
   * Private method: Render dots container with all elements
   * Encapsulates the container rendering logic with all dots
   * @param containerStyles - Styles for dots container
   * @param dotsElements - Array of dot elements
   * @returns React.ReactElement containing dots container
   */
  const renderDotsContainerWithAllElements = (
    containerStyles: ViewStyle,
    dotsElements: React.ReactElement[],
  ): React.ReactElement => {
    return <View style={containerStyles}>{dotsElements}</View>
  }

  /**
   * Private method: Render loading dots component based on visibility
   * Determines whether to render the component based on visibility state
   * @param visibilityState - Current visibility state
   * @param dotsContainer - Dots container element
   * @returns React.ReactElement containing loading dots or null
   */
  const renderLoadingDotsComponentBasedOnVisibility = (
    visibilityState: LoadingDotsVisibilityState,
    dotsContainer: React.ReactElement,
  ): React.ReactElement | null => {
    if (!visibilityState.shouldRender) {
      return null
    }

    return dotsContainer
  }

  // Effect hook for animation lifecycle management
  useEffect(() => {
    const visibilityState = getLoadingDotsVisibilityState()
    const animationConfiguration = getLoadingDotsAnimationConfiguration()
    const animationDelays = getLoadingDotsAnimationDelays(animationConfiguration)

    return executeAnimationLifecycleManagement(visibilityState, animationConfiguration, animationDelays)
  }, [isVisible])

  // Main render method - similar to Java's main execution method
  const visibilityState = getLoadingDotsVisibilityState()
  const animationConfiguration = getLoadingDotsAnimationConfiguration()
  const layoutConfiguration = getLoadingDotsLayoutConfiguration()
  const visualConfiguration = getLoadingDotsVisualConfiguration()
  const dynamicStyles = createDynamicStylesheet(visualConfiguration, layoutConfiguration)

  const allDotsElements = renderAllAnimatedDotsCollection(
    animationConfiguration,
    dynamicStyles.baseDot,
    visualConfiguration,
  )

  const dotsContainer = renderDotsContainerWithAllElements(dynamicStyles.container, allDotsElements)

  const loadingDotsComponent = renderLoadingDotsComponentBasedOnVisibility(visibilityState, dotsContainer)

  return loadingDotsComponent
}
