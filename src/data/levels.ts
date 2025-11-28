import { Level } from '../types';

export const LEVELS: Level[] = [
  { level: 1, name: '시작하는 걸음', minPoints: 0, maxPoints: 99, icon: '🌱' },
  { level: 2, name: '성장하는 새싹', minPoints: 100, maxPoints: 299, icon: '🌿' },
  { level: 3, name: '튼튼한 줄기', minPoints: 300, maxPoints: 599, icon: '🌳' },
  { level: 4, name: '피어나는 꽃', minPoints: 600, maxPoints: 999, icon: '🌸' },
  { level: 5, name: '열매 맺는 나무', minPoints: 1000, maxPoints: 1499, icon: '🍎' },
  { level: 6, name: '빛나는 햇살', minPoints: 1500, maxPoints: 2099, icon: '☀️' },
  { level: 7, name: '무지개 건강', minPoints: 2100, maxPoints: 2799, icon: '🌈' },
  { level: 8, name: '건강 마스터', minPoints: 2800, maxPoints: Infinity, icon: '👑' },
];

export function getLevelByPoints(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getProgressToNextLevel(points: number): number {
  const currentLevel = getLevelByPoints(points);
  if (currentLevel.level === LEVELS.length) return 100;

  const pointsInLevel = points - currentLevel.minPoints;
  const levelRange = currentLevel.maxPoints - currentLevel.minPoints + 1;
  return Math.min(100, Math.floor((pointsInLevel / levelRange) * 100));
}
