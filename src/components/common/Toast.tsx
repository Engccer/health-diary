import { useEffect, useState } from 'react';
import './Toast.css';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  icon?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션을 위해 약간의 지연 후 표시
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const typeIcons: Record<string, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    achievement: '🎉',
  };

  return (
    <div
      className={`toast toast--${toast.type} ${isVisible ? 'toast--visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast__icon" aria-hidden="true">
        {toast.icon || typeIcons[toast.type]}
      </span>
      <span className="toast__message">{toast.message}</span>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="알림">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
