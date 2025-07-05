import { FormData, FormErrors } from '../types/theme';

export const formatPhone = (text: string): string => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateForm = (data: FormData): FormErrors | null => {
  const errors: FormErrors = {};
  
  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  }
  
  if (!data.phone.trim()) {
    errors.phone = 'Telefone é obrigatório';
  }
  
  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email inválido';
  }
  
  if (!data.password.trim()) {
    errors.password = 'Senha é obrigatória';
  } else if (data.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};