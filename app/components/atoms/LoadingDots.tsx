import type React from "react"
import { useEffect } from "react"
import { Animated, StyleSheet, View, type ViewStyle } from "react-native"
import { useTheme } from "@/app/contexts/ThemeContext"
import { useLoadingDots } from "@/app/hooks/useAnimations"
import type { LoadingDotsProps } from "@/app/types"

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
 * Defines animation-related properties
 */
interface LoadingDotsAnimationConfiguration {
  readonly animatedValues: Animated.Value[]
  readonly numberOfDots: number
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
 * Interface for loading dots animation control
 * Encapsulates animation control methods
 */
interface LoadingDotsAnimationControl {
  readonly startAnimation: () => void
  readonly stopAnimation: () => void
  readonly animationCleanup: (() => void) | undefined
}

/**
 * Interface for animated text style
 * Defines the complete style object for Animated.Text
 */
interface AnimatedTextStyle {
  readonly marginHorizontal: number
  readonly color: string
  readonly fontFamily: string
  readonly fontSize: number
  readonly transform: Array<{ translateY: Animated.Value }>
}

/**
 * LoadingDots Component
 * Responsible for rendering animated loading dots with smooth transitions
 * Follows single responsibility principle - handles loading animation presentation
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  // Dependency injection - similar to Java constructor injection
  const { theme } = useTheme()
  const { dot1, dot2, dot3, animateDots } = useLoadingDots()

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
   * Centralizes animation-related configuration
   * @returns LoadingDotsAnimationConfiguration object with animation properties
   */
  const getLoadingDotsAnimationConfiguration = (): LoadingDotsAnimationConfiguration => {
    const animatedValues = [dot1, dot2, dot3]

    return {
      animatedValues,
      numberOfDots: animatedValues.length,
    }
  }

