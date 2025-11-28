// 날짜 유틸리티 함수

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 두 날짜 사이의 일수 계산
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 밀리초
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round(Math.abs((d2.getTime() - d1.getTime()) / oneDay));
}

/**
 * 한국어 요일 반환
 */
export function getKoreanDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

/**
 * 날짜를 한국어로 포맷
 */
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = getKoreanDayOfWeek(date);
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 오늘 날짜인지 확인
 */
export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

/**
 * 어제 날짜인지 확인
 */
export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDate(yesterday);
}

/**
 * 상대적 날짜 표시
 */
export function getRelativeDate(dateStr: string): string {
  if (isToday(dateStr)) return '오늘';
  if (isYesterday(dateStr)) return '어제';

  const date = new Date(dateStr);
  return formatKoreanDate(date);
}

/**
 * 해당 월의 일수 반환
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 해당 월의 첫 번째 요일 (0=일, 1=월, ..., 6=토)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
