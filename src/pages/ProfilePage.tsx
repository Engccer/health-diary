import { Link } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { StreakDisplay, LevelDisplay, BadgeCard } from '../components/gamification';
import { useGamification, useCondition, useActivity, useSettings } from '../hooks';
import { BADGES } from '../data/badges';
import './ProfilePage.css';

export function ProfilePage() {
  const { progress, currentLevel, levelProgress, earnedBadges } = useGamification();
  const { getTotalRecordDays } = useCondition();
  const { getTotalActivityDays } = useActivity();
  const { settings } = useSettings();

  const totalConditionDays = getTotalRecordDays();
  const totalActivityDays = getTotalActivityDays();

  return (
    <div className="page profile-page">
      {/* 프로필 헤더 */}
      <section className="profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {currentLevel.icon}
        </div>
        <h2 className="profile-name">{settings.userName || '사용자'}님</h2>
        <p className="profile-join">
          {progress.joinDate ? `${progress.joinDate}부터 함께` : '오늘부터 시작'}
        </p>
      </section>

      {/* 스트릭 */}
      <StreakDisplay streak={progress.currentStreak} size="lg" />

      {/* 레벨 */}
      <LevelDisplay
        level={currentLevel}
        points={progress.totalPoints}
        progress={levelProgress}
      />

      {/* 통계 */}
      <section className="stats-section" aria-label="통계">
        <h3 className="stats-title">나의 기록</h3>
        <div className="stats-grid">
          <Card className="stat-card">
            <span className="stat-value">{progress.totalRecordDays}</span>
            <span className="stat-label">총 기록일</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-value">{progress.longestStreak}</span>
            <span className="stat-label">최장 연속</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-value">{totalConditionDays}</span>
            <span className="stat-label">컨디션 기록</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-value">{totalActivityDays}</span>
            <span className="stat-label">활동 기록</span>
          </Card>
        </div>
      </section>

      {/* 뱃지 */}
      <section className="badges-section" aria-label="뱃지">
        <h3 className="badges-title">
          뱃지 ({earnedBadges.length}/{BADGES.length})
        </h3>
        <div className="badges-grid">
          {BADGES.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={progress.earnedBadges.includes(badge.id)}
            />
          ))}
        </div>
      </section>

      {/* 설정 링크 */}
      <Link to="/settings">
        <Button variant="outline" size="lg" fullWidth icon="⚙️">
          설정
        </Button>
      </Link>
    </div>
  );
}
