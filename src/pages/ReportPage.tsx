import { useState, useRef } from 'react';
import { Card, Button } from '../components/common';
import { ConditionChart, ActivityChart } from '../components/report';
import { useReport } from '../hooks';
import { MOOD_OPTIONS, SYMPTOM_LABELS, Symptoms, ConditionRecord, ActivityRecord } from '../types';
import { formatKoreanDate, formatTime } from '../utils/date';
import {
  canShare,
  captureElement,
  shareReport,
  downloadImage,
  copyToClipboard,
  formatDateForShare,
  formatDateRangeForShare,
} from '../utils/share';
import './ReportPage.css';

type ReportTab = 'daily' | 'weekly';

export function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('daily');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const { getTodayReport, getWeeklyReport } = useReport();

  const dailyReportRef = useRef<HTMLDivElement>(null);
  const weeklyReportRef = useRef<HTMLDivElement>(null);

  const todayReport = getTodayReport;
  const weeklyReport = getWeeklyReport;

  // 일일 보고서 공유 텍스트 생성
  const generateDailyShareText = (): string => {
    const dateStr = formatDateForShare(todayReport.date);
    let text = `📋 건강일기 - ${dateStr}\n\n`;

    // 컨디션 기록들
    if (todayReport.conditions.length > 0) {
      const avgCondition = todayReport.conditions.reduce((sum, c) => sum + c.overallCondition, 0) / todayReport.conditions.length;
      const conditionLabel =
        avgCondition <= 2 ? '안 좋음' :
        avgCondition <= 3 ? '보통' : '좋음';
      text += `💪 컨디션: ${avgCondition.toFixed(1)}/5 (${conditionLabel}) - ${todayReport.conditions.length}회 기록\n`;

      // 모든 기분 취합
      const moods = todayReport.conditions
        .map(c => MOOD_OPTIONS.find(m => m.value === c.mood)?.label)
        .filter(Boolean);
      if (moods.length > 0) {
        text += `😊 기분: ${[...new Set(moods)].join(', ')}\n`;
      }

      // 모든 증상 취합
      const symptomSet = new Set<string>();
      todayReport.conditions.forEach(c => {
        if (c.symptoms && !c.symptoms.noSymptom) {
          (Object.keys(c.symptoms) as Array<keyof Symptoms>)
            .filter(key => key !== 'noSymptom' && c.symptoms[key])
            .forEach(key => symptomSet.add(SYMPTOM_LABELS[key]));
        }
      });
      if (symptomSet.size > 0) {
        text += `🩺 증상: ${[...symptomSet].join(', ')}\n`;
      } else if (todayReport.conditions.some(c => c.symptoms?.noSymptom)) {
        text += `🩺 증상: 특별한 증상 없음\n`;
      }
    }

    // 활동 기록들
    if (todayReport.activities.length > 0) {
      const totalDuration = todayReport.activities.reduce((sum, a) => sum + a.walking.duration, 0);
      text += `🚶 활동: 총 ${totalDuration}분 (${todayReport.activities.length}회)\n`;
    }

    text += `\n#건강일기`;
    return text;
  };

  // 주간 보고서 공유 텍스트 생성
  const generateWeeklyShareText = (): string => {
    const dateRange = formatDateRangeForShare(weeklyReport.startDate, weeklyReport.endDate);
    let text = `📊 건강일기 주간 보고서\n`;
    text += `📅 ${dateRange}\n\n`;
    text += `📝 기록일: ${weeklyReport.recordedDays}일\n`;
    if (weeklyReport.averageCondition !== null) {
      text += `💪 평균 컨디션: ${weeklyReport.averageCondition.toFixed(1)}\n`;
    }
    text += `🚶 총 활동: ${weeklyReport.totalActivityMinutes}분\n`;
    text += `\n#건강일기`;
    return text;
  };

  // 공유 핸들러
  const handleShare = async (type: 'daily' | 'weekly') => {
    const ref = type === 'daily' ? dailyReportRef : weeklyReportRef;
    if (!ref.current) return;

    setIsSharing(true);
    setShareMessage(null);

    try {
      const text = type === 'daily' ? generateDailyShareText() : generateWeeklyShareText();
      const title = type === 'daily' ? '건강일기 일일 보고서' : '건강일기 주간 보고서';

      // 스크린샷 캡처
      const imageBlob = await captureElement(ref.current);

      if (canShare()) {
        // Web Share API 사용
        const shared = await shareReport(imageBlob, text, title);
        if (shared) {
          setShareMessage('공유 완료!');
        }
      } else {
        // Fallback: 이미지 다운로드 + 텍스트 복사
        downloadImage(imageBlob, `health-report-${type}.png`);
        await copyToClipboard(text);
        setShareMessage('이미지 다운로드 및 텍스트 복사 완료!');
      }
    } catch (error) {
      console.error('Share error:', error);
      setShareMessage('공유 중 오류가 발생했습니다.');
    } finally {
      setIsSharing(false);
      // 메시지 3초 후 숨김
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  return (
    <div className="page report-page">
      {/* 탭 선택 */}
      <div className="report-tabs" role="tablist" aria-label="보고서 유형">
        <button
          role="tab"
          className={`report-tab ${activeTab === 'daily' ? 'report-tab--active' : ''}`}
          onClick={() => setActiveTab('daily')}
          aria-selected={activeTab === 'daily'}
        >
          일일 보고서
        </button>
        <button
          role="tab"
          className={`report-tab ${activeTab === 'weekly' ? 'report-tab--active' : ''}`}
          onClick={() => setActiveTab('weekly')}
          aria-selected={activeTab === 'weekly'}
        >
          주간 보고서
        </button>
      </div>

      {/* 공유 상태 메시지 */}
      {shareMessage && (
        <div className="share-message" role="status" aria-live="polite">
          {shareMessage}
        </div>
      )}

      {/* 일일 보고서 */}
      {activeTab === 'daily' && (
        <div role="tabpanel" aria-label="일일 보고서" className="report-content">
          <div className="report-header">
            <h2 className="report-date">{formatKoreanDate(new Date())}</h2>
            {todayReport.hasData && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('daily')}
                disabled={isSharing}
                icon="📤"
              >
                {isSharing ? '공유 중...' : '공유'}
              </Button>
            )}
          </div>

          <div ref={dailyReportRef} className="report-capture-area">
          {!todayReport.hasData ? (
            <Card className="report-empty">
              <p className="report-empty__text">
                오늘 기록이 없습니다.<br />
                컨디션이나 활동을 기록해 보세요!
              </p>
            </Card>
          ) : (
            <>
              {/* 컨디션 타임라인 */}
              {todayReport.conditions.length > 0 && (
                <Card className="report-card">
                  <h3 className="report-card__title">
                    💪 컨디션
                    {todayReport.conditions.length > 1 && (
                      <span className="report-card__count">{todayReport.conditions.length}회 기록</span>
                    )}
                  </h3>
                  <div className="report-timeline">
                    {todayReport.conditions.map((condition) => (
                      <div key={condition.id} className="timeline-item">
                        <span className="timeline-item__time">{formatTime(condition.timestamp)}</span>
                        <div className="timeline-item__content">
                          <div className="timeline-item__main">
                            <span className="timeline-item__emoji">
                              {MOOD_OPTIONS.find(m => m.value === condition.mood)?.emoji}
                            </span>
                            <span className="timeline-item__value">컨디션 {condition.overallCondition}/5</span>
                          </div>
                          {/* 증상 표시 */}
                          {condition.symptoms && !condition.symptoms.noSymptom && (
                            <div className="timeline-item__symptoms">
                              {(Object.keys(condition.symptoms) as Array<keyof Symptoms>)
                                .filter(key => key !== 'noSymptom' && condition.symptoms[key])
                                .map(key => SYMPTOM_LABELS[key])
                                .join(', ')}
                            </div>
                          )}
                          {/* 메모 */}
                          {condition.note && (
                            <div className="timeline-item__note">{condition.note}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 활동 타임라인 */}
              {todayReport.activities.length > 0 && (
                <Card className="report-card">
                  <h3 className="report-card__title">
                    🚶 활동
                    {todayReport.activities.length > 1 && (
                      <span className="report-card__count">
                        총 {todayReport.activities.reduce((sum, a) => sum + a.walking.duration, 0)}분
                      </span>
                    )}
                  </h3>
                  <div className="report-timeline">
                    {todayReport.activities.map((activity) => (
                      <div key={activity.id} className="timeline-item">
                        <span className="timeline-item__time">{formatTime(activity.timestamp)}</span>
                        <div className="timeline-item__content">
                          <div className="timeline-item__main">
                            <span className="timeline-item__value">{activity.walking.duration}분</span>
                            {activity.walking.duration >= 30 && (
                              <span className="timeline-item__badge">🎉</span>
                            )}
                          </div>
                          {/* 메모 */}
                          {activity.note && (
                            <div className="timeline-item__note">{activity.note}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
          </div>
        </div>
      )}

      {/* 주간 보고서 */}
      {activeTab === 'weekly' && (
        <div role="tabpanel" aria-label="주간 보고서" className="report-content">
          <div className="report-header">
            <h2 className="report-date">
              {weeklyReport.startDate.slice(5).replace('-', '/')} ~{' '}
              {weeklyReport.endDate.slice(5).replace('-', '/')}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('weekly')}
              disabled={isSharing}
              icon="📤"
            >
              {isSharing ? '공유 중...' : '공유'}
            </Button>
          </div>

          <div ref={weeklyReportRef} className="report-capture-area">
          {/* 요약 카드 */}
          <div className="report-summary-grid">
            <Card className="report-summary-card">
              <span className="report-summary-card__label">기록일</span>
              <span className="report-summary-card__value">{weeklyReport.recordedDays}일</span>
            </Card>
            <Card className="report-summary-card">
              <span className="report-summary-card__label">평균 컨디션</span>
              <span className="report-summary-card__value">
                {weeklyReport.averageCondition !== null
                  ? weeklyReport.averageCondition.toFixed(1)
                  : '-'}
              </span>
            </Card>
            <Card className="report-summary-card">
              <span className="report-summary-card__label">총 활동</span>
              <span className="report-summary-card__value">{weeklyReport.totalActivityMinutes}분</span>
            </Card>
          </div>

          {/* 컨디션 차트 */}
          <Card className="report-card">
            <h3 className="report-card__title">📊 컨디션 추이</h3>
            <ConditionChart data={weeklyReport.conditionData} />
          </Card>

          {/* 활동 차트 */}
          <Card className="report-card">
            <h3 className="report-card__title">📈 활동량</h3>
            <ActivityChart data={weeklyReport.activityData} />
          </Card>

          {/* 증상 TOP 3 */}
          {weeklyReport.symptomCounts.length > 0 && (
            <Card className="report-card">
              <h3 className="report-card__title">🩺 주요 증상</h3>
              <div className="report-symptom-ranking">
                {weeklyReport.symptomCounts.map((item, index) => (
                  <div key={item.symptom} className="report-symptom-item">
                    <span className="report-symptom-item__rank">{index + 1}</span>
                    <span className="report-symptom-item__name">{item.symptom}</span>
                    <span className="report-symptom-item__count">{item.count}회</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
