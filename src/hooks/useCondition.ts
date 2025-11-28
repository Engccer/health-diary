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

  // 오늘의 모든 기록 가져오기
  const getTodayRecords = useCallback(() => {
    const today = formatDate(new Date());
    return conditions
      .filter((c) => c.date === today)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [conditions]);

  // 오늘 기록 가져오기 (마지막 기록)
  const getTodayRecord = useCallback(() => {
    const todayRecords = getTodayRecords();
    return todayRecords.length > 0 ? todayRecords[0] : undefined;
  }, [getTodayRecords]);

  // 특정 날짜의 모든 기록 가져오기
  const getRecordsByDate = useCallback(
    (date: string) => {
      return conditions
        .filter((c) => c.date === date)
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    [conditions]
  );

  // 특정 날짜 기록 가져오기 (마지막 기록, 하위 호환성)
  const getRecordByDate = useCallback(
    (date: string) => {
      const records = getRecordsByDate(date);
      return records.length > 0 ? records[0] : undefined;
    },
    [getRecordsByDate]
  );

  // ID로 기록 가져오기
  const getRecordById = useCallback(
    (id: string) => {
      return conditions.find((c) => c.id === id);
    },
    [conditions]
  );

  // 최근 N개 기록 가져오기
  const getRecentRecords = useCallback(
    (count: number) => {
      const sorted = [...conditions].sort((a, b) => b.timestamp - a.timestamp);
      return sorted.slice(0, count);
    },
    [conditions]
  );

  // 새 기록 추가 (항상 새로 생성)
  const saveRecord = useCallback(
    (data: Partial<Omit<ConditionRecord, 'id' | 'date' | 'timestamp'>>) => {
      const record: ConditionRecord = {
        id: uuidv4(),
        date: formatDate(new Date()),
        timestamp: Date.now(),
        overallCondition: data.overallCondition ?? 3,
        symptoms: data.symptoms ?? createEmptySymptoms(),
        mood: data.mood ?? 3,
        mealCount: data.mealCount ?? 6,
        note: data.note,
      };

      setConditions([...conditions, record]);
      return record;
    },
    [conditions, setConditions]
  );

  // 기록 업데이트
  const updateRecord = useCallback(
    (id: string, data: Partial<Omit<ConditionRecord, 'id' | 'date'>>) => {
      const index = conditions.findIndex((c) => c.id === id);
      if (index === -1) return null;

      const updated = [...conditions];
      updated[index] = {
        ...updated[index],
        ...data,
        timestamp: Date.now(),
      };
      setConditions(updated);
      return updated[index];
    },
    [conditions, setConditions]
  );

  // 기록 삭제
  const deleteRecord = useCallback(
    (id: string) => {
      setConditions(conditions.filter((c) => c.id !== id));
    },
    [conditions, setConditions]
  );

  // 모든 기록 삭제
  const clearAllRecords = useCallback(() => {
    setConditions([]);
  }, [setConditions]);

  // 기록된 날 수 계산
  const getTotalRecordDays = useCallback(() => {
    const uniqueDates = new Set(conditions.map((c) => c.date));
    return uniqueDates.size;
  }, [conditions]);

  // 오늘 기록했는지 확인
  const hasRecordedToday = useCallback(() => {
    return getTodayRecords().length > 0;
  }, [getTodayRecords]);

  // 오늘 기록 횟수
  const getTodayRecordCount = useCallback(() => {
    return getTodayRecords().length;
  }, [getTodayRecords]);

  return {
    conditions,
    getTodayRecord,
    getTodayRecords,
    getRecordByDate,
    getRecordsByDate,
    getRecordById,
    getRecentRecords,
    saveRecord,
    updateRecord,
    deleteRecord,
    clearAllRecords,
    getTotalRecordDays,
    hasRecordedToday,
    getTodayRecordCount,
  };
}
