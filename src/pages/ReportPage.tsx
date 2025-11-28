import { useState, useRef } from 'react';
import { Card, Button } from '../components/common';
import { ConditionChart, ActivityChart } from '../components/report';
import { useReport } from '../hooks';
import { MOOD_OPTIONS, SYMPTOM_LABELS, Symptoms } from '../types';
import { formatKoreanDate } from '../utils/date';
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

    if (todayReport.condition) {
      const conditionLabel =
        todayReport.condition.overallCondition <= 2 ? '안 좋음' :
        todayReport.condition.overallCondition === 3 ? '보통' : '좋음';
      text += `💪 컨디션: ${todayReport.condition.overallCondition}/5 (${conditionLabel})\n`;

      const moodOption = MOOD_OPTIONS.find(m => m.value === todayReport.condition?.mood);
      if (moodOption) {
        text += `😊 기분: ${moodOption.label}\n`;
      }

      if (todayReport.condition.symptoms) {
        if (todayReport.condition.symptoms.noSymptom) {
          text += `🩺 증상: 특별한 증상 없음\n`;
        } else {
          const symptomList = (Object.keys(todayReport.condition.symptoms) as Array<keyof Symptoms>)
            .filter(key => key !== 'noSymptom' && todayReport.condition?.symptoms[key])
            .map(key => SYMPTOM_LABELS[key]);
          if (symptomList.length > 0) {
            text += `🩺 증상: ${symptomList.join(', ')}\n`;
          }
        }
      }
    }

    if (todayReport.activity) {
      text += `🚶 활동: ${todayReport.activity.walking.duration}분\n`;
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
              {/* 컨디션 요약 */}
              {todayReport.condition && (
                <Card className="report-card">
                  <h3 className="report-card__title">💪 컨디션</h3>
                  <div className="report-condition">
                    <div className="report-condition__score">
                      <span className="report-condition__value">
                        {todayReport.condition.overallCondition}
                      </span>
                      <span className="report-condition__max">/5</span>
                    </div>
                    <div className="report-condition__gauge">
                      <div
                        className="report-condition__fill"
                        style={{ width: `${(todayReport.condition.overallCondition / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 기분 */}
                  <div className="report-mood">
                    <span className="report-mood__label">기분:</span>
                    <span className="report-mood__emoji">
                      {MOOD_OPTIONS.find(m => m.value === todayReport.condition?.mood)?.emoji}
                    </span>
                    <span className="report-mood__text">
                      {MOOD_OPTIONS.find(m => m.value === todayReport.condition?.mood)?.label}
                    </span>
                  </div>

                  {/* 증상 */}
                  {todayReport.condition.symptoms && (
                    <div className="report-symptoms">
                      <span className="report-symptoms__label">증상:</span>
                      {todayReport.condition.symptoms.noSymptom ? (
                        <span className="report-symptoms__none">특별한 증상 없음 ✓</span>
                      ) : (
                        <div className="report-symptoms__list">
                          {(Object.keys(todayReport.condition.symptoms) as Array<keyof Symptoms>)
                            .filter(key => key !== 'noSymptom' && todayReport.condition?.symptoms[key])
                            .map(key => (
                              <span key={key} className="report-symptoms__tag">
                                {SYMPTOM_LABELS[key]}
                              </span>
                            ))}
                          {(Object.keys(todayReport.condition.symptoms) as Array<keyof Symptoms>)
                            .filter(key => key !== 'noSymptom' && todayReport.condition?.symptoms[key])
                            .length === 0 && (
                            <span className="report-symptoms__none">기록된 증상 없음</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 메모 */}
                  {todayReport.condition.note && (
                    <div className="report-note">
                      <span className="report-note__label">메모:</span>
                      <p className="report-note__text">{todayReport.condition.note}</p>
                    </div>
                  )}
                </Card>
              )}

              {/* 활동 요약 */}
              {todayReport.activity && (
                <Card className="report-card">
                  <h3 className="report-card__title">🚶 활동</h3>
                  <div className="report-activity">
                    <span className="report-activity__value">
                      {todayReport.activity.walking.duration}
                    </span>
                    <span className="report-activity__unit">분</span>
                    {todayReport.activity.walking.duration >= 30 && (
                      <span className="report-activity__badge">🎉 목표 달성!</span>
                    )}
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
