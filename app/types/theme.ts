export interface ThemeColors {
  primary: string;           // cor principal do app
  primaryDark: string;       // cor principal escura (ex: para estado ativo)
  background: string;        // cor de fundo geral
  surface: string;           // cor de superfícies (cards, modais)
  surfaceElevated: string;   // cor para superfícies elevadas (sombra)
  text: string;              // cor principal do texto
  textSecondary: string;     // cor do texto secundário
  accent: string;            // cor de destaque (botões, links)
  error: string;             // cor para mensagens de erro
  success: string;           // cor para mensagens de sucesso
  border: string;            // cor para bordas
}

export interface Theme {
  colors: ThemeColors;
  spacing: {                 // espaçamentos usados no app
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {            // raio de bordas para UI consistente
    sm: number;
    md: number;
    lg: number;
  };
  typography: {              // tipografia do app
    fontFamily: string;
    sizes: {                 // tamanhos de fonte para vários usos
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  shadows: {                 // sombras para elevação dos elementos
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
