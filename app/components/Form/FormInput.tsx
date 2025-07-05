import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  secureTextEntry?: boolean;
  returnKeyType?: 'done' | 'next' | 'send' | 'search' | 'go';
  onSubmitEditing?: () => void;
  maxLength?: number;
  autoCorrect?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  returnKeyType = 'next',
  onSubmitEditing,
  maxLength,
  autoCorrect = true,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
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
      borderColor: error ? theme.colors.error : theme.colors.border,
      ...theme.shadows.light,
    },
    errorIcon: {
      position: 'absolute',
      right: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
        autoCorrect={autoCorrect}
      />
      {error && (
        <AlertCircle 
          size={24} 
          color={theme.colors.error} 
          style={styles.errorIcon}
        />
      )}
    </View>
  );
};