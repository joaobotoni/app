import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from './providers/ThemeProvider';
import { useForm } from './hooks/useForm';
import { useModal } from './hooks/useModal';
import { useAnimation } from './hooks/useAnimation';
import { FormInput } from './components/Form/FormInput';
import { FormButton } from './components/Form/FormButton';
import { FormHeader } from './components/Form/FormHeader';
import { FormFooter } from './components/Form/FormFooter';
import { CustomModal } from './components/Modal/CustomModal';
import { formatPhone } from './utils/validation';

export default function RegistrationScreen() {
  const { theme } = useTheme();
  const { modal, showModal, hideModal } = useModal();
  const { buttonScale, animateButton } = useAnimation();

  const { formData, formErrors, isLoading, updateField, handleSubmit } = useForm({
    onSuccess: (message) => showModal('Sucesso!', message),
    onError: (title, message) => showModal(title, message),
  });

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    const processedValue = field === 'phone' ? formatPhone(value) : value;
    updateField(field, processedValue);
  };

  const handleModalClose = () => {
    hideModal();
  };

  const handleButtonPress = () => {
    handleSubmit();
  };

  const handleButtonPressIn = () => {
    if (!isLoading) animateButton(0.95);
  };

  const handleButtonPressOut = () => {
    if (!isLoading) animateButton(1);
  };

  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 400;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      justifyContent: 'center',
      minHeight: Dimensions.get('window').height,
    },
    form: {
      width: '100%',
      maxWidth: isSmallScreen ? '100%' : 400,
      alignSelf: 'center',
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
        <FormHeader
          title="Seja Bem-vindo"
          subtitle="Crie sua conta e faça parte da nossa comunidade exclusiva"
        />

        <View style={styles.form}>
          <FormInput
            placeholder="Nome completo"
            value={formData.name}
            onChangeText={(text) => handleFieldChange('name', text)}
            error={formErrors.name}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <FormInput
            placeholder="Telefone"
            value={formData.phone}
            onChangeText={(text) => handleFieldChange('phone', text)}
            error={formErrors.phone}
            keyboardType="phone-pad"
            maxLength={15}
            returnKeyType="next"
          />

          <FormInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleFieldChange('email', text)}
            error={formErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <FormInput
            placeholder="Senha (mín. 6 caracteres)"
            value={formData.password}
            onChangeText={(text) => handleFieldChange('password', text)}
            error={formErrors.password}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleButtonPress}
          />

          <FormButton
            title="Criar Conta"
            onPress={handleButtonPress}
            isLoading={isLoading}
            loadingText="Criando conta"
            scale={buttonScale}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          />
        </View>

        <FormFooter
          text="Ao criar uma conta, você concorda com nossos"
          linkText="Termos de Uso"
        />
      </ScrollView>

      <CustomModal
        isVisible={modal.isVisible}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
      />
    </KeyboardAvoidingView>
  );
}