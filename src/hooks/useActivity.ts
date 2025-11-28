import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage, STORAGE_KEYS } from './useLocalStorage';
import { ActivityRecord, createEmptyWalking } from '../types';
import { formatDate } from '../utils/date';

export function useActivity() {
  const [activities, setActivities] = useLocalStorage<ActivityRecord[]>(
    STORAGE_KEYS.ACTIVITIES,
    []
  );

  // 오늘의 모든 기록 가져오기
  const getTodayRecords = useCallback(() => {
    const today = formatDate(new Date());
    return activities
      .filter((a) => a.date === today)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [activities]);

  // 오늘 기록 가져오기 (마지막 기록)
  const getTodayRecord = useCallback(() => {
    const todayRecords = getTodayRecords();
    return todayRecords.length > 0 ? todayRecords[0] : undefined;
  }, [getTodayRecords]);

  // 특정 날짜의 모든 기록 가져오기
  const getRecordsByDate = useCallback(
    (date: string) => {
      return activities
        .filter((a) => a.date === date)
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    [activities]
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
      return activities.find((a) => a.id === id);
    },
    [activities]
  );

  // 특정 월의 기록 가져오기
  const getRecordsByMonth = useCallback(
    (year: number, month: number) => {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      return activities.filter((a) => a.date.startsWith(monthStr));
    },
    [activities]
  );

  // 최근 N개 기록 가져오기
  const getRecentRecords = useCallback(
    (count: number) => {
      const sorted = [...activities].sort((a, b) => b.timestamp - a.timestamp);
      return sorted.slice(0, count);
    },
    [activities]
  );

  // 새 기록 추가 (항상 새로 생성)
  const saveRecord = useCallback(
    (data: Partial<Omit<ActivityRecord, 'id' | 'date' | 'timestamp'>>) => {
      const record: ActivityRecord = {
        id: uuidv4(),
        date: formatDate(new Date()),
        timestamp: Date.now(),
        walking: data.walking ?? createEmptyWalking(),
        otherActivities: data.otherActivities,
        note: data.note,
      };

      setActivities([...activities, record]);
      return record;
    },
    [activities, setActivities]
  );

  // 기록 업데이트
  const updateRecord = useCallback(
    (id: string, data: Partial<Omit<ActivityRecord, 'id' | 'date'>>) => {
      const index = activities.findIndex((a) => a.id === id);
      if (index === -1) return null;

      const updated = [...activities];
      updated[index] = {
        ...updated[index],
        ...data,
        timestamp: Date.now(),
      };
      setActivities(updated);
      return updated[index];
    },
    [activities, setActivities]
  );

  // 기록 삭제
  const deleteRecord = useCallback(
    (id: string) => {
      setActivities(activities.filter((a) => a.id !== id));
    },
    [activities, setActivities]
  );

  // 모든 기록 삭제
  const clearAllRecords = useCallback(() => {
    setActivities([]);
  }, [setActivities]);

  // 주간 총 걷기 시간
  const getWeeklyWalkingMinutes = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    return activities
      .filter((a) => new Date(a.date) >= weekAgo)
      .reduce((sum, a) => sum + (a.walking?.duration || 0), 0);
  }, [activities]);

  // 총 활동 기록 수
  const getTotalActivityDays = useCallback(() => {
    const uniqueDates = new Set(
      activities.filter((a) => a.walking.duration > 0).map((a) => a.date)
    );
    return uniqueDates.size;
  }, [activities]);

  // 오늘 기록했는지 확인
  const hasRecordedToday = useCallback(() => {
    return getTodayRecords().length > 0;
  }, [getTodayRecords]);

  // 오늘 기록 횟수
  const getTodayRecordCount = useCallback(() => {
    return getTodayRecords().length;
  }, [getTodayRecords]);

  return {
    activities,
    getTodayRecord,
    getTodayRecords,
    getRecordByDate,
    getRecordsByDate,
    getRecordById,
    getRecordsByMonth,
    getRecentRecords,
    saveRecord,
    updateRecord,
    deleteRecord,
    clearAllRecords,
    getWeeklyWalkingMinutes,
    getTotalActivityDays,
    hasRecordedToday,
    getTodayRecordCount,
  };
}
