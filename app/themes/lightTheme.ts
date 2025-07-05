import { Theme } from '@/app/types';
import { Platform } from 'react-native';

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
      web: 'system-ui, -apple-system, sans-serif',
      default: 'system-ui',
    }),
    sizes: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
  },
  shadows: Platform.select({
    ios: {
      light: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      medium: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      heavy: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
    },
    android: {
      light: { elevation: 3 },
      medium: { elevation: 5 },
      heavy: { elevation: 8 },
    },
    web: {
      light: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      medium: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      },
      heavy: {
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      },
    },
    default: {
      light: { elevation: 3 },
      medium: { elevation: 5 },
      heavy: { elevation: 8 },
    },
  }),
};