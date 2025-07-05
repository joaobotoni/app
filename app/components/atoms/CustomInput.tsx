import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { InputProps } from '@/app/types';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from './Icon';

export const CustomInput: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  returnKeyType = 'next',
  onSubmitEditing,
  maxLength,
}) => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      height: responsive.isTablet ? 64 : 56,
      paddingHorizontal: theme.spacing.md,
      paddingRight: error ? 48 : theme.spacing.md, // Extra padding when error icon is present
      borderRadius: theme.borderRadius.md,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.lg 
        : theme.typography.sizes.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      ...theme.shadows.light,
    },
    errorIconContainer: {
      position: 'absolute',
      right: theme.spacing.md,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textSecondary}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
        />
        {error && (
          <TouchableOpacity 
            style={styles.errorIconContainer}
            activeOpacity={0.7}
          >
            <Icon 
              name="alert-circle" 
              size={20} 
              color={theme.colors.error}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};