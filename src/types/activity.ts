// 활동 기록 타입 정의

export interface ActivityRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  walking: WalkingRecord;
  otherActivities?: string[];
  note?: string;
}

export interface WalkingRecord {
  duration: number; // 분 단위
  distance?: number; // 미터 단위 (선택)
}

export interface ActivityType {
  id: string;
  label: string;
  icon: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'walking', label: '걷기/산책', icon: '🚶' },
  { id: 'stretching', label: '스트레칭', icon: '🧘' },
  { id: 'housework', label: '집안일', icon: '🏠' },
  { id: 'gardening', label: '정원 가꾸기', icon: '🌱' },
];

export const createEmptyWalking = (): WalkingRecord => ({
  duration: 0,
  distance: undefined,
});
