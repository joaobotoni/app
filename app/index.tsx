import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

interface Theme {
  colors: ThemeColors;
  spacing: number;
  borderRadius: number;
  fontFamily: string;
}

const THEME: Theme = {
  colors: {
    primary: '#007AFF',
    background: '#2F2F2F',
    surface: '#3C3C3C',
    text: '#FFFFFF',
    textSecondary: '#666666',
  },
  spacing: 20,
  borderRadius: 10,
  fontFamily: 'monospace',
};

const formatPhone = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export default function RegisterForm(): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dot1] = useState<Animated.Value>(new Animated.Value(0));
  const [dot2] = useState<Animated.Value>(new Animated.Value(0));
  const [dot3] = useState<Animated.Value>(new Animated.Value(0));

  const animateDots = (): void => {
    const animateDot = (dot: Animated.Value, delay: number): Animated.CompositeAnimation => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]).start();
  };

  useEffect(() => {
    if (loading) {
      animateDots();
    }
  }, [loading]);

  const handlePhoneChange = (text: string): void => {
    setPhone(formatPhone(text));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!name || !phone || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      Alert.alert('Sucesso', 'Dados enviados com sucesso!');
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seja Bem-vindo</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor={THEME.colors.textSecondary}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholderTextColor={THEME.colors.textSecondary}
        placeholder="Digite seu telefone"
        keyboardType="phone-pad"
        maxLength={15}
        value={phone}
        onChangeText={handlePhoneChange}
      />

      <TextInput
        style={styles.input}
        placeholderTextColor={THEME.colors.textSecondary}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholderTextColor={THEME.colors.textSecondary}
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>Cadastrando</Text>
            <View style={styles.dotsContainer}>
              <Animated.Text
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        translateY: dot1,
                      },
                    ],
                  },
                ]}
              >
                •
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        translateY: dot2,
                      },
                    ],
                  },
                ]}
              >
                •
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.dot,
                  {
                    transform: [
                      {
                        translateY: dot3,
                      },
                    ],
                  },
                ]}
              >
                •
              </Animated.Text>
            </View>
          </View>
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing,
    gap: THEME.spacing,
  },
  title: {
    color: THEME.colors.text,
    fontSize: 24,
    fontFamily: THEME.fontFamily,
    marginBottom: THEME.spacing,
  },
  input: {
    height: 60,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: THEME.spacing,
    borderRadius: THEME.borderRadius,
    color: THEME.colors.text,
    fontFamily: THEME.fontFamily,
    backgroundColor: THEME.colors.surface,
    fontSize: 16,
  },
  button: {
    height: 60,
    width: '100%',
    maxWidth: 400,
    borderRadius: THEME.borderRadius,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: THEME.colors.text,
    fontSize: 18,
    fontFamily: THEME.fontFamily,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  dot: {
    color: THEME.colors.text,
    fontSize: 18,
    fontFamily: THEME.fontFamily,
    marginHorizontal: 1,
  },
});