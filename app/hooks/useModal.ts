import { useState, useCallback } from 'react';
import { ModalState } from '../types/theme';

interface UseModalReturn {
  modal: ModalState;
  showModal: (title: string, message: string) => void;
  hideModal: () => void;
}

export const useModal = (): UseModalReturn => {
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
    setModal(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    modal,
    showModal,
    hideModal,
  };
};