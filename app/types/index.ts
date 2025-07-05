export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
  border: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
}

export interface ThemeTypography {
  fontFamily: string;
  sizes: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface ThemeShadows {
  light: object;
  medium: object;
  heavy: object;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  shadows: ThemeShadows;
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export interface ModalState {
  isVisible: boolean;
  title: string;
  message: string;
}

export interface ResponsiveConfig {
  isSmallScreen: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go';
  onSubmitEditing?: () => void;
  maxLength?: number;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export interface ModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export interface LoadingDotsProps {
  isVisible: boolean;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}