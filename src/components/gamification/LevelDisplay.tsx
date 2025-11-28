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
    <div className="level-display" aria-label={`현재 레벨: ${level.level} ${level.name}`}>
      <div className="level-display__header">
        <span className="level-display__icon" aria-hidden="true">
          {level.icon}
        </span>
        <div className="level-display__info">
          <span className="level-display__name">Lv.{level.level} {level.name}</span>
          <span className="level-display__points">{points.toLocaleString()} 포인트</span>
        </div>
      </div>
      <ProgressBar
        value={progress}
        max={100}
        size="md"
        color="primary"
      />
    </div>
  );
}
