import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { CircleCheck, XCircleIcon } from 'lucide-react-native';
import { useTheme } from '../../providers/ThemeProvider';

interface CustomModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {
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

  const isSuccessModal = title.includes('Sucesso!');
  const isErrorModal = title.includes('Erro');

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    content: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      width: '85%',
      maxWidth: 300,
      alignItems: 'center',
      ...theme.shadows.heavy,
    },
    icon: {
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    message: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    messageBold: {
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    },
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isSuccessModal && (
            <CircleCheck
              size={60}
              color={theme.colors.success}
              style={styles.icon}
            />
          )}
          
          {isErrorModal && (
            <XCircleIcon
              size={60}
              color={theme.colors.error}
              style={styles.icon}
            />
          )}

          {!isSuccessModal && (
            <Text style={styles.title}>{title}</Text>
          )}
          
          <Text style={[styles.message, isSuccessModal && styles.messageBold]}>
            {message}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};