import { useState } from 'react';
import { Card, Button, Celebration, BottomSheet, ConfirmDialog } from '../components/common';
import { useActivity, useGamification } from '../hooks';
import { POINTS, ActivityRecord } from '../types';
import { BADGES } from '../data/badges';
import { getRelativeDateTimeFromTimestamp } from '../utils/date';
import { playIncrement, playDecrement, playToggle } from '../utils/sound';
import './ActivityPage.css';

export function ActivityPage() {
  const { getRecentRecords, saveRecord, updateRecord, deleteRecord, getWeeklyWalkingMinutes, getTodayRecordCount } = useActivity();
  const { addPoints } = useGamification();

  const recentRecords = getRecentRecords(7);
  const weeklyMinutes = getWeeklyWalkingMinutes();
  const todayCount = getTodayRecordCount();

  // 항상 기본값으로 시작 (이전 기록으로 채우지 않음)
  const [duration, setDuration] = useState(0);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'success' | 'levelup' | 'badge'>('success');
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationSubMessage, setCelebrationSubMessage] = useState('');

  // 수정/삭제 관련 상태
  const [editingRecord, setEditingRecord] = useState<ActivityRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ActivityRecord | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDurationChange = (value: number) => {
    setDuration(Math.max(0, value));
    setSaved(false);
  };

  const resetForm = () => {
    setDuration(0);
    setNote('');
    setSaved(false);
  };

  const handleSave = () => {
    const isFirstRecordToday = todayCount === 0;
    saveRecord({
      walking: { duration },
      note: note || undefined,
    });

    // 오늘 첫 기록일 때만 포인트 지급
    if (isFirstRecordToday) {
      const result = addPoints(POINTS.DAILY_ACTIVITY, {
        isActivity: true,
        walkingMinutes: duration,
      });
      if (result.levelUp && result.newLevel) {
        setCelebrationType('levelup');
        setCelebrationMessage('레벨 업!');
        setCelebrationSubMessage(result.newLevel.name);
        setShowCelebration(true);
        return;
      }
      if (result.newBadges.length > 0) {
        const badge = BADGES.find(b => b.id === result.newBadges[0]);
        setCelebrationType('badge');
        setCelebrationMessage('새로운 뱃지 획득!');
        setCelebrationSubMessage(badge?.name || '');
        setShowCelebration(true);
        return;
      }
    }

    // 일반 저장 성공 애니메이션
    setCelebrationType('success');
    setCelebrationMessage('저장 완료!');
    setCelebrationSubMessage('');
    setShowCelebration(true);
    setSaved(true);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    // 저장 후 폼 초기화하여 다음 기록 준비
    resetForm();
  };

  // 기록 탭하여 선택
  const handleRecordTap = (record: ActivityRecord) => {
    setSelectedRecord(record);
    setShowBottomSheet(true);
  };

  // 수정 시작
  const handleEdit = () => {
    if (!selectedRecord) return;
    setEditingRecord(selectedRecord);
    setDuration(selectedRecord.walking.duration);
    setNote(selectedRecord.note ?? '');
    setSaved(false);
    setShowBottomSheet(false);
  };

  // 수정 저장
  const handleUpdateSave = () => {
    if (!editingRecord) return;
    updateRecord(editingRecord.id, {
      walking: { duration },
      note: note || undefined,
    });
    setCelebrationType('success');
    setCelebrationMessage('수정 완료!');
    setCelebrationSubMessage('');
    setShowCelebration(true);
    setEditingRecord(null);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingRecord(null);
    resetForm();
  };

  // 삭제 확인 열기
  const handleDeleteClick = () => {
    setShowBottomSheet(false);
    setShowDeleteConfirm(true);
  };

  // 삭제 실행
  const handleDeleteConfirm = () => {
    if (!selectedRecord) return;
    deleteRecord(selectedRecord.id);
    setShowDeleteConfirm(false);
    setSelectedRecord(null);
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
              onClick={() => {
                playToggle();
                handleDurationChange(min);
              }}
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
            onClick={() => {
              playDecrement();
              handleDurationChange(duration - 5);
            }}
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
            onClick={() => {
              playIncrement();
              handleDurationChange(duration + 5);
            }}
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
      {editingRecord ? (
        <div className="activity-page__edit-actions">
          <Button variant="outline" size="lg" onClick={handleCancelEdit}>
            취소
          </Button>
          <Button variant="primary" size="lg" onClick={handleUpdateSave}>
            수정 저장
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={saved || duration === 0}
        >
          {saved ? '✓ 저장 완료' : '저장하기'}
        </Button>
      )}

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
              <Card
                key={record.id}
                className="history-item"
                padding="sm"
                clickable
                onClick={() => handleRecordTap(record)}
              >
                <span className="history-item__date">{getRelativeDateTimeFromTimestamp(record.timestamp)}</span>
                <span className="history-item__icon" aria-hidden="true">🚶</span>
                <span className="history-item__value">{record.walking.duration}분</span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 축하 애니메이션 */}
      <Celebration
        type={celebrationType}
        show={showCelebration}
        onComplete={handleCelebrationComplete}
        message={celebrationMessage}
        subMessage={celebrationSubMessage}
      />

      {/* 수정/삭제 바텀시트 */}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        title="기록 관리"
      >
        <button className="bottom-sheet__action" onClick={handleEdit}>
          <span className="bottom-sheet__action-icon">✏️</span>
          <span className="bottom-sheet__action-text">수정하기</span>
        </button>
        <button className="bottom-sheet__action bottom-sheet__action--danger" onClick={handleDeleteClick}>
          <span className="bottom-sheet__action-icon">🗑️</span>
          <span className="bottom-sheet__action-text">삭제하기</span>
        </button>
        <button className="bottom-sheet__cancel" onClick={() => setShowBottomSheet(false)}>
          취소
        </button>
      </BottomSheet>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="기록 삭제"
        message="이 기록을 삭제하시겠어요? 삭제된 기록은 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
