import { useState, useCallback } from 'react';
import { FormData, FormErrors } from '../types/theme';
import { validateForm } from '../utils/validation';

interface UseFormReturn {
  formData: FormData;
  formErrors: FormErrors;
  isLoading: boolean;
  updateField: (field: keyof FormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

interface UseFormProps {
  onSuccess: (message: string) => void;
  onError: (title: string, message: string) => void;
}

export const useForm = ({ onSuccess, onError }: UseFormProps): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
    });
    setFormErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(formData);
    
    if (validationErrors) {
      setFormErrors(validationErrors);
      const firstErrorMessage = Object.values(validationErrors)[0];
      onError('Erro de Validação', firstErrorMessage);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 2500));
      onSuccess('Sua conta foi criada com sucesso. Bem-vindo!');
      resetForm();
    } catch (error) {
      onError('Erro no Servidor', 'Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, onError, onSuccess, resetForm]);

  return {
    formData,
    formErrors,
    isLoading,
    updateField,
    handleSubmit,
    resetForm,
  };
};