// 건강 정보 타입 정의

export type InfoCategory = 'diet' | 'exercise' | 'symptom' | 'checkup' | 'mental';

export interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: InfoCategory;
  icon: string;
  readTime: number; // 분 단위
}

export const CATEGORY_LABELS: Record<InfoCategory, string> = {
  diet: '식사',
  exercise: '운동',
  symptom: '증상 관리',
  checkup: '정기 검진',
  mental: '마음 건강',
};

export const CATEGORY_ICONS: Record<InfoCategory, string> = {
  diet: '🍽️',
  exercise: '🏃',
  symptom: '💊',
  checkup: '🏥',
  mental: '💝',
};
