import React, { createContext, useContext, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../types/theme';
import { LIGHT_THEME, DARK_THEME } from '../constants/themes';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);
  
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <StatusBar 
        style={isDarkMode ? 'light' : 'dark'} 
        backgroundColor={theme.colors.background} 
      />
      {children}
    </ThemeContext.Provider>
  );
};