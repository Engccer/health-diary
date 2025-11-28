import './StreakDisplay.css';

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakDisplay({ streak, size = 'md' }: StreakDisplayProps) {
  return (
    <div
      className={`streak-display streak-display--${size}`}
      role="status"
      aria-label={`${streak}일 연속 기록 중`}
    >
      <span className="streak-display__icon" aria-hidden="true">
        🔥
      </span>
      <span className="streak-display__number">{streak}</span>
      <span className="streak-display__label">일 연속</span>
    </div>
  );
}
