import { FormData } from '@/app/types';
import { useCallback } from 'react';

export const useApi= () => {
  const submitForm = useCallback(async (data: FormData): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Erro simulado do servidor'));
        }
      }, 2500);
    });
  }, []);

  return { submitForm };
};