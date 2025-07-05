import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const FormFooter: React.FC = () => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    text: {
      color: theme.colors.textSecondary,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.md 
        : theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: responsive.isTablet ? 24 : 20,
      maxWidth: responsive.isTablet ? 500 : 300,
    },
    link: {
      color: theme.colors.accent,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Ao criar uma conta, você concorda com nossos{' '}
        <Text style={styles.link}>Termos de Uso</Text>
      </Text>
    </View>
  );
};