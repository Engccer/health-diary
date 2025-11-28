import { useState, useEffect } from 'react';
import { Card, Button } from '../components/common';
import { useCondition, useGamification, useToast } from '../hooks';
import { SYMPTOM_LABELS, MOOD_OPTIONS, Symptoms, createEmptySymptoms, POINTS } from '../types';
import { getRelativeDate } from '../utils/date';
import './ConditionPage.css';

export function ConditionPage() {
  const { getTodayRecord, getRecentRecords, saveRecord } = useCondition();
  const { addPoints } = useGamification();
  const { showSuccess, showAchievement } = useToast();

  const todayRecord = getTodayRecord();
  const recentRecords = getRecentRecords(7);

  const [overallCondition, setOverallCondition] = useState<1 | 2 | 3 | 4 | 5>(
    todayRecord?.overallCondition ?? 3
  );
  const [symptoms, setSymptoms] = useState<Symptoms>(
    todayRecord?.symptoms ?? createEmptySymptoms()
  );
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(todayRecord?.mood ?? 3);
  const [note, setNote] = useState(todayRecord?.note ?? '');
  const [saved, setSaved] = useState(!!todayRecord);

  useEffect(() => {
    if (todayRecord) {
      setOverallCondition(todayRecord.overallCondition);
      setSymptoms(todayRecord.symptoms);
      setMood(todayRecord.mood);
      setNote(todayRecord.note ?? '');
      setSaved(true);
    }
  }, [todayRecord]);

  const handleSymptomToggle = (key: keyof Symptoms) => {
    setSymptoms((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    const isFirstRecord = !todayRecord;
    saveRecord({
      overallCondition,
      symptoms,
      mood,
      note: note || undefined,
    });

    if (isFirstRecord) {
      const result = addPoints(POINTS.DAILY_CONDITION, { isCondition: true });
      if (result.newBadges.length > 0) {
        showAchievement('새로운 뱃지를 획득했어요!', '🏅');
      }
      if (result.levelUp) {
        showAchievement(`레벨 업! ${result.newLevel?.name}`, result.newLevel?.icon);
      }
    }

    setSaved(true);
    showSuccess('컨디션이 기록되었어요!');
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
          {overallCondition <= 2 ? '안 좋음' : overallCondition === 3 ? '보통' : '좋음'}
        </p>
      </section>

      {/* 증상 체크 */}
      <section className="condition-section" aria-labelledby="condition-symptoms-title">
        <h2 id="condition-symptoms-title" className="condition-section__title">
          오늘 불편한 증상이 있나요?
        </h2>
        <div className="symptom-grid" role="group" aria-label="증상 체크리스트">
          {(Object.keys(symptoms) as Array<keyof Symptoms>).map((key) => (
            <button
              key={key}
              className={`symptom-btn ${symptoms[key] ? 'symptom-btn--active' : ''}`}
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
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleSave}
        disabled={saved}
      >
        {saved ? '✓ 저장 완료' : '저장하기'}
      </Button>

      {/* 최근 기록 */}
      {recentRecords.length > 0 && (
        <section className="condition-section" aria-labelledby="condition-history-title">
          <h2 id="condition-history-title" className="condition-section__title">
            최근 기록
          </h2>
          <div className="history-list">
            {recentRecords.map((record) => (
              <Card key={record.id} className="history-item" padding="sm">
                <span className="history-item__date">{getRelativeDate(record.date)}</span>
                <span className="history-item__mood">{MOOD_OPTIONS.find(m => m.value === record.mood)?.emoji}</span>
                <span className="history-item__condition">컨디션 {record.overallCondition}/5</span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
