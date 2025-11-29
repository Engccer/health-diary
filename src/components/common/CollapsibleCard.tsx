import { useState, ReactNode } from 'react';
import { Card } from './Card';
import './CollapsibleCard.css';

interface CollapsibleCardProps {
  /** 항상 보이는 요약 영역 */
  summary: ReactNode;
  /** 펼쳤을 때 보이는 상세 영역 */
  children: ReactNode;
  /** 초기 펼침 상태 */
  defaultExpanded?: boolean;
  /** 섹션 레이블 (접근성) */
  ariaLabel?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function CollapsibleCard({
  summary,
  children,
  defaultExpanded = false,
  ariaLabel,
  className = '',
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`collapsible-card ${className}`}>
      <button
        className="collapsible-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
      >
        <div className="collapsible-card__summary">{summary}</div>
        <span
          className={`collapsible-card__arrow ${isExpanded ? 'collapsible-card__arrow--expanded' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      <div
        className={`collapsible-card__content ${isExpanded ? 'collapsible-card__content--expanded' : ''}`}
      >
        <div className="collapsible-card__inner">{children}</div>
      </div>
    </Card>
  );
}
