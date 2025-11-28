import './ProgressBar.css';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'streak';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`progress-bar progress-bar--${size}`}>
      {(label || showValue) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {showValue && (
            <span className="progress-bar__value">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || '진행률'}
      >
        <div
          className={`progress-bar__fill progress-bar__fill--${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
