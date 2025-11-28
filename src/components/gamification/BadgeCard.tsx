import { Badge } from '../../types';
import './BadgeCard.css';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

export function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <div
      className={`badge-card ${earned ? 'badge-card--earned' : 'badge-card--locked'}`}
      aria-label={`${badge.name}: ${badge.description}${earned ? ' (획득함)' : ' (미획득)'}`}
    >
      <span className="badge-card__icon" aria-hidden="true">
        {earned ? badge.icon : '🔒'}
      </span>
      <span className="badge-card__name">{badge.name}</span>
      <span className="badge-card__description">{badge.description}</span>
    </div>
  );
}
