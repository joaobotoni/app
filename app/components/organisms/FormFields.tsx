import { useTheme } from '@/app/contexts/ThemeContext';
import { useResponsive } from '@/app/hooks/useResponsive';
import { FormData, FormErrors } from '@/app/types';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import  CustomInput  from '../atoms/CustomInput';


interface FormFieldsProps {
  readonly formData: FormData;
  readonly formErrors: FormErrors;
  readonly onFieldChange: (field: keyof FormData, value: string) => void;
  readonly onSubmit: () => void;
}


interface ContainerDimensions {
  readonly width: string | number;
  readonly maxWidth: number | string;
}


export const FormFields: React.FC<FormFieldsProps> = ({
  formData,
  formErrors,
  onFieldChange,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const responsive = useResponsive();

  const calculateContainerDimensions = (): ContainerDimensions => {
    if (responsive.isTablet) {
      return { width: '100%', maxWidth: 500 };
    }
    
    if (responsive.isSmallScreen) {
      return { width: '100%', maxWidth: '100%' };
    }
    
    return { width: '100%', maxWidth: 400 };
  };

  
  const createDynamicStyles = () => {
    const containerDimensions = calculateContainerDimensions();
    
    return StyleSheet.create({
      container: {
        width: containerDimensions.width,
        maxWidth: containerDimensions.maxWidth,
        alignSelf: 'center',
      } as ViewStyle,
    });
  };


  const handleFieldValueChange = (
    fieldName: keyof FormData, 
    fieldValue: string
  ): void => {
    onFieldChange(fieldName, fieldValue);
  };


  const handleFormSubmission = (): void => {
    onSubmit();
  };

 
  const renderFullNameField = (): React.ReactElement => {
    return (
      <CustomInput
        value={formData.name}
        onChangeText={(text: string) => handleFieldValueChange('name', text)}
        placeholder="Full Name"
        error={formErrors.name}
        autoCapitalize="words"
        returnKeyType="next"
      />
    );
  };

 
  const renderPhoneNumberField = (): React.ReactElement => {
    const PHONE_MAX_LENGTH = 15;
    
    return (
      <CustomInput
        value={formData.phone}
        onChangeText={(text: string) => handleFieldValueChange('phone', text)}
        placeholder="Phone Number"
        error={formErrors.phone}
        keyboardType="phone-pad"
        maxLength={PHONE_MAX_LENGTH}
        returnKeyType="next"
      />
    );
  };

  const renderEmailAddressField = (): React.ReactElement => {
    return (
      <CustomInput
        value={formData.email}
        onChangeText={(text: string) => handleFieldValueChange('email', text)}
        placeholder="Email Address"
        error={formErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />
    );
  };

 
  const renderPasswordField = (): React.ReactElement => {
    const PASSWORD_MIN_LENGTH = 6;
    
    return (
      <CustomInput
        value={formData.password}
        onChangeText={(text: string) => handleFieldValueChange('password', text)}
        placeholder={`Password (min. ${PASSWORD_MIN_LENGTH} characters)`}
        error={formErrors.password}
        secureTextEntry={true}
        returnKeyType="done"
        onSubmitEditing={handleFormSubmission}
      />
    );
  };

  const renderFormFields = (): React.ReactElement[] => {
    return [
      renderFullNameField(),
      renderPhoneNumberField(),
      renderEmailAddressField(),
      renderPasswordField(),
    ];
  };

  const dynamicStyles = createDynamicStyles();
  const formFields = renderFormFields();

  return (
    <View style={dynamicStyles.container}>
      {formFields.map((field, index) => (
        <React.Fragment key={index}>
          {field}
        </React.Fragment>
      ))}
    </View>
  );
};