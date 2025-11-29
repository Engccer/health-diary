import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, CollapsibleCard, ChangelogModal } from '../components/common';
import { BadgeCard } from '../components/gamification';
import { useGamification, useCondition, useActivity, useSettings } from '../hooks';
import { BADGES } from '../data/badges';
import { HEALTH_ARTICLES } from '../data/healthInfo';
import { CATEGORY_LABELS, HealthArticle } from '../types';
import './ProfilePage.css';

export function ProfilePage() {
  const { progress, currentLevel, levelProgress, earnedBadges } = useGamification();
  const { getTotalRecordDays } = useCondition();
  const { getTotalActivityDays } = useActivity();
  const { settings } = useSettings();

  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [isHealthInfoExpanded, setIsHealthInfoExpanded] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const totalConditionDays = getTotalRecordDays();
  const totalActivityDays = getTotalActivityDays();

  // 기사 상세 뷰
  if (selectedArticle) {
    return (
      <div className="page profile-page">
        <button
          className="info-back-btn"
          onClick={() => setSelectedArticle(null)}
          aria-label="목록으로 돌아가기"
        >
          ← 목록으로
        </button>
        <article className="article-detail">
          <header className="article-detail__header">
            <span className="article-detail__icon" aria-hidden="true">
              {selectedArticle.icon}
            </span>
            <h1 className="article-detail__title">{selectedArticle.title}</h1>
            <p className="article-detail__meta">
              {CATEGORY_LABELS[selectedArticle.category]} · {selectedArticle.readTime}분 읽기
            </p>
          </header>
          <div
            className="article-detail__content"
            dangerouslySetInnerHTML={{
              __html: selectedArticle.content
                .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                .replace(/^\d+\. \*\*(.+?)\*\*$/gm, '<p><strong>$1</strong></p>')
                .replace(/^- (.+)$/gm, '<li>$1</li>')
                .replace(/(<li>.*<\/li>)+/gs, '<ul>$&</ul>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </article>
      </div>
    );
  }

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

      {/* 설정 및 업데이트 기록 버튼 */}
      <div className="profile-actions">
        <Link to="/settings">
          <Button variant="outline" size="md" fullWidth icon="⚙️">
            설정
          </Button>
        </Link>
        <Button
          variant="outline"
          size="md"
          fullWidth
          icon="📋"
          onClick={() => setShowChangelog(true)}
        >
          업데이트 기록
        </Button>
      </div>

      {/* 나의 현황 (접기/펼치기) */}
      <CollapsibleCard
        defaultExpanded={false}
        ariaLabel="나의 현황 펼치기/접기"
        summary={
          <div className="status-summary">
            <div className="status-summary__item">
              <span className="status-summary__icon">{currentLevel.icon}</span>
              <span className="status-summary__text">{currentLevel.name}</span>
            </div>
            <div className="status-summary__divider" aria-hidden="true" />
            <div className="status-summary__item">
              <span className="status-summary__icon">🔥</span>
              <span className="status-summary__text">{progress.currentStreak}일</span>
            </div>
            <div className="status-summary__divider" aria-hidden="true" />
            <div className="status-summary__item">
              <span className="status-summary__icon">⭐</span>
              <span className="status-summary__text">{progress.totalPoints}P</span>
            </div>
          </div>
        }
      >
        {/* 레벨 상세 */}
        <div className="status-detail">
          <div className="level-detail">
            <div className="level-detail__header">
              <span className="level-detail__icon">{currentLevel.icon}</span>
              <div className="level-detail__info">
                <span className="level-detail__name">Lv.{currentLevel.level} {currentLevel.name}</span>
                <span className="level-detail__points">{progress.totalPoints.toLocaleString()}P</span>
              </div>
            </div>
            <div className="level-detail__progress">
              <div
                className="level-detail__bar"
                style={{ width: `${levelProgress}%` }}
                role="progressbar"
                aria-valuenow={levelProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="level-detail__progress-text">다음 레벨까지 {100 - levelProgress}%</span>
          </div>

          {/* 스트릭 상세 */}
          <div className="streak-detail">
            <div className="streak-detail__current">
              <span className="streak-detail__icon">🔥</span>
              <span className="streak-detail__value">{progress.currentStreak}</span>
              <span className="streak-detail__unit">일 연속</span>
            </div>
            <span className="streak-detail__best">최장 기록: {progress.longestStreak}일</span>
          </div>

          {/* 통계 그리드 */}
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-item__value">{progress.totalRecordDays}</span>
              <span className="stat-item__label">총 기록일</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">{totalConditionDays}</span>
              <span className="stat-item__label">컨디션</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">{totalActivityDays}</span>
              <span className="stat-item__label">활동</span>
            </div>
          </div>
        </div>
      </CollapsibleCard>

      {/* 뱃지 컬렉션 (접기/펼치기) */}
      <CollapsibleCard
        defaultExpanded={false}
        ariaLabel="뱃지 컬렉션 펼치기/접기"
        summary={
          <div className="badges-summary">
            <span className="badges-summary__title">뱃지 컬렉션</span>
            <span className="badges-summary__count">
              {earnedBadges.length}/{BADGES.length} 획득
            </span>
          </div>
        }
      >
        <div className="badges-grid">
          {BADGES.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={progress.earnedBadges.includes(badge.id)}
            />
          ))}
        </div>
      </CollapsibleCard>

      {/* 건강 정보 섹션 */}
      <section className="health-info-section" aria-labelledby="health-info-heading">
        <button
          className="health-info-header"
          onClick={() => setIsHealthInfoExpanded(!isHealthInfoExpanded)}
          aria-expanded={isHealthInfoExpanded}
          aria-controls="health-info-content"
        >
          <h2 id="health-info-heading" className="health-info-title">건강 정보</h2>
          <span
            className={`health-info-arrow ${isHealthInfoExpanded ? 'health-info-arrow--expanded' : ''}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>

        <div
          id="health-info-content"
          className={`health-info-content ${isHealthInfoExpanded ? 'health-info-content--expanded' : ''}`}
          aria-hidden={!isHealthInfoExpanded}
        >
          <div className="article-list" role="list">
            {HEALTH_ARTICLES.map((article) => (
              <Card
                key={article.id}
                className="article-card"
                clickable
                onClick={() => setSelectedArticle(article)}
                aria-label={`${article.title} - ${article.summary}`}
              >
                <span className="article-card__icon" aria-hidden="true">
                  {article.icon}
                </span>
                <div className="article-card__content">
                  <h3 className="article-card__title">{article.title}</h3>
                  <p className="article-card__summary">{article.summary}</p>
                  <span className="article-card__meta">
                    {CATEGORY_LABELS[article.category]} · {article.readTime}분
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 업데이트 기록 모달 */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
      />
    </div>
  );
}
