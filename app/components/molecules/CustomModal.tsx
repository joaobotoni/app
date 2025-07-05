import { useTheme } from '@/app/contexts/ThemeContext';
import { useModalAnimation } from '@/app/hooks/useAnimations';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ModalProps } from '@/app/types';
import React, { useEffect } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../atoms/Icon';

export const CustomModal: React.FC<ModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {
  const { theme } = useTheme();
  const responsive = useResponsive();
  const { scaleAnim, showModalAnimation, hideModalAnimation } = useModalAnimation();

  useEffect(() => {
    if (isVisible) {
      showModalAnimation();
    } else {
      hideModalAnimation();
    }
  }, [isVisible, showModalAnimation, hideModalAnimation]);

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
      padding: responsive.isTablet ? theme.spacing.xl : theme.spacing.lg,
      width: responsive.isTablet ? '60%' : '85%',
      maxWidth: responsive.isTablet ? 400 : 300,
      alignItems: 'center',
      ...theme.shadows.heavy,
    },
    icon: {
      marginBottom: theme.spacing.md,
    },
    title: {
      color: theme.colors.text,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.lg 
        : theme.typography.sizes.md,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    message: {
      color: theme.colors.textSecondary,
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.md 
        : theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: responsive.isTablet ? 24 : 20,
      marginBottom: theme.spacing.md,
    },
    messageBold: {
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingVertical: responsive.isTablet ? theme.spacing.md : theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: responsive.isTablet 
        ? theme.typography.sizes.md 
        : theme.typography.sizes.sm,
      fontFamily: theme.typography.fontFamily,
      fontWeight: '600',
    },
  });

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isSuccessModal ? (
            <>
              <Icon
                name="checkmark-circle"
                size={60}
                color={theme.colors.success}
              />
              <Text style={[styles.message, styles.messageBold]}>{message}</Text>
            </>
          ) : isErrorModal ? (
            <>
              <Icon
                name="close-circle"
                size={60}
                color={theme.colors.error}
              />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};