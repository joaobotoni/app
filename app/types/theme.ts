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

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    fontFamily: string;
    sizes: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  shadows: {
    light: object;
    medium: object;
    heavy: object;
  };
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
