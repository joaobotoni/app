
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface FormFooterProps {
  text: string;
  linkText: string;
}

export const FormFooter: React.FC<FormFooterProps> = ({ text, linkText }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    text: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: 20,
    },
    link: {
      color: theme.colors.accent,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {text} <Text style={styles.link}>{linkText}</Text>
      </Text>
    </View>
  );
};