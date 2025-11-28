// 게이미피케이션 타입 정의

export interface UserProgress {
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastRecordDate: string | null;
  earnedBadges: string[];
  totalRecordDays: number;
  joinDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: BadgeCondition;
}

export interface BadgeCondition {
  type: 'streak' | 'totalDays' | 'level' | 'activity' | 'special';
  value: number;
}

export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}

// 포인트 상수
export const POINTS = {
  DAILY_CONDITION: 10,
  DAILY_ACTIVITY: 10,
  WALKING_30MIN: 5,
  WEEKLY_STREAK: 50,
  MONTHLY_STREAK: 200,
};

export const createInitialProgress = (): UserProgress => ({
  totalPoints: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastRecordDate: null,
  earnedBadges: [],
  totalRecordDays: 0,
  joinDate: new Date().toISOString().split('T')[0],
});
