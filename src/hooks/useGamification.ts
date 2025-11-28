import { useCallback, useMemo } from 'react';
import { useLocalStorage, STORAGE_KEYS } from './useLocalStorage';
import { UserProgress, createInitialProgress, POINTS } from '../types';
import { LEVELS, getLevelByPoints, getProgressToNextLevel } from '../data/levels';
import { BADGES, checkBadgeEarned } from '../data/badges';
import { formatDate, daysBetween } from '../utils/date';

export function useGamification() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.PROGRESS,
    createInitialProgress()
  );

  // 현재 레벨 정보
  const currentLevel = useMemo(
    () => getLevelByPoints(progress.totalPoints),
    [progress.totalPoints]
  );

  // 다음 레벨까지 진행률
  const levelProgress = useMemo(
    () => getProgressToNextLevel(progress.totalPoints),
    [progress.totalPoints]
  );

  // 스트릭 계산 및 업데이트
  const updateStreak = useCallback(() => {
    const today = formatDate(new Date());
    const lastDate = progress.lastRecordDate;

    if (!lastDate) {
      // 첫 기록
      return { currentStreak: 1, isNewStreak: true };
    }

    if (lastDate === today) {
      // 오늘 이미 기록함
      return { currentStreak: progress.currentStreak, isNewStreak: false };
    }

    const daysDiff = daysBetween(new Date(lastDate), new Date(today));

    if (daysDiff === 1) {
      // 어제 기록 -> 스트릭 유지
      return { currentStreak: progress.currentStreak + 1, isNewStreak: true };
    } else {
      // 스트릭 끊김 -> 1부터 시작
      return { currentStreak: 1, isNewStreak: true };
    }
  }, [progress.lastRecordDate, progress.currentStreak]);

  // 포인트 추가 및 뱃지 확인
  const addPoints = useCallback(
    (points: number, options?: { isCondition?: boolean; isActivity?: boolean; walkingMinutes?: number }) => {
      const today = formatDate(new Date());
      const { currentStreak, isNewStreak } = updateStreak();

      let totalPointsToAdd = points;

      // 30분 이상 걷기 보너스
      if (options?.walkingMinutes && options.walkingMinutes >= 30) {
        totalPointsToAdd += POINTS.WALKING_30MIN;
      }

      // 주간/월간 보너스
      if (isNewStreak) {
        if (currentStreak === 7) {
          totalPointsToAdd += POINTS.WEEKLY_STREAK;
        }
        if (currentStreak === 30) {
          totalPointsToAdd += POINTS.MONTHLY_STREAK;
        }
      }

      const newTotalPoints = progress.totalPoints + totalPointsToAdd;
      const newLevel = getLevelByPoints(newTotalPoints);
      const newTotalRecordDays = isNewStreak
        ? progress.totalRecordDays + 1
        : progress.totalRecordDays;
      const newLongestStreak = Math.max(progress.longestStreak, currentStreak);

      // 새로 획득한 뱃지 확인
      const stats = {
        currentStreak,
        longestStreak: newLongestStreak,
        totalRecordDays: newTotalRecordDays,
        currentLevel: newLevel.level,
        totalActivities: options?.isActivity ? 1 : 0, // 단순화
      };

      const newBadges: string[] = [];
      for (const badge of BADGES) {
        if (
          !progress.earnedBadges.includes(badge.id) &&
          checkBadgeEarned(badge, stats)
        ) {
          newBadges.push(badge.id);
        }
      }

      const updatedProgress: UserProgress = {
        ...progress,
        totalPoints: newTotalPoints,
        currentLevel: newLevel.level,
        currentStreak: isNewStreak ? currentStreak : progress.currentStreak,
        longestStreak: newLongestStreak,
        lastRecordDate: today,
        earnedBadges: [...progress.earnedBadges, ...newBadges],
        totalRecordDays: newTotalRecordDays,
      };

      setProgress(updatedProgress);

      return {
        pointsAdded: totalPointsToAdd,
        newBadges,
        levelUp: newLevel.level > progress.currentLevel,
        newLevel: newLevel.level > progress.currentLevel ? newLevel : null,
      };
    },
    [progress, setProgress, updateStreak]
  );

  // 획득한 뱃지 목록
  const earnedBadges = useMemo(
    () => BADGES.filter((b) => progress.earnedBadges.includes(b.id)),
    [progress.earnedBadges]
  );

  // 미획득 뱃지 목록
  const unearnedBadges = useMemo(
    () => BADGES.filter((b) => !progress.earnedBadges.includes(b.id)),
    [progress.earnedBadges]
  );

  return {
    progress,
    currentLevel,
    levelProgress,
    levels: LEVELS,
    earnedBadges,
    unearnedBadges,
    addPoints,
  };
}
