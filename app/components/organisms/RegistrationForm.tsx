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

/**
 * Interface for modal content configuration
 * Defines the structure for modal messages
 */
interface ModalContent {
  readonly title: string;
  readonly message: string;
}

/**
 * Interface for form submission result
 * Encapsulates the result of form validation and submission
 */
interface FormSubmissionResult {
  readonly isValid: boolean;
  readonly errors?: FormErrors;
  readonly firstErrorMessage?: string;
}

/**
 * Interface for button animation configuration
 * Defines animation scale values for button interactions
 */
interface ButtonAnimationConfig {
  readonly pressedScale: number;
  readonly normalScale: number;
}

/**
 * Interface for layout configuration
 * Encapsulates responsive layout properties
 */
interface LayoutConfiguration {
  readonly horizontalPadding: number;
  readonly verticalPadding: number;
  readonly minHeight: number;
}

/**
 * RegistrationForm Component
 * Responsible for rendering the complete user registration form
 * Follows single responsibility principle - handles form orchestration and user interactions
 */
export const RegistrationForm: React.FC = () => {
  // Dependency injection - similar to Java constructor injection
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

  // Component state management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
    title: '',
    message: '',
  });

  /**
   * Private method: Get button animation configuration
   * Centralizes animation scale values for consistency
   * @returns ButtonAnimationConfig object with scale values
   */
  const getButtonAnimationConfiguration = (): ButtonAnimationConfig => {
    return {
      pressedScale: 0.95,
      normalScale: 1.0,
    };
  };

  /**
   * Private method: Get modal content for different scenarios
   * Centralizes all modal messages for easy maintenance and localization
   * @param type - The type of modal content needed
   * @param customMessage - Optional custom message for validation errors
   * @returns ModalContent object with title and message
   */
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

  /**
   * Private method: Calculate responsive layout configuration
   * Determines padding and spacing based on device type
   * @returns LayoutConfiguration object with responsive layout properties
   */
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

  /**
   * Private method: Create container styles
   * Encapsulates main container styling logic
   * @returns ViewStyle object for main container
   */
  const createContainerStyles = (): ViewStyle => {
    return {
      flex: 1,
      backgroundColor: theme.colors.background,
    };
  };

  /**
   * Private method: Create scroll container styles
   * Encapsulates scroll view styling logic with responsive layout
   * @returns ViewStyle object for scroll container
   */
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

  /**
   * Private method: Create dynamic stylesheet
   * Combines all styling methods into a cohesive stylesheet
   * @returns StyleSheet object with all component styles
   */
  const createDynamicStylesheet = () => {
    return StyleSheet.create({
      container: createContainerStyles(),
      scrollContainer: createScrollContainerStyles(),
    });
  };

  /**
   * Private method: Validate form data before submission
   * Encapsulates form validation logic and error handling
   * @returns FormSubmissionResult object with validation results
   */
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

  /**
   * Private method: Show modal with specified content
   * Encapsulates modal display logic
   * @param title - Modal title
   * @param message - Modal message
   */
  const displayModal = useCallback((title: string, message: string): void => {
    setModalState({
      isVisible: true,
      title,
      message,
    });
  }, []);

  /**
   * Private method: Hide modal and handle post-modal actions
   * Encapsulates modal hiding logic and cleanup
   */
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

  /**
   * Private method: Reset form after successful submission
   * Encapsulates form reset logic
   */
  const resetFormAfterSuccess = (): void => {
    resetForm();
  };

  /**
   * Private method: Handle form validation errors
   * Encapsulates validation error handling logic
   * @param validationResult - The validation result object
   */
  const handleValidationErrors = (validationResult: FormSubmissionResult): void => {
    if (validationResult.errors) {
      setFormErrors(validationResult.errors);
    }
    
    if (validationResult.firstErrorMessage) {
      const modalContent = getModalContent('validation_error', validationResult.firstErrorMessage);
      displayModal(modalContent.title, modalContent.message);
    }
  };

  /**
   * Private method: Execute form submission to server
   * Encapsulates API submission logic
   * @returns Promise<boolean> indicating success or failure
   */
  const executeFormSubmission = async (): Promise<boolean> => {
    try {
      await submitForm(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Private method: Handle successful form submission
   * Encapsulates success handling logic
   */
  const handleSubmissionSuccess = (): void => {
    const modalContent = getModalContent('success');
    displayModal(modalContent.title, modalContent.message);
  };

  /**
   * Private method: Handle form submission failure
   * Encapsulates error handling logic
   */
  const handleSubmissionFailure = (): void => {
    const modalContent = getModalContent('server_error');
    displayModal(modalContent.title, modalContent.message);
  };

  /**
   * Private method: Set loading state and animate button
   * Encapsulates loading state management
   * @param loading - Loading state
   */
  const setLoadingStateWithAnimation = (loading: boolean): void => {
    const animationConfig = getButtonAnimationConfiguration();
    
    setIsLoading(loading);
    animateButton(loading ? animationConfig.pressedScale : animationConfig.normalScale);
  };

  /**
   * Private method: Handle complete form submission process
   * Orchestrates the entire form submission workflow
   */
  const handleFormSubmission = useCallback(async (): Promise<void> => {
    // Step 1: Validate form data
    const validationResult = validateFormBeforeSubmission();
    
    if (!validationResult.isValid) {
      handleValidationErrors(validationResult);
      return;
    }

    // Step 2: Set loading state and animate button
    setLoadingStateWithAnimation(true);

    // Step 3: Execute form submission
    const isSubmissionSuccessful = await executeFormSubmission();

    // Step 4: Handle submission result
    if (isSubmissionSuccessful) {
      handleSubmissionSuccess();
    } else {
      handleSubmissionFailure();
    }

    // Step 5: Reset loading state
    setLoadingStateWithAnimation(false);
  }, [formData, validateFormData, setFormErrors, animateButton, submitForm]);

  /**
   * Private method: Handle button press animation
   * Encapsulates button press animation logic
   */
  const handleButtonPressAnimation = (): void => {
    if (!isLoading) {
      const animationConfig = getButtonAnimationConfiguration();
      animateButton(animationConfig.pressedScale);
    }
  };

  /**
   * Private method: Handle button release animation
   * Encapsulates button release animation logic
   */
  const handleButtonReleaseAnimation = (): void => {
    if (!isLoading) {
      const animationConfig = getButtonAnimationConfiguration();
      animateButton(animationConfig.normalScale);
    }
  };

  /**
   * Private method: Render form fields section
   * Encapsulates form fields rendering logic
   * @returns React.ReactElement containing form fields
   */
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

  /**
   * Private method: Render submit button
   * Encapsulates submit button rendering logic
   * @returns React.ReactElement containing submit button
   */
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

  /**
   * Private method: Render modal component
   * Encapsulates modal rendering logic
   * @returns React.ReactElement containing modal
   */
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

  /**
   * Private method: Render scroll view content
   * Orchestrates the rendering of all form content
   * @param scrollContainerStyles - Styles for scroll container
   * @returns React.ReactElement containing scroll view content
   */
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

  /**
   * Private method: Render keyboard avoiding view
   * Encapsulates keyboard avoiding view rendering logic
   * @param containerStyles - Styles for main container
   * @param scrollContent - Scroll view content element
   * @returns React.ReactElement containing keyboard avoiding view
   */
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

  // Main render method - similar to Java's main execution method
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