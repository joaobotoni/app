import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

interface Size {
  width: number;
  height: number;
}

const getScreenSize = (): Size => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

const isTabletDevice = (width: number): boolean => {
  return width >= 768;
};

const isSmallScreenDevice = (width: number): boolean => {
  return width < 400;
};

export const useResponsive = () => {
  const [size, setSize] = useState<Size>(getScreenSize());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setSize({ width: window.width, height: window.height });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isSmallScreen: isSmallScreenDevice(size.width),
    isTablet: isTabletDevice(size.width),
    screenWidth: size.width,
    screenHeight: size.height,
  };
};
