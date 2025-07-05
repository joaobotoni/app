import type React from "react"
import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../providers/ThemeProvider"

interface LoadingDotsProps {
  readonly isVisible: boolean
}

interface LoadingDotsVisibilityState {
  readonly isVisible: boolean
  readonly shouldRender: boolean
}

interface LoadingDotsAnimationConfiguration {
  readonly animatedValues: Animated.Value[]
  readonly numberOfDots: number
  readonly bounceHeight: number
  readonly animationDuration: number
  readonly delayBetweenDots: number
}

interface LoadingDotsLayoutConfiguration {
  readonly containerMarginLeft: number
  readonly dotMarginHorizontal: number
}

interface LoadingDotsVisualConfiguration {
  readonly dotColor: string
  readonly dotFontSize: number
  readonly dotFontFamily: string
  readonly dotSymbol: string
}

interface LoadingDotsAnimationDelays {
  readonly firstDotDelay: number
  readonly secondDotDelay: number
  readonly thirdDotDelay: number
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  const { theme } = useTheme()

  const firstDotAnimatedValue = useRef(new Animated.Value(0)).current
  const secondDotAnimatedValue = useRef(new Animated.Value(0)).current
  const thirdDotAnimatedValue = useRef(new Animated.Value(0)).current

  const getLoadingDotsVisibilityState = (): LoadingDotsVisibilityState => ({
    isVisible,
    shouldRender: isVisible,
  })

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

  const getLoadingDotsLayoutConfiguration = (): LoadingDotsLayoutConfiguration => ({
    containerMarginLeft: theme.spacing.xs,
    dotMarginHorizontal: 2,
  })

  const getLoadingDotsVisualConfiguration = (): LoadingDotsVisualConfiguration => ({
    dotColor: "#FFFFFF",
    dotFontSize: theme.typography.sizes.lg,
    dotFontFamily: theme.typography.fontFamily,
    dotSymbol: "•",
  })

  const getLoadingDotsAnimationDelays = (
    animationConfig: LoadingDotsAnimationConfiguration,
  ): LoadingDotsAnimationDelays => ({
    firstDotDelay: 0,
    secondDotDelay: animationConfig.delayBetweenDots,
    thirdDotDelay: animationConfig.delayBetweenDots * 2,
  })

  const createDotsContainerStyles = (layoutConfig: LoadingDotsLayoutConfiguration): ViewStyle => ({
    flexDirection: "row",
    marginLeft: layoutConfig.containerMarginLeft,
  })

  const createBaseDotStyles = (
    visualConfig: LoadingDotsVisualConfiguration,
    layoutConfig: LoadingDotsLayoutConfiguration,
  ): TextStyle => ({
    color: visualConfig.dotColor,
    fontSize: visualConfig.dotFontSize,
    fontFamily: visualConfig.dotFontFamily,
    marginHorizontal: layoutConfig.dotMarginHorizontal,
  })

  const createAnimatedDotStyles = (
    animatedValue: Animated.Value,
    baseDotStyles: TextStyle,
  ): Array<TextStyle | { transform: Array<{ translateY: Animated.Value }> }> => [
    baseDotStyles,
    {
      transform: [{ translateY: animatedValue }],
    },
  ]

  const createDynamicStylesheet = (
    visualConfig: LoadingDotsVisualConfiguration,
    layoutConfig: LoadingDotsLayoutConfiguration,
  ) =>
    StyleSheet.create({
      container: createDotsContainerStyles(layoutConfig),
      baseDot: createBaseDotStyles(visualConfig, layoutConfig),
    })

  const createIndividualBounceAnimation = (
    animatedValue: Animated.Value,
    delayTime: number,
    animationConfig: LoadingDotsAnimationConfiguration,
  ): Animated.CompositeAnimation =>
    Animated.sequence([
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

  const createAllDotsBounceAnimations = (
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): Animated.CompositeAnimation[] => [
    createIndividualBounceAnimation(firstDotAnimatedValue, animationDelays.firstDotDelay, animationConfig),
    createIndividualBounceAnimation(secondDotAnimatedValue, animationDelays.secondDotDelay, animationConfig),
    createIndividualBounceAnimation(thirdDotAnimatedValue, animationDelays.thirdDotDelay, animationConfig),
  ]

  const createCompleteAnimationSequence = (
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): Animated.CompositeAnimation =>
    Animated.loop(Animated.parallel(createAllDotsBounceAnimations(animationConfig, animationDelays)))

  const executeAnimationLifecycleManagement = (
    visibilityState: LoadingDotsVisibilityState,
    animationConfig: LoadingDotsAnimationConfiguration,
    animationDelays: LoadingDotsAnimationDelays,
  ): (() => void) | undefined => {
    if (!visibilityState.shouldRender) return undefined
    const completeAnimation = createCompleteAnimationSequence(animationConfig, animationDelays)
    completeAnimation.start()
    return () => completeAnimation.stop()
  }

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

  const renderAllAnimatedDotsCollection = (
    animationConfig: LoadingDotsAnimationConfiguration,
    baseDotStyles: TextStyle,
    visualConfig: LoadingDotsVisualConfiguration,
  ): React.ReactElement[] =>
    animationConfig.animatedValues.map((animatedValue, index) =>
      renderIndividualAnimatedDot(animatedValue, index, baseDotStyles, visualConfig),
    )

  const renderDotsContainerWithAllElements = (
    containerStyles: ViewStyle,
    dotsElements: React.ReactElement[],
  ): React.ReactElement => <View style={containerStyles}>{dotsElements}</View>

  const renderLoadingDotsComponentBasedOnVisibility = (
    visibilityState: LoadingDotsVisibilityState,
    dotsContainer: React.ReactElement,
  ): React.ReactElement | null => (visibilityState.shouldRender ? dotsContainer : null)

  useEffect(() => {
    const visibilityState = getLoadingDotsVisibilityState()
    const animationConfiguration = getLoadingDotsAnimationConfiguration()
    const animationDelays = getLoadingDotsAnimationDelays(animationConfiguration)
    return executeAnimationLifecycleManagement(visibilityState, animationConfiguration, animationDelays)
  }, [isVisible])

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

  return renderLoadingDotsComponentBasedOnVisibility(visibilityState, dotsContainer)
}

export default LoadingDots
