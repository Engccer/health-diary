// 컨디션 기록 타입 정의

export interface ConditionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  overallCondition: 1 | 2 | 3 | 4 | 5;
  symptoms: Symptoms;
  mood: 1 | 2 | 3 | 4 | 5;
  mealCount: number;
  note?: string;
}

export interface Symptoms {
  noSymptom: boolean; // 특별한 증상 없음
  dumpingSyndrome: boolean; // 덤핑증후군
  pain: boolean; // 통증
  fatigue: boolean; // 피로감
  indigestion: boolean; // 소화불량
  nausea: boolean; // 메스꺼움
  appetiteLoss: boolean; // 식욕부진
}

export const SYMPTOM_LABELS: Record<keyof Symptoms, string> = {
  dumpingSyndrome: '덤핑증후군',
  pain: '통증',
  fatigue: '피로감',
  indigestion: '소화불량',
  nausea: '메스꺼움',
  appetiteLoss: '식욕부진',
  noSymptom: '특별한 증상 없음',
};

export const CONDITION_LABELS = ['', '매우 안 좋음', '안 좋음', '보통', '좋음', '매우 좋음'];

export const MOOD_OPTIONS = [
  { value: 1 as const, emoji: '😢', label: '매우 안 좋음' },
  { value: 2 as const, emoji: '😕', label: '안 좋음' },
  { value: 3 as const, emoji: '😐', label: '보통' },
  { value: 4 as const, emoji: '🙂', label: '좋음' },
  { value: 5 as const, emoji: '😊', label: '매우 좋음' },
];

export const createEmptySymptoms = (): Symptoms => ({
  noSymptom: false,
  dumpingSyndrome: false,
  pain: false,
  fatigue: false,
  indigestion: false,
  nausea: false,
  appetiteLoss: false,
});
