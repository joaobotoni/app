import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { FormData, FormErrors } from '@/app/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CustomInput } from '../atoms/CustomInput';

interface FormFieldsProps {
  formData: FormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  formErrors,
  onFieldChange,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: responsive.isTablet ? 500 : responsive.isSmallScreen ? '100%' : 400,
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <CustomInput
        value={formData.name}
        onChangeText={(text) => onFieldChange('name', text)}
        placeholder="Nome completo"
        error={formErrors.name}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <CustomInput
        value={formData.phone}
        onChangeText={(text) => onFieldChange('phone', text)}
        placeholder="Telefone"
        error={formErrors.phone}
        keyboardType="phone-pad"
        maxLength={15}
        returnKeyType="next"
      />

      <CustomInput
        value={formData.email}
        onChangeText={(text) => onFieldChange('email', text)}
        placeholder="Email"
        error={formErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <CustomInput
        value={formData.password}
        onChangeText={(text) => onFieldChange('password', text)}
        placeholder="Senha (mín. 6 caracteres)"
        error={formErrors.password}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};