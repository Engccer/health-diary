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

/**
 * 시간을 오전/오후 형식으로 포맷 (예: "오전 9:30")
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');
  return `${period} ${displayHours}:${displayMinutes}`;
}

/**
 * 상대적 날짜와 시간 표시 (예: "오늘 오전 9:30", "어제 오후 3:15")
 */
export function getRelativeDateTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const dateStr = formatDate(date);
  const timeStr = formatTime(timestamp);

  if (isToday(dateStr)) return `오늘 ${timeStr}`;
  if (isYesterday(dateStr)) return `어제 ${timeStr}`;

  return `${formatKoreanDate(date)} ${timeStr}`;
}

/**
 * 시간대 구분 (6개 구간)
 */
export type TimeOfDay = 'earlyMorning' | 'morning' | 'afternoon' | 'lateAfternoon' | 'evening' | 'night';

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 7) return 'earlyMorning';   // 이른 아침: 5-7시
  if (hour >= 7 && hour < 12) return 'morning';       // 오전: 7-12시
  if (hour >= 12 && hour < 15) return 'afternoon';    // 오후: 12-15시
  if (hour >= 15 && hour < 18) return 'lateAfternoon'; // 늦은 오후: 15-18시
  if (hour >= 18 && hour < 21) return 'evening';      // 저녁: 18-21시
  return 'night';                                      // 밤: 21-5시
}
