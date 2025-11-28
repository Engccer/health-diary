import { Link } from 'react-router-dom';
import { Card, Button } from '../components/common';
import { StreakDisplay, LevelDisplay } from '../components/gamification';
import { useCondition, useActivity, useGamification, useSettings } from '../hooks';
import { formatKoreanDate } from '../utils/date';
import './HomePage.css';

export function HomePage() {
  const { hasRecordedToday: hasConditionToday } = useCondition();
  const { hasRecordedToday: hasActivityToday } = useActivity();
  const { progress, currentLevel, levelProgress } = useGamification();
  const { settings } = useSettings();

  const today = new Date();
  const greeting = getGreeting();
  const userName = settings.userName || '사용자';

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후예요';
    return '좋은 저녁이에요';
  }

  return (
    <div className="page home-page">
      {/* 인사 */}
      <section className="home-page__greeting" aria-label="인사">
        <h2 className="home-page__greeting-text">
          {greeting}, {userName}님! 👋
        </h2>
        <p className="home-page__date">{formatKoreanDate(today)}</p>
      </section>

      {/* 스트릭 */}
      {progress.currentStreak > 0 && (
        <section aria-label="연속 기록">
          <StreakDisplay streak={progress.currentStreak} size="lg" />
        </section>
      )}

      {/* 빠른 동작 - 기록 버튼 */}
      <section className="home-page__actions" aria-label="오늘의 기록">
        <Link to="/condition">
          <Button
            variant={hasConditionToday() ? 'secondary' : 'primary'}
            size="lg"
            fullWidth
            icon={hasConditionToday() ? '✓' : '💪'}
          >
            {hasConditionToday() ? '컨디션 기록 완료' : '컨디션 기록'}
          </Button>
        </Link>
        <Link to="/activity">
          <Button
            variant={hasActivityToday() ? 'secondary' : 'outline'}
            size="lg"
            fullWidth
            icon={hasActivityToday() ? '✓' : '🚶'}
          >
            {hasActivityToday() ? '활동 기록 완료' : '활동 기록'}
          </Button>
        </Link>
      </section>

      {/* 레벨 */}
      <section aria-label="레벨 정보">
        <LevelDisplay
          level={currentLevel}
          points={progress.totalPoints}
          progress={levelProgress}
        />
      </section>

      {/* 응원 메시지 */}
      <Card className="home-page__encouragement">
        <p className="home-page__encouragement-text">
          {getEncouragementMessage(progress.currentStreak, progress.totalRecordDays)}
        </p>
      </Card>
    </div>
  );
}

function getEncouragementMessage(streak: number, totalDays: number): string {
  if (totalDays === 0) {
    return '오늘부터 건강 기록을 시작해볼까요? 🌱';
  }
  if (streak === 0) {
    return '오늘도 기록하면 새로운 스트릭이 시작돼요! 💪';
  }
  if (streak >= 30) {
    return `${streak}일 연속! 정말 대단해요! 👑`;
  }
  if (streak >= 7) {
    return `${streak}일째 꾸준히 기록 중이에요! 🌟`;
  }
  if (streak >= 3) {
    return '좋은 습관이 만들어지고 있어요! 🔥';
  }
  return '오늘도 함께 건강을 챙겨요! 😊';
}
