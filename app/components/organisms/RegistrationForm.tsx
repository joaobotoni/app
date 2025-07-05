import { useTheme } from '@/app/contexts/ThemeContext';
import { useButtonAnimation } from '@/app/hooks/useAnimations';
import { useApi } from '@/app/hooks/useApi';
import { useFormLogic } from '@/app/hooks/useFormLogic';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ModalState } from '@/app/types';
import React, { useCallback, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { CustomButton } from '../atoms/CustomButton';
import { CustomModal } from '../molecules/CustomModal';
import { FormFields } from './FormFields';
import { FormFooter } from './FormFooter';
import { FormHeader } from './FormHeader';

export const RegistrationForm: React.FC = () => {
  const { theme } = useTheme();
  const responsive = useResponsive();
  const { buttonScale, animateButton } = useButtonAnimation();
  const { submitForm } = useApi();
  
  const {
    formData,
    formErrors,
    updateField,
    resetForm,
    validateFormData,
    setFormErrors,
  } = useFormLogic();

  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalState>({
    isVisible: false,
    title: '',
    message: '',
  });

  const showModal = useCallback((title: string, message: string) => {
    setModal({
      isVisible: true,
      title,
      message,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isVisible: false }));
    if (modal.title === 'Sucesso!') {
      resetForm();
    }
  }, [modal.title, resetForm]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    const validationErrors = validateFormData();
    if (validationErrors) {
      setFormErrors(validationErrors);
      const firstErrorMessage = Object.values(validationErrors)[0];
      showModal('Erro de Validação', firstErrorMessage);
      return;
    }

    setLoading(true);
    animateButton(0.95);

    try {
      await submitForm(formData);
      showModal('Sucesso!', 'Sua conta foi criada com sucesso. Bem-vindo!');
    } catch (error) {
      showModal('Erro no Servidor', 'Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setLoading(false);
      animateButton(1);
    }
  }, [formData, validateFormData, setFormErrors, showModal, animateButton, submitForm]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: responsive.isTablet ? theme.spacing.xl * 2 : theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: 'center',
      minHeight: responsive.screenHeight || Dimensions.get('window').height,
    },
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FormHeader />
        
        <FormFields
          formData={formData}
          formErrors={formErrors}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />

        <CustomButton
          title="Criar Conta"
          onPress={handleSubmit}
          loading={loading}
          animatedStyle={{ transform: [{ scale: buttonScale }] }}
          onPressIn={() => !loading && animateButton(0.95)}
          onPressOut={() => !loading && animateButton(1)}
        />

        <FormFooter />
      </ScrollView>

      <CustomModal
        isVisible={modal.isVisible}
        title={modal.title}
        message={modal.message}
        onClose={hideModal}
      />
    </KeyboardAvoidingView>
  );
};