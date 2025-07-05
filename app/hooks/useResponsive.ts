import { ResponsiveConfig } from '@/app/types';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useResponsive = (): ResponsiveConfig => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  return {
    isSmallScreen: dimensions.width < 400,
    isTablet: dimensions.width >= 768,
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
  };
};