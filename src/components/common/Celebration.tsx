import { useEffect, useState } from 'react';
import { playSuccess, playLevelUp, playBadge } from '../../utils/sound';
import './Celebration.css';

export type CelebrationType = 'success' | 'levelup' | 'badge';

interface CelebrationProps {
  type: CelebrationType;
  show: boolean;
  onComplete?: () => void;
  message?: string;
  subMessage?: string;
}

export function Celebration({ type, show, onComplete, message, subMessage }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);

      // 사운드 재생
      switch (type) {
        case 'success':
          playSuccess();
          break;
        case 'levelup':
          playLevelUp();
          break;
        case 'badge':
          playBadge();
          break;
      }

      // 애니메이션 종료 후 콜백
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 300);
      }, type === 'success' ? 1500 : 2500);

      return () => clearTimeout(timer);
    }
  }, [show, type, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`celebration celebration--${type} ${isAnimating ? 'celebration--active' : 'celebration--exit'}`}
      role="status"
      aria-live="polite"
    >
      <div className="celebration__content">
        {type === 'success' && (
          <div className="celebration__icon celebration__icon--success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {type === 'levelup' && (
          <div className="celebration__icon celebration__icon--levelup">
            🎉
          </div>
        )}
        {type === 'badge' && (
          <div className="celebration__icon celebration__icon--badge">
            🏆
          </div>
        )}
        {message && <p className="celebration__message">{message}</p>}
        {subMessage && <p className="celebration__sub-message">{subMessage}</p>}
      </div>
      {(type === 'levelup' || type === 'badge') && (
        <div className="celebration__confetti" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="celebration__particle" style={{
              '--delay': `${Math.random() * 0.5}s`,
              '--x': `${Math.random() * 200 - 100}px`,
              '--rotation': `${Math.random() * 360}deg`,
            } as React.CSSProperties} />
          ))}
        </div>
      )}
    </div>
  );
}
