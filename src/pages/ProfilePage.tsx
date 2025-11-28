import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { StreakDisplay, LevelDisplay, BadgeCard } from '../components/gamification';
import { useGamification, useCondition, useActivity, useSettings } from '../hooks';
import { BADGES } from '../data/badges';
import { HEALTH_ARTICLES, getArticlesByCategory } from '../data/healthInfo';
import { CATEGORY_LABELS, CATEGORY_ICONS, InfoCategory, HealthArticle } from '../types';
import './ProfilePage.css';

export function ProfilePage() {
  const { progress, currentLevel, levelProgress, earnedBadges } = useGamification();
  const { getTotalRecordDays } = useCondition();
  const { getTotalActivityDays } = useActivity();
  const { settings } = useSettings();

  const [selectedCategory, setSelectedCategory] = useState<InfoCategory | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  const totalConditionDays = getTotalRecordDays();
  const totalActivityDays = getTotalActivityDays();

  const categories: (InfoCategory | 'all')[] = ['all', 'diet', 'exercise', 'symptom', 'checkup', 'mental'];
  const filteredArticles =
    selectedCategory === 'all'
      ? HEALTH_ARTICLES
      : getArticlesByCategory(selectedCategory);

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

      {/* 건강 정보 */}
      <section className="health-info-section" aria-label="건강 정보">
        <h3 className="health-info-title">건강 정보</h3>

        {/* 카테고리 탭 */}
        <nav className="category-tabs" role="tablist" aria-label="카테고리 선택">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'category-tab--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat === 'all' ? '전체' : `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`}
            </button>
          ))}
        </nav>

        {/* 기사 목록 */}
        <div className="article-list" role="list">
          {filteredArticles.map((article) => (
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
                <h4 className="article-card__title">{article.title}</h4>
                <p className="article-card__summary">{article.summary}</p>
                <span className="article-card__meta">
                  {CATEGORY_LABELS[article.category]} · {article.readTime}분
                </span>
              </div>
            </Card>
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
