import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage, STORAGE_KEYS } from './useLocalStorage';
import { ConditionRecord, createEmptySymptoms } from '../types';
import { formatDate } from '../utils/date';

export function useCondition() {
  const [conditions, setConditions] = useLocalStorage<ConditionRecord[]>(
    STORAGE_KEYS.CONDITIONS,
    []
  );

  // 오늘 기록 가져오기
  const getTodayRecord = useCallback(() => {
    const today = formatDate(new Date());
    return conditions.find((c) => c.date === today);
  }, [conditions]);

  // 특정 날짜 기록 가져오기
  const getRecordByDate = useCallback(
    (date: string) => {
      return conditions.find((c) => c.date === date);
    },
    [conditions]
  );

  // 최근 N일 기록 가져오기
  const getRecentRecords = useCallback(
    (days: number) => {
      const sorted = [...conditions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sorted.slice(0, days);
    },
    [conditions]
  );

  // 기록 추가 또는 업데이트
  const saveRecord = useCallback(
    (data: Partial<Omit<ConditionRecord, 'id' | 'date' | 'timestamp'>>) => {
      const today = formatDate(new Date());
      const existingIndex = conditions.findIndex((c) => c.date === today);

      const record: ConditionRecord = {
        id: existingIndex >= 0 ? conditions[existingIndex].id : uuidv4(),
        date: today,
        timestamp: Date.now(),
        overallCondition: data.overallCondition ?? 3,
        symptoms: data.symptoms ?? createEmptySymptoms(),
        mood: data.mood ?? 3,
        mealCount: data.mealCount ?? 6,
        note: data.note,
      };

      if (existingIndex >= 0) {
        const updated = [...conditions];
        updated[existingIndex] = record;
        setConditions(updated);
      } else {
        setConditions([...conditions, record]);
      }

      return record;
    },
    [conditions, setConditions]
  );

  // 기록된 날 수 계산
  const getTotalRecordDays = useCallback(() => {
    const uniqueDates = new Set(conditions.map((c) => c.date));
    return uniqueDates.size;
  }, [conditions]);

  // 오늘 기록했는지 확인
  const hasRecordedToday = useCallback(() => {
    return !!getTodayRecord();
  }, [getTodayRecord]);

  return {
    conditions,
    getTodayRecord,
    getRecordByDate,
    getRecentRecords,
    saveRecord,
    getTotalRecordDays,
    hasRecordedToday,
  };
}
