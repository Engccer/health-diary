import { useState } from 'react';
import { Card } from '../components/common';
import { HEALTH_ARTICLES, getArticlesByCategory } from '../data/healthInfo';
import { CATEGORY_LABELS, CATEGORY_ICONS, InfoCategory, HealthArticle } from '../types';
import './InfoPage.css';

export function InfoPage() {
  const [selectedCategory, setSelectedCategory] = useState<InfoCategory | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  const categories: (InfoCategory | 'all')[] = ['all', 'diet', 'exercise', 'symptom', 'checkup', 'mental'];

  const filteredArticles =
    selectedCategory === 'all'
      ? HEALTH_ARTICLES
      : getArticlesByCategory(selectedCategory);

  if (selectedArticle) {
    return (
      <div className="page info-page">
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
    <div className="page info-page">
      {/* 카테고리 필터 */}
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
  );
}
