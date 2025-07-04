import type React from "react";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ThemeColors {
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

interface Theme {
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

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

interface LoadingDotsProps {
  isVisible: boolean;
}

interface ThemeContextType {
  theme: Theme;
}

const LIGHT_THEME: Theme = {
  colors: {
    primary: "#007AFF",
    primaryDark: "#0056CC",
    background: "#F2F2F7",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    text: "#000000",
    textSecondary: "#6C6C70",
    accent: "#007AFF",
    error: "#FF3B30",
    success: "#34C759",
    border: "#E5E5EA",
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
      ios: "SF Pro Display",
      android: "Roboto",
      default: "system-ui",
    }),
    sizes: {
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
  },
  shadows: {
    light: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    heavy: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = LIGHT_THEME;
  return (
    <ThemeContext.Provider value={{ theme }}>
      <StatusBar barStyle={"dark-content"} backgroundColor={theme.colors.background} />
      {children}
    </ThemeContext.Provider>
  );
};

const formatPhone = (text: string): string => {
  const cleaned = text.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (data: FormData): FormErrors | null => {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Nome é obrigatório";
  if (!data.phone.trim()) errors.phone = "Telefone é obrigatório";
  if (!data.email.trim()) errors.email = "Email é obrigatório";
  if (data.email.trim() && !validateEmail(data.email)) errors.email = "Email inválido";
  if (!data.password.trim()) errors.password = "Senha é obrigatória";
  if (data.password.trim() && data.password.length < 6)
    errors.password = "Senha deve ter pelo menos 6 caracteres";

  return Object.keys(errors).length > 0 ? errors : null;
};

const useLoadingDots = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  const animateDots = useCallback(() => {
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    return Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 200),
      createDotAnimation(dot3, 400),
    ]);
  }, [dot1, dot2, dot3]);

  return { dot1, dot2, dot3, animateDots };
};

const LoadingDots: React.FC<LoadingDotsProps> = ({ isVisible }) => {
  const { theme } = useTheme();
  const { dot1, dot2, dot3, animateDots } = useLoadingDots();

  useEffect(() => {
    if (isVisible) {
      const animation = animateDots();
      animation.start();
      return () => animation.stop();
    }
  }, [isVisible, animateDots]);

  if (!isVisible) return null;

  const styles = createStyles(theme);

  return (
    <View style={styles.dotsContainer}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.dot,
            {
              transform: [{ translateY: dot }],
            },
          ]}
        >
          •
        </Animated.Text>
      ))}
    </View>
  );
};

