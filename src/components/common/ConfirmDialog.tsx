import { useEffect } from 'react';
import { Button } from './Button';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="confirm-dialog">
        <h3 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'}
            className={variant === 'danger' ? 'confirm-dialog__btn--danger' : ''}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
