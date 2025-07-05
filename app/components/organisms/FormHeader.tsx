import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const FormHeader: React.FC = () => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.xl + 16 
        : theme.typography.sizes.xl + 8,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.lg 
        : theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: responsive.isTablet ? 28 : 22,
      maxWidth: responsive.isTablet ? 500 : 300,
      marginBottom: theme.spacing.md,
    },
    divider: {
      width: 60,
      height: 2,
      backgroundColor: theme.colors.accent,
      borderRadius: 1,
      opacity: 0.6,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seja Bem-vindo</Text>
      <Text style={styles.subtitle}>
        Crie sua conta e faça parte da nossa comunidade exclusiva
      </Text>
      <View style={styles.divider} />
    </View>
  );
};