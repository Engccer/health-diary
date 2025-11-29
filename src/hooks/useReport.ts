import { useMemo } from 'react';
import { useCondition, useActivity } from './index';
import { ConditionRecord, ActivityRecord, SYMPTOM_LABELS, Symptoms } from '../types';
import { formatDate } from '../utils/date';

export interface DailyReportData {
  date: string;
  conditions: ConditionRecord[];  // 모든 컨디션 기록 (타임라인용)
  activities: ActivityRecord[];   // 모든 활동 기록 (타임라인용)
  hasData: boolean;
}

export interface WeeklyReportData {
  startDate: string;
  endDate: string;
  conditionData: { date: string; value: number | null; dayLabel: string }[];
  activityData: { date: string; value: number; dayLabel: string }[];
  averageCondition: number | null;
  totalActivityMinutes: number;
  symptomCounts: { symptom: string; count: number }[];
  recordedDays: number;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export function useReport() {
  const { conditions: conditionRecords } = useCondition();
  const { activities: activityRecords } = useActivity();

  const getTodayReport = useMemo((): DailyReportData => {
    const today = formatDate(new Date());

    // 오늘의 모든 기록을 시간순으로 정렬
    const conditions = conditionRecords
      .filter(r => r.date === today)
      .sort((a, b) => a.timestamp - b.timestamp);

    const activities = activityRecords
      .filter(r => r.date === today)
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      date: today,
      conditions,
      activities,
      hasData: conditions.length > 0 || activities.length > 0,
    };
  }, [conditionRecords, activityRecords]);

  const getWeeklyReport = useMemo((): WeeklyReportData => {
    const today = new Date();
    const dates: string[] = [];

    // 최근 7일 날짜 생성
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date));
    }

    // 컨디션 데이터 (같은 날 여러 기록 → 평균값)
    const conditionData = dates.map(date => {
      const dayRecords = conditionRecords.filter(r => r.date === date);
      const dayOfWeek = new Date(date).getDay();
      const avgValue = dayRecords.length > 0
        ? dayRecords.reduce((sum, r) => sum + r.overallCondition, 0) / dayRecords.length
        : null;
      return {
        date,
        value: avgValue,
        dayLabel: DAY_LABELS[dayOfWeek],
      };
    });

    // 활동 데이터 (같은 날 여러 기록 → 합계)
    const activityData = dates.map(date => {
      const dayRecords = activityRecords.filter(r => r.date === date);
      const dayOfWeek = new Date(date).getDay();
      const totalValue = dayRecords.reduce((sum, r) => sum + r.walking.duration, 0);
      return {
        date,
        value: totalValue,
        dayLabel: DAY_LABELS[dayOfWeek],
      };
    });

    // 평균 컨디션
    const validConditions = conditionData.filter(d => d.value !== null);
    const averageCondition = validConditions.length > 0
      ? validConditions.reduce((sum, d) => sum + (d.value ?? 0), 0) / validConditions.length
      : null;

    // 총 활동 시간
    const totalActivityMinutes = activityData.reduce((sum, d) => sum + d.value, 0);

    // 증상 빈도
    const symptomCountMap: Record<string, number> = {};
    const weekConditions = conditionRecords.filter(r => dates.includes(r.date));

    weekConditions.forEach(record => {
      if (record.symptoms) {
        (Object.keys(record.symptoms) as Array<keyof Symptoms>).forEach(key => {
          if (key !== 'noSymptom' && record.symptoms[key]) {
            const label = SYMPTOM_LABELS[key];
            symptomCountMap[label] = (symptomCountMap[label] || 0) + 1;
          }
        });
      }
    });

    const symptomCounts = Object.entries(symptomCountMap)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      startDate: dates[0],
      endDate: dates[6],
      conditionData,
      activityData,
      averageCondition,
      totalActivityMinutes,
      symptomCounts,
      recordedDays: validConditions.length,
    };
  }, [conditionRecords, activityRecords]);

  return {
    getTodayReport,
    getWeeklyReport,
  };
}
