import { Level } from '../../types';
import { ProgressBar } from '../common';
import './LevelDisplay.css';

interface LevelDisplayProps {
  level: Level;
  points: number;
  progress: number;
}

export function LevelDisplay({ level, points, progress }: LevelDisplayProps) {
  return (
    <div className="level-display" aria-label={`현재 레벨: ${level.level}단계 ${level.name}`}>
      <div className="level-display__header">
        <span className="level-display__icon" aria-hidden="true">
          {level.icon}
        </span>
        <div className="level-display__info">
          <span className="level-display__name">{level.level}단계 {level.name}</span>
          <span className="level-display__points">{points.toLocaleString()} 포인트</span>
        </div>
      </div>
      <ProgressBar
        value={progress}
        max={100}
        size="md"
        color="primary"
      />
      <p className="level-display__hint">
        매일 기록하면 포인트가 쌓여 단계가 올라가요!
      </p>
    </div>
  );
}
