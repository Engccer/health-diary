import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastData } from '../components/common';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastData['type'] = 'info',
      options?: { icon?: string; duration?: number }
    ) => {
      const id = uuidv4();
      const toast: ToastData = {
        id,
        message,
        type,
        icon: options?.icon,
        duration: options?.duration || 3000,
      };

      setToasts((prev) => [...prev, toast]);
      return id;
    },
    []
  );

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast]
  );

  const showAchievement = useCallback(
    (message: string, icon?: string) =>
      showToast(message, 'achievement', { icon, duration: 4000 }),
    [showToast]
  );

  return {
    toasts,
    showToast,
    closeToast,
    showSuccess,
    showError,
    showAchievement,
  };
}