const CustomModal: React.FC<{
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}> = ({ isVisible, title, message, onClose }) => {
  const { theme } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isVisible, scaleAnim]);

  const styles = createStyles(theme);

  const isSuccessModal = title.includes("Sucesso!");
  const isErrorModal = title.includes("Erro"); // Check for error title

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isSuccessModal ? (
            <>
              <Ionicons
                name="checkmark-circle"
                size={60}
                color={theme.colors.success}
                style={styles.modalIcon}
              />
              <Text style={[styles.modalMessage, styles.modalMessageBold]}>{message}</Text>
            </>
          ) : isErrorModal ? ( // Render error icon if it's an error modal
            <>
              <Ionicons
                name="close-circle" // Ionicons for error
                size={60}
                color={theme.colors.error}
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalMessage}>{message}</Text>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalMessage}>{message}</Text>
            </>
          )}

          <TouchableOpacity style={styles.modalButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.modalButtonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ExclusiveRegisterForm: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    isVisible: boolean;
    title: string;
    message: string;
  }>({
    isVisible: false,
    title: "",
    message: "",
  });
  const [buttonScale] = useState(new Animated.Value(1));

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const showModal = useCallback((title: string, message: string) => {
    setModal({
      isVisible: true,
      title,
      message,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isVisible: false }));
    if (modal.title === "Sucesso!") {
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
      });
      setFormErrors({});
    }
  }, [modal.title]);

  const animateButton = useCallback(
    (scale: number) => {
      Animated.spring(buttonScale, {
        toValue: scale,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    },
    [buttonScale],
  );

  const handleSubmit = useCallback(async (): Promise<void> => {
    const validationErrors = validateForm(formData);
    if (validationErrors) {
      setFormErrors(validationErrors);
      const firstErrorMessage = Object.values(validationErrors)[0];
      showModal("Erro de Validação", firstErrorMessage);
      return;
    }

    setLoading(true);
    animateButton(0.95);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 2500));
      showModal("Sucesso!", "Sua conta foi criada com sucesso. Bem-vindo!");
    } catch (error) {
      showModal("Erro no Servidor", "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setLoading(false);
      animateButton(1);
    }
  }, [formData, showModal, animateButton]);

  const { width } = Dimensions.get("window");
  const isSmallScreen = width < 400;
  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Seja Bem-vindo</Text>
          <Text style={styles.subtitle}>Crie sua conta e faça parte da nossa comunidade exclusiva</Text>
          <View style={styles.divider} />
        </View>

        <View style={[styles.form, isSmallScreen && styles.formSmall]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, formErrors.name && styles.inputError]}
              placeholderTextColor={theme.colors.textSecondary}
              placeholder="Nome completo"
              value={formData.name}
              onChangeText={(text) => updateField("name", text)}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {formErrors.name && (
              <Ionicons name="alert-circle" size={24} color={theme.colors.error} style={styles.errorIcon} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, formErrors.phone && styles.inputError]}
              placeholderTextColor={theme.colors.textSecondary}
              placeholder="Telefone"
              keyboardType="phone-pad"
              maxLength={15}
              value={formData.phone}
              onChangeText={(text) => updateField("phone", text)}
              returnKeyType="next"
            />
            {formErrors.phone && (
              <Ionicons name="alert-circle" size={24} color={theme.colors.error} style={styles.errorIcon} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              placeholderTextColor={theme.colors.textSecondary}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              returnKeyType="next"
            />
            {formErrors.email && (
              <Ionicons name="alert-circle" size={24} color={theme.colors.error} style={styles.errorIcon} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, formErrors.password && styles.inputError]}
              placeholderTextColor={theme.colors.textSecondary}
              placeholder="Senha (mín. 6 caracteres)"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {formErrors.password && (
              <Ionicons name="alert-circle" size={24} color={theme.colors.error} style={styles.errorIcon} />
            )}
          </View>

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonLoading]}
              onPress={handleSubmit}
              disabled={loading}
              onPressIn={() => !loading && animateButton(0.95)}
              onPressOut={() => !loading && animateButton(1)}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.buttonText}>Criando conta</Text>
                  <LoadingDots isVisible={loading} />
                </View>
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao criar uma conta, você concorda com nossos <Text style={styles.link}>Termos de Uso</Text>
          </Text>
        </View>
      </ScrollView>

      <CustomModal isVisible={modal.isVisible} title={modal.title} message={modal.message} onClose={hideModal} />
    </KeyboardAvoidingView>
  );
};


const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: "center",
      minHeight: Dimensions.get("window").height,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.sizes.xl + 8,
      fontFamily: theme.typography.fontFamily,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 300,
      marginBottom: theme.spacing.md,
    },
    divider: {
      width: 60,
      height: 2,
      backgroundColor: theme.colors.accent,
      borderRadius: 1,
      opacity: 0.6,
    },
    form: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    formSmall: {
      maxWidth: "100%",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    input: {
      flex: 1,
      height: 56,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.sizes.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.light,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorIcon: {
      position: "absolute",
      right: theme.spacing.sm,
    },
    buttonContainer: {
      marginTop: theme.spacing.md,
    },
    button: {
      height: 56,
      width: "100%",
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.accent,
      alignItems: "center",
      justifyContent: "center",
      ...theme.shadows.medium,
    },
    buttonLoading: {
      backgroundColor: theme.colors.primaryDark,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.fontFamily,
      fontWeight: "600",
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    dotsContainer: {
      flexDirection: "row",
      marginLeft: theme.spacing.xs,
    },
    dot: {
      color: "#FFFFFF",
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.fontFamily,
      marginHorizontal: 2,
    },
    footer: {
      alignItems: "center",
      marginTop: theme.spacing.xl,
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: "center",
      lineHeight: 20,
    },
    link: {
      color: theme.colors.accent,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: "85%",
      maxWidth: 300,
      alignItems: "center",
      ...theme.shadows.heavy,
    },
    modalIcon: {
      marginBottom: theme.spacing.md,
    },
    modalTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    modalMessage: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    modalMessageBold: {
      fontWeight: 'bold',
    },
    modalButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      width: "100%",
      alignItems: "center",
    },
    modalButtonText: {
      color: "#FFFFFF",
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      fontWeight: "600",
    },
  });

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <ExclusiveRegisterForm />
    </ThemeProvider>
  );
}