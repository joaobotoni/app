import { FormData, FormErrors } from '@/app/types';
import { useCallback, useState } from 'react';
import { useFormValidation } from './useFormValidation';

export const useFormLogic = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { formatPhone, validateForm } = useFormValidation();

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'phone' ? formatPhone(value) : value,
    }));
    
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, [formatPhone]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
    });
    setFormErrors({});
  }, []);

  const validateFormData = useCallback(() => {
    return validateForm(formData);
  }, [formData, validateForm]);

  return {
    formData,
    formErrors,
    updateField,
    resetForm,
    validateFormData,
    setFormErrors,
  };
};