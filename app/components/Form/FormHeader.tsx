import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.sizes.xl + 8,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.divider} />
    </View>
  );
};