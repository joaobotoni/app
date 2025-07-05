import { Platform } from 'react-native';
import { Theme } from '../types/theme';

export const LIGHT_THEME: Theme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0056CC',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6C6C70',
    accent: '#007AFF',
    error: '#FF3B30',
    success: '#34C759',
    border: '#E5E5EA',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  typography: {
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'system-ui',
    }) as string,
    sizes: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
  },
  shadows: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    heavy: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const DARK_THEME: Theme = {
  ...LIGHT_THEME,
  colors: {
    primary: '#0A84FF',
    primaryDark: '#0056CC',
    background: '#000000',
    surface: '#1C1C1E',
    surfaceElevated: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    accent: '#0A84FF',
    error: '#FF453A',
    success: '#30D158',
    border: '#38383A',
  },
};
