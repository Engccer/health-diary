import { useState } from 'react';
import { Card, Button, Celebration, BottomSheet, ConfirmDialog } from '../components/common';
import { useCondition, useGamification } from '../hooks';
import { SYMPTOM_LABELS, MOOD_OPTIONS, Symptoms, createEmptySymptoms, POINTS, ConditionRecord } from '../types';
import { BADGES } from '../data/badges';
import { getRelativeDateTimeFromTimestamp } from '../utils/date';
import './ConditionPage.css';

export function ConditionPage() {
  const { getRecentRecords, saveRecord, updateRecord, deleteRecord, getTodayRecordCount } = useCondition();
  const { addPoints } = useGamification();

  const recentRecords = getRecentRecords(7);
  const todayCount = getTodayRecordCount();

  // 항상 선택 없음으로 시작
  const [overallCondition, setOverallCondition] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [symptoms, setSymptoms] = useState<Symptoms>(createEmptySymptoms());
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'success' | 'levelup' | 'badge'>('success');
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationSubMessage, setCelebrationSubMessage] = useState('');

  // 수정/삭제 관련 상태
  const [editingRecord, setEditingRecord] = useState<ConditionRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ConditionRecord | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSymptomToggle = (key: keyof Symptoms) => {
    if (key === 'noSymptom') {
      // "특별한 증상 없음" 선택 시 다른 증상 모두 해제
      setSymptoms({
        ...createEmptySymptoms(),
        noSymptom: !symptoms.noSymptom,
      });
    } else {
      // 다른 증상 선택 시 "특별한 증상 없음" 해제
      setSymptoms((prev) => ({
        ...prev,
        [key]: !prev[key],
        noSymptom: false,
      }));
    }
    setSaved(false);
  };

  const resetForm = () => {
    setOverallCondition(null);
    setSymptoms(createEmptySymptoms());
    setMood(null);
    setNote('');
    setSaved(false);
  };

  const handleSave = () => {
    if (overallCondition === null || mood === null) return;

    const isFirstRecordToday = todayCount === 0;
    saveRecord({
      overallCondition,
      symptoms,
      mood,
      note: note || undefined,
    });

    // 오늘 첫 기록일 때만 포인트 지급
    if (isFirstRecordToday) {
      const result = addPoints(POINTS.DAILY_CONDITION, { isCondition: true });
      if (result.levelUp && result.newLevel) {
        setCelebrationType('levelup');
        setCelebrationMessage(`레벨 업!`);
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
  const handleRecordTap = (record: ConditionRecord) => {
    setSelectedRecord(record);
    setShowBottomSheet(true);
  };

  // 수정 시작
  const handleEdit = () => {
    if (!selectedRecord) return;
    setEditingRecord(selectedRecord);
    setOverallCondition(selectedRecord.overallCondition);
    setSymptoms(selectedRecord.symptoms ?? createEmptySymptoms());
    setMood(selectedRecord.mood);
    setNote(selectedRecord.note ?? '');
    setSaved(false);
    setShowBottomSheet(false);
  };

  // 수정 저장
  const handleUpdateSave = () => {
    if (!editingRecord || overallCondition === null || mood === null) return;
    updateRecord(editingRecord.id, {
      overallCondition,
      symptoms,
      mood,
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

  return (
    <div className="page condition-page">
      {/* 전체 컨디션 */}
      <section className="condition-section" aria-labelledby="condition-overall-title">
        <h2 id="condition-overall-title" className="condition-section__title">
          오늘 컨디션은 어떠세요?
        </h2>
        <div className="condition-slider" role="group" aria-label="컨디션 점수">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className={`condition-slider__btn ${overallCondition === value ? 'condition-slider__btn--active' : ''}`}
              onClick={() => {
                setOverallCondition(value as 1 | 2 | 3 | 4 | 5);
                setSaved(false);
              }}
              aria-pressed={overallCondition === value}
              aria-label={`${value}점`}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="condition-slider__label">
          {overallCondition === null ? '선택해 주세요' : overallCondition <= 2 ? '안 좋음' : overallCondition === 3 ? '보통' : '좋음'}
        </p>
      </section>

      {/* 증상 체크 */}
      <section className="condition-section" aria-labelledby="condition-symptoms-title">
        <h2 id="condition-symptoms-title" className="condition-section__title">
          오늘 불편한 증상이 있나요?
        </h2>
        <div className="symptom-grid" role="group" aria-label="증상 체크리스트">
          {(Object.keys(SYMPTOM_LABELS) as Array<keyof Symptoms>).map((key) => (
            <button
              key={key}
              className={`symptom-btn ${symptoms[key] ? 'symptom-btn--active' : ''} ${key === 'noSymptom' ? 'symptom-btn--no-symptom' : ''}`}
              onClick={() => handleSymptomToggle(key)}
              aria-pressed={symptoms[key]}
            >
              {SYMPTOM_LABELS[key]}
            </button>
          ))}
        </div>
      </section>

      {/* 기분 */}
      <section className="condition-section" aria-labelledby="condition-mood-title">
        <h2 id="condition-mood-title" className="condition-section__title">
          오늘 기분은 어떠세요?
        </h2>
        <div className="mood-picker" role="group" aria-label="기분 선택">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`mood-btn ${mood === option.value ? 'mood-btn--active' : ''}`}
              onClick={() => {
                setMood(option.value);
                setSaved(false);
              }}
              aria-pressed={mood === option.value}
              aria-label={option.label}
            >
              <span className="mood-btn__emoji" aria-hidden="true">
                {option.emoji}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 메모 */}
      <section className="condition-section" aria-labelledby="condition-note-title">
        <h2 id="condition-note-title" className="condition-section__title">
          메모 (선택)
        </h2>
        <textarea
          className="condition-note"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder="오늘의 특이사항이 있다면 적어주세요"
          rows={3}
          aria-label="메모"
        />
      </section>

      {/* 저장 버튼 */}
      {editingRecord ? (
        <div className="condition-page__edit-actions">
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
          disabled={saved || overallCondition === null || mood === null}
        >
          {saved ? '✓ 저장 완료' : overallCondition === null || mood === null ? '컨디션과 기분을 선택해 주세요' : '저장하기'}
        </Button>
      )}

      {/* 최근 기록 */}
      {recentRecords.length > 0 && (
        <section className="condition-section" aria-labelledby="condition-history-title">
          <h2 id="condition-history-title" className="condition-section__title">
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
                <span className="history-item__mood">{MOOD_OPTIONS.find(m => m.value === record.mood)?.emoji}</span>
                <span className="history-item__condition">컨디션 {record.overallCondition}/5</span>
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
