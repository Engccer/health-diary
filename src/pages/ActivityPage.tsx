import { useState, useEffect } from 'react';
import { Card, Button } from '../components/common';
import { useActivity, useGamification, useToast } from '../hooks';
import { POINTS } from '../types';
import { getRelativeDate } from '../utils/date';
import './ActivityPage.css';

export function ActivityPage() {
  const { getTodayRecord, getRecentRecords, saveRecord, getWeeklyWalkingMinutes } = useActivity();
  const { addPoints } = useGamification();
  const { showSuccess, showAchievement } = useToast();

  const todayRecord = getTodayRecord();
  const recentRecords = getRecentRecords(7);
  const weeklyMinutes = getWeeklyWalkingMinutes();

  const [duration, setDuration] = useState(todayRecord?.walking.duration ?? 0);
  const [note, setNote] = useState(todayRecord?.note ?? '');
  const [saved, setSaved] = useState(!!todayRecord);

  useEffect(() => {
    if (todayRecord) {
      setDuration(todayRecord.walking.duration);
      setNote(todayRecord.note ?? '');
      setSaved(true);
    }
  }, [todayRecord]);

  const handleDurationChange = (value: number) => {
    setDuration(Math.max(0, value));
    setSaved(false);
  };

  const handleSave = () => {
    const isFirstRecord = !todayRecord;
    saveRecord({
      walking: { duration },
      note: note || undefined,
    });

    if (isFirstRecord) {
      const result = addPoints(POINTS.DAILY_ACTIVITY, {
        isActivity: true,
        walkingMinutes: duration,
      });
      if (result.newBadges.length > 0) {
        showAchievement('새로운 뱃지를 획득했어요!', '🏅');
      }
      if (result.levelUp) {
        showAchievement(`레벨 업! ${result.newLevel?.name}`, result.newLevel?.icon);
      }
    }

    setSaved(true);
    showSuccess('활동이 기록되었어요!');
  };

  const quickButtons = [10, 20, 30, 45, 60];

  return (
    <div className="page activity-page">
      {/* 걷기/산책 시간 */}
      <section className="activity-section" aria-labelledby="activity-walking-title">
        <h2 id="activity-walking-title" className="activity-section__title">
          오늘 걷기/산책은 얼마나 하셨나요?
        </h2>

        {/* 빠른 선택 */}
        <div className="quick-buttons" role="group" aria-label="빠른 시간 선택">
          {quickButtons.map((min) => (
            <button
              key={min}
              className={`quick-btn ${duration === min ? 'quick-btn--active' : ''}`}
              onClick={() => handleDurationChange(min)}
              aria-pressed={duration === min}
            >
              {min}분
            </button>
          ))}
        </div>

        {/* 직접 입력 */}
        <div className="duration-input">
          <button
            className="duration-btn"
            onClick={() => handleDurationChange(duration - 5)}
            aria-label="5분 감소"
          >
            −
          </button>
          <div className="duration-display">
            <span className="duration-value">{duration}</span>
            <span className="duration-unit">분</span>
          </div>
          <button
            className="duration-btn"
            onClick={() => handleDurationChange(duration + 5)}
            aria-label="5분 증가"
          >
            +
          </button>
        </div>

        {duration >= 30 && (
          <p className="activity-bonus">
            🎉 30분 이상 걸으셨네요! 추가 포인트를 받아요!
          </p>
        )}
      </section>

      {/* 메모 */}
      <section className="activity-section" aria-labelledby="activity-note-title">
        <h2 id="activity-note-title" className="activity-section__title">
          메모 (선택)
        </h2>
        <textarea
          className="activity-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder="어디서 산책하셨나요?"
          rows={3}
          aria-label="메모"
        />
      </section>

      {/* 저장 버튼 */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSave}
        disabled={saved || duration === 0}
      >
        {saved ? '✓ 저장 완료' : '저장하기'}
      </Button>

      {/* 주간 요약 */}
      <Card className="weekly-summary">
        <h3 className="weekly-summary__title">이번 주 걷기</h3>
        <div className="weekly-summary__stats">
          <span className="weekly-summary__value">{weeklyMinutes}</span>
          <span className="weekly-summary__unit">분</span>
        </div>
        <p className="weekly-summary__note">
          {weeklyMinutes >= 150
            ? '🎉 주간 권장량 달성!'
            : `주간 권장량까지 ${150 - weeklyMinutes}분 남았어요`}
        </p>
      </Card>

      {/* 최근 기록 */}
      {recentRecords.length > 0 && (
        <section className="activity-section" aria-labelledby="activity-history-title">
          <h2 id="activity-history-title" className="activity-section__title">
            최근 기록
          </h2>
          <div className="history-list">
            {recentRecords.map((record) => (
              <Card key={record.id} className="history-item" padding="sm">
                <span className="history-item__date">{getRelativeDate(record.date)}</span>
                <span className="history-item__icon" aria-hidden="true">🚶</span>
                <span className="history-item__value">{record.walking.duration}분</span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
