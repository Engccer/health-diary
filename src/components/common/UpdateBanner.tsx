import { Button } from './Button';
import './UpdateBanner.css';

interface UpdateBannerProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export function UpdateBanner({ show, onUpdate, onDismiss }: UpdateBannerProps) {
  if (!show) return null;

  return (
    <div className="update-banner" role="alert" aria-live="polite">
      <div className="update-banner__content">
        <span className="update-banner__icon" aria-hidden="true">🔄</span>
        <p className="update-banner__text">
          새 버전이 있습니다!
        </p>
      </div>
      <div className="update-banner__actions">
        <Button variant="primary" size="sm" onClick={onUpdate}>
          업데이트
        </Button>
        <button className="update-banner__dismiss" onClick={onDismiss} aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  );
}
