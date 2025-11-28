import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { Card, Button } from '../components/common';
import { StreakDisplay, LevelDisplay } from '../components/gamification';
import { useCondition, useActivity, useGamification, useSettings } from '../hooks';
import { formatKoreanDate, getTimeOfDay } from '../utils/date';
import { TIME_ANIMATIONS, TIME_GREETINGS, TIME_EMOJIS } from '../assets/timeAnimations';
import './HomePage.css';

export function HomePage() {
  const { getTodayRecordCount: getConditionCount } = useCondition();
  const { getTodayRecordCount: getActivityCount } = useActivity();
  const { progress, currentLevel, levelProgress } = useGamification();
  const { settings } = useSettings();

  const today = new Date();
  const timeOfDay = getTimeOfDay();
  const greeting = TIME_GREETINGS[timeOfDay];
  const animationUrl = TIME_ANIMATIONS[timeOfDay];
  const fallbackEmoji = TIME_EMOJIS[timeOfDay];
  const userName = settings.userName || '사용자';

  const [animationData, setAnimationData] = useState<object | null>(null);
  const [animationError, setAnimationError] = useState(false);

  // Lottie 애니메이션 로드
  useEffect(() => {
    setAnimationError(false);
    fetch(animationUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(data => setAnimationData(data))
      .catch(() => setAnimationError(true));
  }, [animationUrl]);

  const conditionCount = getConditionCount();
  const activityCount = getActivityCount();

  return (
    <div className="page home-page">
      {/* 인사 + 애니메이션 */}
      <section className="home-page__greeting" aria-label="인사">
        <div className="home-page__animation">
          {animationData && !animationError ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: 120, height: 120 }}
            />
          ) : (
            <span className="home-page__emoji">{fallbackEmoji}</span>
          )}
        </div>
        <h2 className="home-page__greeting-text">
          {greeting}, {userName}님!
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
            variant="primary"
            size="lg"
            fullWidth
            icon="💪"
          >
            컨디션 기록하기
            {conditionCount > 0 && (
              <span className="home-page__record-count">오늘 {conditionCount}회</span>
            )}
          </Button>
        </Link>
        <Link to="/activity">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon="🚶"
          >
            활동 기록하기
            {activityCount > 0 && (
              <span className="home-page__record-count">오늘 {activityCount}회</span>
            )}
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
