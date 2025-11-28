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

  // 오늘 기록 가져오기
  const getTodayRecord = useCallback(() => {
    const today = formatDate(new Date());
    return activities.find((a) => a.date === today);
  }, [activities]);

  // 특정 날짜 기록 가져오기
  const getRecordByDate = useCallback(
    (date: string) => {
      return activities.find((a) => a.date === date);
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

  // 최근 N일 기록 가져오기
  const getRecentRecords = useCallback(
    (days: number) => {
      const sorted = [...activities].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sorted.slice(0, days);
    },
    [activities]
  );

  // 기록 추가 또는 업데이트
  const saveRecord = useCallback(
    (data: Partial<Omit<ActivityRecord, 'id' | 'date' | 'timestamp'>>) => {
      const today = formatDate(new Date());
      const existingIndex = activities.findIndex((a) => a.date === today);

      const record: ActivityRecord = {
        id: existingIndex >= 0 ? activities[existingIndex].id : uuidv4(),
        date: today,
        timestamp: Date.now(),
        walking: data.walking ?? createEmptyWalking(),
        otherActivities: data.otherActivities,
        note: data.note,
      };

      if (existingIndex >= 0) {
        const updated = [...activities];
        updated[existingIndex] = record;
        setActivities(updated);
      } else {
        setActivities([...activities, record]);
      }

      return record;
    },
    [activities, setActivities]
  );

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
    return activities.filter((a) => a.walking.duration > 0).length;
  }, [activities]);

  // 오늘 기록했는지 확인
  const hasRecordedToday = useCallback(() => {
    return !!getTodayRecord();
  }, [getTodayRecord]);

  return {
    activities,
    getTodayRecord,
    getRecordByDate,
    getRecordsByMonth,
    getRecentRecords,
    saveRecord,
    getWeeklyWalkingMinutes,
    getTotalActivityDays,
    hasRecordedToday,
  };
}
