import { LIGHT_THEME } from '@/app/themes/lightTheme';
import { Theme } from '@/app/types';
import React, { createContext, useContext } from 'react';
import { Platform, StatusBar } from 'react-native';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme }}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};