  /**
   * Private method: Get loading dots layout configuration
   * Centralizes all layout and spacing values
   * @returns LoadingDotsLayoutConfiguration object with layout properties
   */
  const getLoadingDotsLayoutConfiguration = (): LoadingDotsLayoutConfiguration => {
    return {
      containerMarginLeft: 8,
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
   * Private method: Create container styles
   * Encapsulates container styling logic
   * @returns ViewStyle object for dots container
   */
  const createDotsContainerStyles = (): ViewStyle => {
    const layoutConfig = getLoadingDotsLayoutConfiguration()

    return {
      flexDirection: "row",
      marginLeft: layoutConfig.containerMarginLeft,
    }
  }

  /**
   * Private method: Create base dot styles
   * Encapsulates base dot styling logic
   * @returns ViewStyle object for base dot styles
   */
  const createBaseDotStyles = (): ViewStyle => {
    const layoutConfig = getLoadingDotsLayoutConfiguration()

    return {
      marginHorizontal: layoutConfig.dotMarginHorizontal,
    }
  }

  /**
   * Private method: Create complete animated dot styles
   * Combines base, text, and transform styles into a single style object
   * @param animatedValue - Animated value for the dot
   * @param visualConfig - Visual configuration for dots
   * @param baseDotStyles - Base styles for dots
   * @returns AnimatedTextStyle object for animated dot
   */
  const createCompleteAnimatedDotStyles = (
    animatedValue: Animated.Value,
    visualConfig: LoadingDotsVisualConfiguration,
    baseDotStyles: ViewStyle,
  ): AnimatedTextStyle => {
    return {
      marginHorizontal: (baseDotStyles as any).marginHorizontal,
      color: visualConfig.dotColor,
      fontFamily: visualConfig.dotFontFamily,
      fontSize: visualConfig.dotFontSize,
      transform: [{ translateY: animatedValue }],
    }
  }

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createDotsContainerStyles(),
      baseDot: createBaseDotStyles(),
    })
  }

  /**
   * Private method: Execute animation start
   * Encapsulates animation start logic
   * @param animationControl - Animation control function
   */
  const executeAnimationStart = (animationControl: () => any): void => {
    const animation = animationControl()
    animation.start()
  }

  /**
   * Private method: Execute animation stop
   * Encapsulates animation stop logic
   * @param animationControl - Animation control function
   */
  const executeAnimationStop = (animationControl: () => any): void => {
    const animation = animationControl()
    animation.stop()
  }

  /**
   * Private method: Get loading dots animation control
   * Provides animation control methods based on visibility state
   * @param visibilityState - Current visibility state
   * @returns LoadingDotsAnimationControl object with control methods
   */
  const getLoadingDotsAnimationControl = (visibilityState: LoadingDotsVisibilityState): LoadingDotsAnimationControl => {
    const startAnimation = (): void => {
      executeAnimationStart(animateDots)
    }

    const stopAnimation = (): void => {
      executeAnimationStop(animateDots)
    }

    const animationCleanup = visibilityState.shouldRender ? stopAnimation : undefined

    return {
      startAnimation,
      stopAnimation,
      animationCleanup,
    }
  }

  /**
   * Private method: Handle animation lifecycle management
   * Manages animation start/stop based on visibility state
   * @param visibilityState - Current visibility state
   * @param animationControl - Animation control methods
   * @returns Cleanup function or undefined
   */
  const handleAnimationLifecycleManagement = (
    visibilityState: LoadingDotsVisibilityState,
    animationControl: LoadingDotsAnimationControl,
  ): (() => void) | undefined => {
    if (visibilityState.shouldRender) {
      animationControl.startAnimation()
      return animationControl.stopAnimation
    }

    return undefined
  }

  /**
   * Private method: Render individual animated dot
   * Encapsulates single dot rendering logic
   * @param animatedValue - Animated value for the dot
   * @param dotIndex - Index of the dot for key prop
   * @param visualConfig - Visual configuration for dots
   * @param baseDotStyles - Base styles for dots
   * @returns React.ReactElement containing animated dot
   */
  const renderIndividualAnimatedDot = (
    animatedValue: Animated.Value,
    dotIndex: number,
    visualConfig: LoadingDotsVisualConfiguration,
    baseDotStyles: ViewStyle,
  ): React.ReactElement => {
    const completeAnimatedDotStyles = createCompleteAnimatedDotStyles(animatedValue, visualConfig, baseDotStyles)

    return (
      <Animated.Text key={dotIndex} style={completeAnimatedDotStyles}>
        {visualConfig.dotSymbol}
      </Animated.Text>
    )
  }

  /**
   * Private method: Render all animated dots collection
   * Orchestrates the rendering of all dots
   * @param animationConfig - Animation configuration
   * @param visualConfig - Visual configuration for dots
   * @param baseDotStyles - Base styles for dots
   * @returns Array of React.ReactElement containing all animated dots
   */
  const renderAllAnimatedDotsCollection = (
    animationConfig: LoadingDotsAnimationConfiguration,
    visualConfig: LoadingDotsVisualConfiguration,
    baseDotStyles: ViewStyle,
  ): React.ReactElement[] => {
    return animationConfig.animatedValues.map((animatedValue, index) =>
      renderIndividualAnimatedDot(animatedValue, index, visualConfig, baseDotStyles),
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
    const animationControl = getLoadingDotsAnimationControl(visibilityState)

    return handleAnimationLifecycleManagement(visibilityState, animationControl)
  }, [isVisible, animateDots])

  // Main render method - similar to Java's main execution method
  const visibilityState = getLoadingDotsVisibilityState()
  const animationConfiguration = getLoadingDotsAnimationConfiguration()
  const visualConfiguration = getLoadingDotsVisualConfiguration()
  const dynamicStyles = createDynamicStylesheet()

  const allDotsElements = renderAllAnimatedDotsCollection(
    animationConfiguration,
    visualConfiguration,
    dynamicStyles.baseDot,
  )

  const dotsContainer = renderDotsContainerWithAllElements(dynamicStyles.container, allDotsElements)

  const loadingDotsComponent = renderLoadingDotsComponentBasedOnVisibility(visibilityState, dotsContainer)

  return loadingDotsComponent
}
