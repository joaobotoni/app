import { useTheme } from '@/app/contexts/ThemeContext';
import { useButtonAnimation } from '@/app/hooks/useAnimations';
import { useApi } from '@/app/hooks/useApi';
import { useFormLogic } from '@/app/hooks/useFormLogic';
import { useResponsive } from '@/app/hooks/useResponsive';
import { ModalState, FormData, FormErrors } from '@/app/types';
import React, { useCallback, useState } from 'react';
import { 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet,
  ViewStyle 
} from 'react-native';
import { CustomButton } from '../atoms/CustomButton';
import { CustomModal } from '../molecules/CustomModal';
import { FormFields } from './FormFields';
import { FormFooter } from './FormFooter';
import { FormHeader } from './FormHeader';

interface ModalContent {
  readonly title: string;
  readonly message: string;
}

interface FormSubmissionResult {
  readonly isValid: boolean;
  readonly errors?: FormErrors;
  readonly firstErrorMessage?: string;
}

interface ButtonAnimationConfig {
  readonly pressedScale: number;
  readonly normalScale: number;
}

interface LayoutConfiguration {
  readonly horizontalPadding: number;
  readonly verticalPadding: number;
  readonly minHeight: number;
}

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    title: '',
    message: '',
  });


  const getButtonAnimationConfiguration = (): ButtonAnimationConfig => {
    return {
      pressedScale: 0.95,
      normalScale: 1.0,
    };
  };

  const getModalContent = (
    type: 'validation_error' | 'success' | 'server_error',
    customMessage?: string
  ): ModalContent => {
    const modalContents = {
      validation_error: {
        title: 'Validation Error',
        message: customMessage || 'Please check your input and try again.',
      },
      success: {
        title: 'Success!',
        message: 'Your account has been created successfully. Welcome!',
      },
      server_error: {
        title: 'Server Error',
        message: 'Unable to create your account. Please try again.',
      },
    };

    return modalContents[type];
  };

 
  const calculateResponsiveLayout = (): LayoutConfiguration => {
    const screenHeight = responsive.screenHeight || Dimensions.get('window').height;
    
    return {
      horizontalPadding: responsive.isTablet 
        ? theme.spacing.xl * 2 
        : theme.spacing.lg,
      verticalPadding: theme.spacing.xl,
      minHeight: screenHeight,
    };
  };

  const createContainerStyles = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: theme.colors.background,
    };
  };

  const createScrollContainerStyles = (): ViewStyle => {
    const layout = calculateResponsiveLayout();

    return {
      flexGrow: 1,
      paddingHorizontal: layout.horizontalPadding,
      paddingVertical: layout.verticalPadding,
      justifyContent: 'center',
      minHeight: layout.minHeight,
    };
  };

  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      scrollContainer: createScrollContainerStyles(),
    });
  };

  const validateFormBeforeSubmission = (): FormSubmissionResult => {
    const validationErrors = validateFormData();
    
    if (validationErrors) {
      const firstErrorMessage = Object.values(validationErrors)[0];
      return {
        isValid: false,
        errors: validationErrors,
        firstErrorMessage,
      };
    }

    return { isValid: true };
  };

  const displayModal = useCallback((title: string, message: string): void => {
    setModalState({
      isVisible: true,
      title,
      message,
    });
  }, []);

  const hideModal = useCallback((): void => {
    const isSuccessModal = modalState.title === 'Success!';
    
    setModalState(prevState => ({ 
      ...prevState, 
      isVisible: false 
    }));

    if (isSuccessModal) {
      resetFormAfterSuccess();
    }
  }, [modalState.title]);

  const resetFormAfterSuccess = (): void => {
    resetForm();
  };

  const handleValidationErrors = (validationResult: FormSubmissionResult): void => {
    if (validationResult.errors) {
      setFormErrors(validationResult.errors);
    }
    
    if (validationResult.firstErrorMessage) {
      const modalContent = getModalContent('validation_error', validationResult.firstErrorMessage);
      displayModal(modalContent.title, modalContent.message);
    }
  };

  const executeFormSubmission = async (): Promise<boolean> => {
    try {
      await submitForm(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmissionSuccess = (): void => {
    const modalContent = getModalContent('success');
    displayModal(modalContent.title, modalContent.message);
  };

  const handleSubmissionFailure = (): void => {
    const modalContent = getModalContent('server_error');
    displayModal(modalContent.title, modalContent.message);
  };

  const setLoadingStateWithAnimation = (loading: boolean): void => {
    const animationConfig = getButtonAnimationConfiguration();
    
    setIsLoading(loading);
    animateButton(loading ? animationConfig.pressedScale : animationConfig.normalScale);
  };

  const handleFormSubmission = useCallback(async (): Promise<void> => {
    const validationResult = validateFormBeforeSubmission();
    
    if (!validationResult.isValid) {
      handleValidationErrors(validationResult);
      return;
    }

    setLoadingStateWithAnimation(true);

    const isSubmissionSuccessful = await executeFormSubmission();

    if (isSubmissionSuccessful) {
      handleSubmissionSuccess();
    } else {
      handleSubmissionFailure();
    }

    setLoadingStateWithAnimation(false);
  }, [formData, validateFormData, setFormErrors, animateButton, submitForm]);

  const handleButtonPressAnimation = (): void => {
    if (!isLoading) {
      const animationConfig = getButtonAnimationConfiguration();
      animateButton(animationConfig.pressedScale);
    }
  };

  const handleButtonReleaseAnimation = (): void => {
    if (!isLoading) {
      const animationConfig = getButtonAnimationConfiguration();
      animateButton(animationConfig.normalScale);
    }
  };

  const renderFormFieldsSection = (): React.ReactElement => {
    return (
      <FormFields
        formData={formData}
        formErrors={formErrors}
        onFieldChange={updateField}
        onSubmit={handleFormSubmission}
      />
    );
  };

  const renderSubmitButton = (): React.ReactElement => {
    return (
      <CustomButton
        title="Create Account"
        onPress={handleFormSubmission}
        loading={isLoading}
        animatedStyle={{ transform: [{ scale: buttonScale }] }}
        onPressIn={handleButtonPressAnimation}
        onPressOut={handleButtonReleaseAnimation}
      />
    );
  };

  const renderModalComponent = (): React.ReactElement => {
    return (
      <CustomModal
        isVisible={modalState.isVisible}
        title={modalState.title}
        message={modalState.message}
        onClose={hideModal}
      />
    );
  };

  const renderScrollViewContent = (scrollContainerStyles: ViewStyle): React.ReactElement => {
    const formFieldsSection = renderFormFieldsSection();
    const submitButton = renderSubmitButton();

    return (
      <ScrollView
        contentContainerStyle={scrollContainerStyles}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FormHeader />
        {formFieldsSection}
        {submitButton}
        <FormFooter />
      </ScrollView>
    );
  };

  const renderKeyboardAvoidingView = (
    containerStyles: ViewStyle,
    scrollContent: React.ReactElement
  ): React.ReactElement => {
    return (
      <KeyboardAvoidingView 
        style={containerStyles}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollContent}
      </KeyboardAvoidingView>
    );
  };

  const dynamicStyles = createDynamicStylesheet();
  const scrollContent = renderScrollViewContent(dynamicStyles.scrollContainer);
  const keyboardAvoidingView = renderKeyboardAvoidingView(dynamicStyles.container, scrollContent);
  const modalComponent = renderModalComponent();

  return (
    <>
      {keyboardAvoidingView}
      {modalComponent}
    </>
  );
};