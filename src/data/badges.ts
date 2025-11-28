import { Badge } from '../types';

export const BADGES: Badge[] = [
  // 스트릭 뱃지
  {
    id: 'streak-3',
    name: '첫 발걸음',
    description: '3일 연속 기록 달성',
    icon: '🔥',
    condition: { type: 'streak', value: 3 },
  },
  {
    id: 'streak-7',
    name: '일주일의 약속',
    description: '7일 연속 기록 달성',
    icon: '⭐',
    condition: { type: 'streak', value: 7 },
  },
  {
    id: 'streak-14',
    name: '2주간의 습관',
    description: '14일 연속 기록 달성',
    icon: '🌟',
    condition: { type: 'streak', value: 14 },
  },
  {
    id: 'streak-30',
    name: '한 달의 기적',
    description: '30일 연속 기록 달성',
    icon: '💫',
    condition: { type: 'streak', value: 30 },
  },
  {
    id: 'streak-100',
    name: '100일의 여정',
    description: '100일 연속 기록 달성',
    icon: '🏆',
    condition: { type: 'streak', value: 100 },
  },
  // 총 기록일 뱃지
  {
    id: 'total-7',
    name: '꾸준한 시작',
    description: '총 7일 기록 달성',
    icon: '📅',
    condition: { type: 'totalDays', value: 7 },
  },
  {
    id: 'total-30',
    name: '한 달의 발자취',
    description: '총 30일 기록 달성',
    icon: '📆',
    condition: { type: 'totalDays', value: 30 },
  },
  {
    id: 'total-100',
    name: '100일의 기록',
    description: '총 100일 기록 달성',
    icon: '📚',
    condition: { type: 'totalDays', value: 100 },
  },
  // 활동 뱃지
  {
    id: 'walk-first',
    name: '첫 산책',
    description: '첫 활동 기록 완료',
    icon: '👟',
    condition: { type: 'activity', value: 1 },
  },
  // 특별 뱃지
  {
    id: 'first-record',
    name: '시작이 반',
    description: '첫 기록 완료',
    icon: '🎉',
    condition: { type: 'special', value: 1 },
  },
  {
    id: 'level-5',
    name: '열매 맺다',
    description: '레벨 5 달성',
    icon: '🍎',
    condition: { type: 'level', value: 5 },
  },
  {
    id: 'level-8',
    name: '건강 마스터',
    description: '최고 레벨 달성',
    icon: '👑',
    condition: { type: 'level', value: 8 },
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}

export function checkBadgeEarned(badge: Badge, stats: {
  currentStreak: number;
  longestStreak: number;
  totalRecordDays: number;
  currentLevel: number;
  totalActivities: number;
}): boolean {
  switch (badge.condition.type) {
    case 'streak':
      return stats.longestStreak >= badge.condition.value;
    case 'totalDays':
      return stats.totalRecordDays >= badge.condition.value;
    case 'level':
      return stats.currentLevel >= badge.condition.value;
    case 'activity':
      return stats.totalActivities >= badge.condition.value;
    case 'special':
      return stats.totalRecordDays >= badge.condition.value;
    default:
      return false;
  }
}
